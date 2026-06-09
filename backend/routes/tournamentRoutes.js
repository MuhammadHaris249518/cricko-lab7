const express = require('express');
const router = express.Router();
const {
  getTournaments, getTournamentById,
  createTournament, updateTournament, deleteTournament
} = require('../controllers/tournamentController');
const {
  tournamentRules, updateTournamentRules, handleValidationErrors
} = require('../middleware/validate');

router.get('/',     getTournaments);
router.get('/:id',  getTournamentById);
router.post('/',    tournamentRules, handleValidationErrors, createTournament);
router.put('/:id',  updateTournamentRules, handleValidationErrors, updateTournament);
router.delete('/:id', deleteTournament);

module.exports = router;
