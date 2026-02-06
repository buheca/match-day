const mongoose = require('mongoose');

/**
 * User Schema - Represents both Players and Captains
 * - Players: Looking for matches to join
 * - Captains: Looking for players for their matches
 */
const userSchema = new mongoose.Schema({
  // Basic Info
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  
  // User Type
  userType: {
    type: String,
    enum: ['player', 'captain'],
    required: true
  },
  
  // Player-specific fields
  position: {
    type: String,
    enum: ['Goalkeeper', 'Defender', 'Midfielder', 'Forward', 'Any'],
    required: function() { return this.userType === 'player'; }
  },
  skillLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Professional'],
    required: function() { return this.userType === 'player'; }
  },
  availability: [{
    type: String, // e.g., "Monday Evening", "Weekend Mornings"
  }],
  
  // Location (for matching nearby)
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
    address: String
  },
  
  // Profile
  bio: {
    type: String,
    maxlength: 300
  },
  profileImage: {
    type: String,
    default: 'https://via.placeholder.com/400'
  },
  
  // Swipe History
  // Stores IDs of matches this user has swiped on
  swipedMatches: [{
    matchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Match'
    },
    direction: {
      type: String,
      enum: ['left', 'right'], // left = pass, right = interested
    },
    swipedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // For Captains: stores players they've swiped on
  swipedPlayers: [{
    playerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    direction: {
      type: String,
      enum: ['left', 'right'],
    },
    swipedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Matched IDs (when both swipe right)
  matches: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match'
  }]
  
}, { timestamps: true });

// Index for geospatial queries
userSchema.index({ 'location.coordinates': '2dsphere' });

module.exports = mongoose.model('User', userSchema);