const mongoose = require('mongoose');

const hostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  familySize: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    postalCode: { type: String, required: true },
    coordinates: {
      latitude: { type: Number },
      longitude: { type: Number }
    }
  },
  incomeVerification: {
    verified: { type: Boolean, default: false },
    documents: [{
      type: String // Document URLs
    }],
    verificationDate: { type: Date },
    incomeRange: {
      type: String,
      enum: ['lower-middle', 'middle', 'upper-middle'],
      required: true
    }
  },
  accommodation: {
    type: {
      type: String,
      enum: ['apartment', 'house', 'villa', 'traditional'],
      required: true
    },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    amenities: [{
      type: String,
      enum: ['wifi', 'kitchen', 'laundry', 'parking', 'garden', 'balcony', 'air-conditioning', 'heating']
    }],
    photos: [{
      type: String // Photo URLs
    }]
  },
  experiences: [{
    type: {
      type: String,
      enum: ['cooking', 'homestay', 'cultural-tour', 'language-exchange', 'craft-workshop'],
      required: true
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: String, required: true },
    price: { type: Number, required: true },
    maxGuests: { type: Number, required: true },
    includes: [{ type: String }],
    availability: [{
      date: { type: Date },
      available: { type: Boolean, default: true }
    }]
  }],
  culinarySpecialties: [{
    name: { type: String, required: true },
    description: { type: String },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner'
    }
  }],
  culturalBackground: {
    ethnicity: { type: String },
    traditions: [{ type: String }],
    festivals: [{ type: String }],
    history: { type: String }
  },
  hostingExperience: {
    yearsHosting: { type: Number, default: 0 },
    guestsHosted: { type: Number, default: 0 },
    specialInterests: [{ type: String }]
  },
  ratings: {
    overall: { type: Number, default: 0 },
    cleanliness: { type: Number, default: 0 },
    communication: { type: Number, default: 0 },
    cultural: { type: Number, default: 0 },
    cooking: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 }
  },
  pricing: {
    basePrice: { type: Number, required: true },
    weeklyDiscount: { type: Number, default: 0 },
    monthlyDiscount: { type: Number, default: 0 },
    seasonalRates: [{
      season: { type: String },
      startDate: { type: Date },
      endDate: { type: Date },
      priceMultiplier: { type: Number, default: 1 }
    }]
  },
  availability: {
    calendar: [{
      date: { type: Date },
      available: { type: Boolean, default: true },
      price: { type: Number }
    }],
    minimumStay: { type: Number, default: 1 },
    maximumStay: { type: Number, default: 30 },
    bookingWindow: { type: Number, default: 365 }
  },
  verification: {
    identity: { type: Boolean, default: false },
    income: { type: Boolean, default: false },
    background: { type: Boolean, default: false },
    phone: { type: Boolean, default: false },
    email: { type: Boolean, default: false },
    verificationDate: { type: Date }
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'suspended'],
    default: 'pending'
  },
  superhost: {
    type: Boolean,
    default: false
  },
  responseRate: {
    type: Number,
    default: 0
  },
  responseTime: {
    type: String,
    enum: ['within-hour', 'within-few-hours', 'within-day'],
    default: 'within-day'
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
hostSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate overall rating
hostSchema.methods.calculateOverallRating = function() {
  const ratings = this.ratings;
  if (ratings.totalReviews === 0) return 0;
  
  const total = ratings.cleanliness + ratings.communication + ratings.cultural + ratings.cooking;
  return Math.round((total / 4) * 10) / 10;
};

// Check if host is verified
hostSchema.virtual('isVerified').get(function() {
  return this.verification.identity && 
         this.verification.income && 
         this.verification.background;
});

// Get full address
hostSchema.virtual('fullAddress').get(function() {
  const addr = this.address;
  return `${addr.street}, ${addr.city}, ${addr.state}, ${addr.country} ${addr.postalCode}`;
});

hostSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Host', hostSchema);