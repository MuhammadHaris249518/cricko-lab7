const Registration = require('../models/Registration');
const Tournament = require('../models/Tournament');
const { success, error } = require('../utils/apiResponse');

const getRegistrations = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.tournamentId) filter.tournamentId = req.query.tournamentId;
    if (req.query.paymentStatus) filter.paymentStatus = req.query.paymentStatus;

    const registrations = await Registration.find(filter)
      .populate('tournamentId', 'name date location fee')
      .sort({ createdAt: -1 });

    return success(res, registrations);
  } catch (err) {
    next(err);
  }
};

const getRegistrationById = async (req, res, next) => {
  try {
    const reg = await Registration.findById(req.params.id).populate('tournamentId', 'name date location fee');
    if (!reg) return error(res, 'Registration not found', 404);
    return success(res, reg);
  } catch (err) {
    next(err);
  }
};

const createRegistration = async (req, res, next) => {
  try {
    const { name, email, role, team, tournamentId, walletAddress, txHash, paymentMethod, paymentStatus, amountPaid } = req.body;

    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) return error(res, 'Tournament not found', 404);

    const count = await Registration.countDocuments({ tournamentId });
    if (count >= tournament.maxPlayers) {
      return error(res, 'Tournament is full — no more registrations available', 400);
    }

    const reg = await Registration.create({
      name, email, role, team, tournamentId,
      walletAddress: walletAddress || null,
      txHash: txHash || null,
      paymentMethod: paymentMethod || 'MetaMask',
      paymentStatus: paymentStatus || 'Pending',
      amountPaid: amountPaid || null,
    });

    const populated = await reg.populate('tournamentId', 'name date location fee');
    return success(res, populated, 'Registration successful', 201);
  } catch (err) {
    next(err);
  }
};

const updateRegistration = async (req, res, next) => {
  try {
    const allowed = ['paymentStatus', 'walletAddress', 'txHash', 'amountPaid', 'name', 'email', 'role', 'team'];
    const updates = {};
    allowed.forEach(field => { if (req.body[field] !== undefined) updates[field] = req.body[field]; });

    const reg = await Registration.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true })
      .populate('tournamentId', 'name date location fee');

    if (!reg) return error(res, 'Registration not found', 404);
    return success(res, reg, 'Registration updated');
  } catch (err) {
    next(err);
  }
};

const deleteRegistration = async (req, res, next) => {
  try {
    const reg = await Registration.findByIdAndDelete(req.params.id);
    if (!reg) return error(res, 'Registration not found', 404);
    return success(res, null, 'Registration deleted');
  } catch (err) {
    next(err);
  }
};

module.exports = { getRegistrations, getRegistrationById, createRegistration, updateRegistration, deleteRegistration };
