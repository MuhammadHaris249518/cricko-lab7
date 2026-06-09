const Tournament = require('../models/Tournament');
const Registration = require('../models/Registration');
const { success, error } = require('../utils/apiResponse');

const getTournaments = async (req, res, next) => {
  try {
    const tournaments = await Tournament.find().sort({ createdAt: -1 });
    return success(res, tournaments);
  } catch (err) {
    next(err);
  }
};

const getTournamentById = async (req, res, next) => {
  try {
    const t = await Tournament.findById(req.params.id);
    if (!t) return error(res, 'Tournament not found', 404);

    const registrationCount = await Registration.countDocuments({ tournamentId: t._id });
    return success(res, { ...t.toObject(), registrationCount });
  } catch (err) {
    next(err);
  }
};

const createTournament = async (req, res, next) => {
  try {
    const { name, date, location, status, teams, maxPlayers, fee, description } = req.body;
    const t = await Tournament.create({ name, date, location, status, teams, maxPlayers, fee, description });
    return success(res, t, 'Tournament created', 201);
  } catch (err) {
    next(err);
  }
};

const updateTournament = async (req, res, next) => {
  try {
    const allowed = ['name', 'date', 'location', 'status', 'teams', 'maxPlayers', 'fee', 'description'];
    const updates = {};
    allowed.forEach(field => { if (req.body[field] !== undefined) updates[field] = req.body[field]; });

    const t = await Tournament.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!t) return error(res, 'Tournament not found', 404);
    return success(res, t, 'Tournament updated');
  } catch (err) {
    next(err);
  }
};

const deleteTournament = async (req, res, next) => {
  try {
    const t = await Tournament.findByIdAndDelete(req.params.id);
    if (!t) return error(res, 'Tournament not found', 404);
    await Registration.deleteMany({ tournamentId: req.params.id });
    return success(res, null, 'Tournament and its registrations deleted');
  } catch (err) {
    next(err);
  }
};

module.exports = { getTournaments, getTournamentById, createTournament, updateTournament, deleteTournament };
