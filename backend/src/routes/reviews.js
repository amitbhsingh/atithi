const express = require('express');
const { body, validationResult } = require('express-validator');
const Review = require('../models/Review');
const Booking = require('../models/Booking');
const Host = require('../models/Host');
const auth = require('../middleware/auth');

const router = express.Router();

// Get reviews for a host
router.get('/host/:hostId', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const reviews = await Review.find({
      reviewee: req.params.hostId,
      type: 'guest-to-host'
    })
      .populate('reviewer', 'firstName lastName profilePicture')
      .populate('booking', 'checkIn checkOut experience')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments({
      reviewee: req.params.hostId,
      type: 'guest-to-host'
    });

    // Calculate rating statistics
    const ratingStats = await Review.aggregate([
      {
        $match: {
          reviewee: req.params.hostId,
          type: 'guest-to-host'
        }
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$ratings.overall' },
          totalReviews: { $sum: 1 },
          ratingBreakdown: {
            $push: {
              rating: '$ratings.overall',
              cleanliness: '$ratings.cleanliness',
              communication: '$ratings.communication',
              cultural: '$ratings.cultural',
              cooking: '$ratings.cooking',
              hospitality: '$ratings.hospitality'
            }
          }
        }
      }
    ]);

    res.json({
      reviews,
      stats: ratingStats[0] || { averageRating: 0, totalReviews: 0, ratingBreakdown: [] },
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get host reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get reviews by a user
router.get('/user/:userId', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const reviews = await Review.find({
      reviewer: req.params.userId
    })
      .populate('reviewee', 'firstName lastName profilePicture')
      .populate('booking', 'checkIn checkOut experience')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments({
      reviewer: req.params.userId
    });

    res.json({
      reviews,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create review
router.post('/', auth, [
  body('booking').notEmpty(),
  body('reviewee').notEmpty(),
  body('type').isIn(['guest-to-host', 'host-to-guest']),
  body('ratings.overall').isInt({ min: 1, max: 5 }),
  body('comment').notEmpty().trim().isLength({ min: 10, max: 1000 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { booking: bookingId, reviewee, type, ratings, comment, highlights } = req.body;

    // Check if booking exists and user is authorized
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if booking is completed
    if (booking.status !== 'completed') {
      return res.status(400).json({ message: 'Can only review completed bookings' });
    }

    // Check authorization based on review type
    let authorized = false;
    if (type === 'guest-to-host' && booking.guest.toString() === req.user.userId) {
      authorized = true;
    } else if (type === 'host-to-guest') {
      const host = await Host.findOne({ user: req.user.userId });
      if (host && booking.host.toString() === host._id.toString()) {
        authorized = true;
      }
    }

    if (!authorized) {
      return res.status(403).json({ message: 'Not authorized to review this booking' });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
      booking: bookingId,
      reviewer: req.user.userId,
      type
    });

    if (existingReview) {
      return res.status(400).json({ message: 'Review already exists for this booking' });
    }

    // Create review
    const review = new Review({
      booking: bookingId,
      reviewer: req.user.userId,
      reviewee,
      type,
      ratings,
      comment,
      highlights: highlights || []
    });

    await review.save();

    // Update booking with review reference
    if (type === 'guest-to-host') {
      booking.reviews.guestReviewId = review._id;
    } else {
      booking.reviews.hostReviewId = review._id;
    }
    await booking.save();

    // Update host ratings if this is a guest-to-host review
    if (type === 'guest-to-host') {
      await updateHostRatings(reviewee);
    }

    // Populate the created review
    const populatedReview = await Review.findById(review._id)
      .populate('reviewer', 'firstName lastName profilePicture')
      .populate('reviewee', 'firstName lastName profilePicture');

    res.status(201).json({
      message: 'Review created successfully',
      review: populatedReview
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update review
router.put('/:id', auth, [
  body('ratings.overall').optional().isInt({ min: 1, max: 5 }),
  body('comment').optional().trim().isLength({ min: 10, max: 1000 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns this review
    if (review.reviewer.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check if review is still editable (within 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    if (review.createdAt < thirtyDaysAgo) {
      return res.status(400).json({ message: 'Review can no longer be edited' });
    }

    // Update review
    Object.assign(review, req.body);
    await review.save();

    // Update host ratings if this is a guest-to-host review
    if (review.type === 'guest-to-host') {
      await updateHostRatings(review.reviewee);
    }

    const populatedReview = await Review.findById(review._id)
      .populate('reviewer', 'firstName lastName profilePicture')
      .populate('reviewee', 'firstName lastName profilePicture');

    res.json({
      message: 'Review updated successfully',
      review: populatedReview
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add response to review
router.post('/:id/response', auth, [
  body('comment').notEmpty().trim().isLength({ min: 10, max: 500 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user is the reviewee (can respond to their own review)
    if (review.reviewee.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check if response already exists
    if (review.response.comment) {
      return res.status(400).json({ message: 'Response already exists' });
    }

    // Add response
    review.response = {
      comment: req.body.comment,
      date: new Date(),
      author: req.user.userId
    };

    await review.save();

    res.json({
      message: 'Response added successfully',
      response: review.response
    });
  } catch (error) {
    console.error('Add response error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark review as helpful
router.post('/:id/helpful', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user already marked this review as helpful
    const alreadyHelpful = review.helpful.users.includes(req.user.userId);
    
    if (alreadyHelpful) {
      // Remove helpful mark
      review.helpful.users = review.helpful.users.filter(
        userId => userId.toString() !== req.user.userId
      );
      review.helpful.count = Math.max(0, review.helpful.count - 1);
    } else {
      // Add helpful mark
      review.helpful.users.push(req.user.userId);
      review.helpful.count += 1;
    }

    await review.save();

    res.json({
      message: alreadyHelpful ? 'Helpful mark removed' : 'Review marked as helpful',
      helpful: review.helpful
    });
  } catch (error) {
    console.error('Mark helpful error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to update host ratings
async function updateHostRatings(hostUserId) {
  const reviews = await Review.find({
    reviewee: hostUserId,
    type: 'guest-to-host'
  });

  if (reviews.length === 0) return;

  const ratings = reviews.reduce((acc, review) => {
    acc.overall += review.ratings.overall || 0;
    acc.cleanliness += review.ratings.cleanliness || 0;
    acc.communication += review.ratings.communication || 0;
    acc.cultural += review.ratings.cultural || 0;
    acc.cooking += review.ratings.cooking || 0;
    return acc;
  }, {
    overall: 0,
    cleanliness: 0,
    communication: 0,
    cultural: 0,
    cooking: 0
  });

  const count = reviews.length;
  const avgRatings = {
    overall: Math.round((ratings.overall / count) * 10) / 10,
    cleanliness: Math.round((ratings.cleanliness / count) * 10) / 10,
    communication: Math.round((ratings.communication / count) * 10) / 10,
    cultural: Math.round((ratings.cultural / count) * 10) / 10,
    cooking: Math.round((ratings.cooking / count) * 10) / 10,
    totalReviews: count
  };

  await Host.findOneAndUpdate(
    { user: hostUserId },
    { ratings: avgRatings }
  );
}

module.exports = router;