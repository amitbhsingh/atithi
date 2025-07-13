const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  guest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Host',
    required: true
  },
  experience: {
    type: String,
    enum: ['cooking', 'homestay', 'cultural-tour', 'language-exchange', 'craft-workshop'],
    required: true
  },
  checkIn: {
    type: Date,
    required: true
  },
  checkOut: {
    type: Date,
    required: true
  },
  guests: {
    adults: { type: Number, required: true, min: 1 },
    children: { type: Number, default: 0 },
    infants: { type: Number, default: 0 }
  },
  pricing: {
    basePrice: { type: Number, required: true },
    serviceFee: { type: Number, required: true },
    taxes: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true }
  },
  payment: {
    method: {
      type: String,
      enum: ['credit-card', 'debit-card', 'paypal', 'bank-transfer'],
      required: true
    },
    transactionId: { type: String },
    paymentDate: { type: Date },
    refundAmount: { type: Number, default: 0 },
    refundDate: { type: Date }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'disputed'],
    default: 'pending'
  },
  cancellation: {
    cancelled: { type: Boolean, default: false },
    cancelledBy: {
      type: String,
      enum: ['guest', 'host', 'admin']
    },
    cancellationDate: { type: Date },
    reason: { type: String },
    refundAmount: { type: Number, default: 0 }
  },
  specialRequests: {
    dietary: [{ type: String }],
    accessibility: [{ type: String }],
    other: { type: String }
  },
  guestDetails: {
    emergencyContact: {
      name: { type: String },
      phone: { type: String },
      relationship: { type: String }
    },
    travelPurpose: {
      type: String,
      enum: ['leisure', 'business', 'education', 'cultural-exchange', 'other']
    },
    previousExperience: {
      type: String,
      enum: ['first-time', 'experienced', 'frequent-traveler']
    }
  },
  communication: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    read: { type: Boolean, default: false }
  }],
  checkinInstructions: {
    provided: { type: Boolean, default: false },
    instructions: { type: String },
    keyLocation: { type: String },
    contactInfo: { type: String }
  },
  reviews: {
    guestReviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review'
    },
    hostReviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review'
    }
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
bookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate total nights
bookingSchema.virtual('totalNights').get(function() {
  return Math.ceil((this.checkOut - this.checkIn) / (1000 * 60 * 60 * 24));
});

// Check if booking is active
bookingSchema.virtual('isActive').get(function() {
  const now = new Date();
  return this.checkIn <= now && this.checkOut >= now && this.status === 'confirmed';
});

// Check if booking is upcoming
bookingSchema.virtual('isUpcoming').get(function() {
  const now = new Date();
  return this.checkIn > now && this.status === 'confirmed';
});

// Check if booking is past
bookingSchema.virtual('isPast').get(function() {
  const now = new Date();
  return this.checkOut < now;
});

// Calculate cancellation deadline
bookingSchema.virtual('cancellationDeadline').get(function() {
  const deadline = new Date(this.checkIn);
  deadline.setDate(deadline.getDate() - 7); // 7 days before check-in
  return deadline;
});

// Check if cancellation is allowed
bookingSchema.virtual('canCancel').get(function() {
  const now = new Date();
  return now < this.cancellationDeadline && this.status === 'confirmed';
});

bookingSchema.set('toJSON', { virtuals: true });

// Indexes for better query performance
bookingSchema.index({ guest: 1, status: 1 });
bookingSchema.index({ host: 1, status: 1 });
bookingSchema.index({ checkIn: 1, checkOut: 1 });
bookingSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Booking', bookingSchema);