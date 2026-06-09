const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  date:        { type: String, required: true },
  location:    { type: String, required: true, trim: true },
  status:      { type: String, enum: ['Open', 'Upcoming', 'Full', 'Closed'], default: 'Open' },
  teams:       { type: Number, required: true, min: 2 },
  maxPlayers:  { type: Number, default: 10 },
  fee:         { type: String, default: '0.001' },
  description: { type: String, default: '', trim: true },
}, { timestamps: true });

module.exports = mongoose.model('Tournament', tournamentSchema);