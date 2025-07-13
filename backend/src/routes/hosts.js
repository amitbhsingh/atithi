const express = require('express');
const { body, validationResult } = require('express-validator');
const Host = require('../models/Host');
const User = require('../models/User');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Get all hosts (with search and filters)
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      location,
      priceMin,
      priceMax,
      experience,
      rating,
      verified,
      superhost
    } = req.query;

    const query = { status: 'approved' };

    // Apply filters
    if (location) {
      query['$or'] = [
        { 'address.city': { $regex: location, $options: 'i' } },
        { 'address.country': { $regex: location, $options: 'i' } },
        { 'address.state': { $regex: location, $options: 'i' } }
      ];
    }

    if (priceMin || priceMax) {
      query['pricing.basePrice'] = {};
      if (priceMin) query['pricing.basePrice']['$gte'] = Number(priceMin);
      if (priceMax) query['pricing.basePrice']['$lte'] = Number(priceMax);
    }

    if (experience) {
      query['experiences.type'] = experience;
    }

    if (rating) {
      query['ratings.overall'] = { $gte: Number(rating) };
    }

    if (verified === 'true') {
      query['verification.identity'] = true;
      query['verification.income'] = true;
      query['verification.background'] = true;
    }

    if (superhost === 'true') {
      query.superhost = true;
    }

    const hosts = await Host.find(query)
      .populate('user', 'firstName lastName profilePicture')
      .sort({ 'ratings.overall': -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Host.countDocuments(query);

    res.json({
      hosts,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get hosts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single host
router.get('/:id', async (req, res) => {
  try {
    const host = await Host.findById(req.params.id)
      .populate('user', 'firstName lastName profilePicture bio languages');

    if (!host) {
      return res.status(404).json({ message: 'Host not found' });
    }

    res.json(host);
  } catch (error) {
    console.error('Get host error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create host profile
router.post('/', auth, [
  body('familySize').isInt({ min: 1, max: 10 }),
  body('address.street').notEmpty().trim(),
  body('address.city').notEmpty().trim(),
  body('address.state').notEmpty().trim(),
  body('address.country').notEmpty().trim(),
  body('address.postalCode').notEmpty().trim(),
  body('incomeVerification.incomeRange').isIn(['lower-middle', 'middle', 'upper-middle']),
  body('accommodation.type').isIn(['apartment', 'house', 'villa', 'traditional']),
  body('accommodation.bedrooms').isInt({ min: 1 }),
  body('accommodation.bathrooms').isInt({ min: 1 }),
  body('pricing.basePrice').isNumeric({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user already has a host profile
    const existingHost = await Host.findOne({ user: req.user.userId });
    if (existingHost) {
      return res.status(400).json({ message: 'Host profile already exists' });
    }

    const hostData = {
      user: req.user.userId,
      ...req.body
    };

    const host = new Host(hostData);
    await host.save();

    // Update user role to host
    await User.findByIdAndUpdate(req.user.userId, { role: 'host' });

    res.status(201).json({
      message: 'Host profile created successfully',
      host
    });
  } catch (error) {
    console.error('Create host error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update host profile
router.put('/:id', auth, async (req, res) => {
  try {
    const host = await Host.findById(req.params.id);
    
    if (!host) {
      return res.status(404).json({ message: 'Host not found' });
    }

    // Check if user owns this host profile
    if (host.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedHost = await Host.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('user', 'firstName lastName profilePicture');

    res.json(updatedHost);
  } catch (error) {
    console.error('Update host error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload host photos
router.post('/:id/photos', auth, upload.array('photos', 10), async (req, res) => {
  try {
    const host = await Host.findById(req.params.id);
    
    if (!host) {
      return res.status(404).json({ message: 'Host not found' });
    }

    // Check if user owns this host profile
    if (host.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const photoPaths = req.files.map(file => file.path);
    host.accommodation.photos.push(...photoPaths);
    await host.save();

    res.json({
      message: 'Photos uploaded successfully',
      photos: host.accommodation.photos
    });
  } catch (error) {
    console.error('Upload photos error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add experience
router.post('/:id/experiences', auth, [
  body('type').isIn(['cooking', 'homestay', 'cultural-tour', 'language-exchange', 'craft-workshop']),
  body('title').notEmpty().trim(),
  body('description').notEmpty().trim(),
  body('duration').notEmpty().trim(),
  body('price').isNumeric({ min: 1 }),
  body('maxGuests').isInt({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const host = await Host.findById(req.params.id);
    
    if (!host) {
      return res.status(404).json({ message: 'Host not found' });
    }

    // Check if user owns this host profile
    if (host.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    host.experiences.push(req.body);
    await host.save();

    res.json({
      message: 'Experience added successfully',
      experiences: host.experiences
    });
  } catch (error) {
    console.error('Add experience error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update availability
router.put('/:id/availability', auth, async (req, res) => {
  try {
    const host = await Host.findById(req.params.id);
    
    if (!host) {
      return res.status(404).json({ message: 'Host not found' });
    }

    // Check if user owns this host profile
    if (host.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    host.availability = { ...host.availability, ...req.body };
    await host.save();

    res.json({
      message: 'Availability updated successfully',
      availability: host.availability
    });
  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;