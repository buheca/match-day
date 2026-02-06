const mongoose = require('mongoose');

/**
 * Match Schema - Represents a football match created by a Captain
 * Players can swipe to join these matches
 */
const matchSchema = new mongoose.Schema({
  // Match Creator (Captain)
  captain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Match Details
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 500
  },
  
  // Match Logistics
  date: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // in minutes
    default: 90
  },
  skillLevelRequired: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Professional', 'Any'],
    default: 'Any'
  },
  
  // Location
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere'
    },
    address: String,
    venue: String // e.g., "Central Park Field 3"
  },
  
  // Player Requirements
  playersNeeded: {
    type: Number,
    required: true,
    min: 1,
    max: 22
  },
  positionsNeeded: [{
    type: String,
    enum: ['Goalkeeper', 'Defender', 'Midfielder', 'Forward', 'Any']
  }],
  
  // Players who have shown interest (swiped right)
  interestedPlayers: [{
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    swipedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    }
  }],
  
  // Confirmed Players (mutual match)
  confirmedPlayers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Match Status
  status: {
    type: String,
    enum: ['open', 'full', 'completed', 'cancelled'],
    default: 'open'
  },
  
  // Images
  images: [{
    type: String
  }]
  
}, { timestamps: true });

// Index for geospatial queries and filtering
matchSchema.index({ 'location.coordinates': '2dsphere' });
matchSchema.index({ date: 1, status: 1 });

module.exports = mongoose.model('Match', matchSchema);