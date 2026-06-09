const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  name:          { type: String, required: true, trim: true, maxlength: 60 },
  email:         { type: String, required: true, lowercase: true, trim: true },
  role:          { type: String, required: true, enum: ['Batter', 'Bowler', 'All-Rounder', 'Wicket-Keeper'] },
  team:          { type: String, required: true, trim: true, maxlength: 50 },
  tournamentId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament', required: true },

  walletAddress: { type: String, default: null },
  txHash:        { type: String, default: null },
  paymentMethod: { type: String, default: 'MetaMask' },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
  amountPaid:    { type: String, default: null },
}, { timestamps: true });

registrationSchema.index({ email: 1, tournamentId: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
