const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviewee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['guest-to-host', 'host-to-guest'],
    required: true
  },
  ratings: {
    overall: { type: Number, required: true, min: 1, max: 5 },
    cleanliness: { type: Number, min: 1, max: 5 },
    communication: { type: Number, min: 1, max: 5 },
    cultural: { type: Number, min: 1, max: 5 },
    cooking: { type: Number, min: 1, max: 5 },
    hospitality: { type: Number, min: 1, max: 5 },
    respect: { type: Number, min: 1, max: 5 }
  },
  comment: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 1000
  },
  highlights: [{
    type: String,
    enum: [
      'excellent-cooking',
      'cultural-insights',
      'warm-hospitality',
      'clean-accommodation',
      'great-communication',
      'authentic-experience',
      'family-friendly',
      'language-practice',
      'local-knowledge',
      'respectful-guest',
      'easy-communication',
      'followed-house-rules',
      'left-clean',
      'cultural-curiosity'
    ]
  }],
  photos: [{
    type: String // Photo URLs
  }],
  helpful: {
    count: { type: Number, default: 0 },
    users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  response: {
    comment: { type: String },
    date: { type: Date },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  flagged: {
    type: Boolean,
    default: false
  },
  flagReason: {
    type: String,
    enum: ['inappropriate', 'spam', 'fake', 'offensive', 'other']
  },
  verified: {
    type: Boolean,
    default: true
  },
  language: {
    type: String,
    default: 'en'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
reviewSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate weighted rating for hosts
reviewSchema.methods.getWeightedRating = function() {
  if (this.type !== 'guest-to-host') return this.ratings.overall;
  
  const weights = {
    cleanliness: 0.2,
    communication: 0.15,
    cultural: 0.25,
    cooking: 0.25,
    hospitality: 0.15
  };
  
  let weightedSum = 0;
  let totalWeight = 0;
  
  Object.keys(weights).forEach(key => {
    if (this.ratings[key]) {
      weightedSum += this.ratings[key] * weights[key];
      totalWeight += weights[key];
    }
  });
  
  return totalWeight > 0 ? weightedSum / totalWeight : this.ratings.overall;
};

// Check if review is recent (within 30 days)
reviewSchema.virtual('isRecent').get(function() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return this.createdAt >= thirtyDaysAgo;
});

// Get review age in days
reviewSchema.virtual('ageInDays').get(function() {
  const now = new Date();
  const diffTime = Math.abs(now - this.createdAt);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Format review for display
reviewSchema.methods.formatForDisplay = function() {
  return {
    id: this._id,
    reviewer: this.reviewer,
    rating: this.ratings.overall,
    comment: this.comment,
    highlights: this.highlights,
    photos: this.photos,
    createdAt: this.createdAt,
    helpful: this.helpful.count,
    response: this.response,
    isRecent: this.isRecent
  };
};

reviewSchema.set('toJSON', { virtuals: true });

// Indexes for better query performance
reviewSchema.index({ reviewee: 1, type: 1 });
reviewSchema.index({ reviewer: 1 });
reviewSchema.index({ booking: 1 });
reviewSchema.index({ createdAt: -1 });
reviewSchema.index({ 'ratings.overall': -1 });

module.exports = mongoose.model('Review', reviewSchema);