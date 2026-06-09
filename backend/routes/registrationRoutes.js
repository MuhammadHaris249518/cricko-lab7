const express = require('express');
const router = express.Router();
const {
  getRegistrations, getRegistrationById,
  createRegistration, updateRegistration, deleteRegistration
} = require('../controllers/registrationController');
const {
  registrationRules, updateRegistrationRules, handleValidationErrors
} = require('../middleware/validate');

router.get('/',     getRegistrations);
router.get('/:id',  getRegistrationById);
router.post('/',    registrationRules, handleValidationErrors, createRegistration);
router.put('/:id',  updateRegistrationRules, handleValidationErrors, updateRegistration);
router.delete('/:id', deleteRegistration);

module.exports = router;
