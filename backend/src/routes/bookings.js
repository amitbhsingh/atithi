const express = require('express');
const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Host = require('../models/Host');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { sendBookingConfirmation, sendBookingCancellation } = require('../utils/email');

const router = express.Router();

// Get user's bookings
router.get('/', auth, async (req, res) => {
  try {
    const { status, type = 'all' } = req.query;
    const query = {};

    if (req.user.role === 'host') {
      // Get bookings for this host
      const host = await Host.findOne({ user: req.user.userId });
      if (host) {
        query.host = host._id;
      }
    } else {
      // Get bookings by this guest
      query.guest = req.user.userId;
    }

    if (status) {
      query.status = status;
    }

    // Filter by booking type (upcoming, past, etc.)
    const now = new Date();
    if (type === 'upcoming') {
      query.checkIn = { $gte: now };
      query.status = 'confirmed';
    } else if (type === 'past') {
      query.checkOut = { $lt: now };
    } else if (type === 'active') {
      query.checkIn = { $lte: now };
      query.checkOut = { $gte: now };
      query.status = 'confirmed';
    }

    const bookings = await Booking.find(query)
      .populate('guest', 'firstName lastName profilePicture')
      .populate({
        path: 'host',
        populate: {
          path: 'user',
          select: 'firstName lastName profilePicture'
        }
      })
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single booking
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('guest', 'firstName lastName profilePicture phone email')
      .populate({
        path: 'host',
        populate: {
          path: 'user',
          select: 'firstName lastName profilePicture phone email'
        }
      });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is authorized to view this booking
    const host = await Host.findOne({ user: req.user.userId });
    const isGuest = booking.guest._id.toString() === req.user.userId;
    const isHost = host && booking.host._id.toString() === host._id.toString();

    if (!isGuest && !isHost) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create booking
router.post('/', auth, [
  body('host').notEmpty(),
  body('experience').isIn(['cooking', 'homestay', 'cultural-tour', 'language-exchange', 'craft-workshop']),
  body('checkIn').isISO8601(),
  body('checkOut').isISO8601(),
  body('guests.adults').isInt({ min: 1 }),
  body('pricing.basePrice').isNumeric({ min: 1 }),
  body('pricing.serviceFee').isNumeric({ min: 0 }),
  body('pricing.total').isNumeric({ min: 1 }),
  body('payment.method').isIn(['credit-card', 'debit-card', 'paypal', 'bank-transfer'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const bookingData = {
      guest: req.user.userId,
      ...req.body
    };

    // Validate dates
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const now = new Date();

    if (checkIn <= now) {
      return res.status(400).json({ message: 'Check-in date must be in the future' });
    }

    if (checkOut <= checkIn) {
      return res.status(400).json({ message: 'Check-out date must be after check-in date' });
    }

    // Check if host exists and is available
    const host = await Host.findById(bookingData.host);
    if (!host) {
      return res.status(404).json({ message: 'Host not found' });
    }

    if (host.status !== 'approved') {
      return res.status(400).json({ message: 'Host is not available for booking' });
    }

    // Check for overlapping bookings
    const overlappingBooking = await Booking.findOne({
      host: bookingData.host,
      status: { $in: ['confirmed', 'pending'] },
      $or: [
        { checkIn: { $lte: checkIn }, checkOut: { $gt: checkIn } },
        { checkIn: { $lt: checkOut }, checkOut: { $gte: checkOut } },
        { checkIn: { $gte: checkIn }, checkOut: { $lte: checkOut } }
      ]
    });

    if (overlappingBooking) {
      return res.status(400).json({ message: 'Selected dates are not available' });
    }

    const booking = new Booking(bookingData);
    await booking.save();

    // Populate the created booking
    const populatedBooking = await Booking.findById(booking._id)
      .populate('guest', 'firstName lastName email')
      .populate({
        path: 'host',
        populate: {
          path: 'user',
          select: 'firstName lastName email'
        }
      });

    // Send confirmation emails
    await sendBookingConfirmation(populatedBooking);

    res.status(201).json({
      message: 'Booking created successfully',
      booking: populatedBooking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update booking status
router.put('/:id/status', auth, [
  body('status').isIn(['confirmed', 'cancelled', 'completed'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check authorization
    const host = await Host.findOne({ user: req.user.userId });
    const isGuest = booking.guest.toString() === req.user.userId;
    const isHost = host && booking.host.toString() === host._id.toString();

    if (!isGuest && !isHost) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update booking status
    booking.status = req.body.status;
    await booking.save();

    res.json({
      message: 'Booking status updated successfully',
      booking
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel booking
router.post('/:id/cancel', auth, [
  body('reason').optional().trim()
], async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check authorization
    const host = await Host.findOne({ user: req.user.userId });
    const isGuest = booking.guest.toString() === req.user.userId;
    const isHost = host && booking.host.toString() === host._id.toString();

    if (!isGuest && !isHost) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check if cancellation is allowed
    if (!booking.canCancel) {
      return res.status(400).json({ message: 'Cancellation not allowed for this booking' });
    }

    // Update booking
    booking.status = 'cancelled';
    booking.cancellation = {
      cancelled: true,
      cancelledBy: req.user.role === 'host' ? 'host' : 'guest',
      cancellationDate: new Date(),
      reason: req.body.reason || ''
    };

    await booking.save();

    // Send cancellation emails
    await sendBookingCancellation(booking);

    res.json({
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add message to booking
router.post('/:id/messages', auth, [
  body('message').notEmpty().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check authorization
    const host = await Host.findOne({ user: req.user.userId });
    const isGuest = booking.guest.toString() === req.user.userId;
    const isHost = host && booking.host.toString() === host._id.toString();

    if (!isGuest && !isHost) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Add message
    booking.communication.push({
      sender: req.user.userId,
      message: req.body.message,
      timestamp: new Date()
    });

    await booking.save();

    res.json({
      message: 'Message added successfully',
      communication: booking.communication
    });
  } catch (error) {
    console.error('Add message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;