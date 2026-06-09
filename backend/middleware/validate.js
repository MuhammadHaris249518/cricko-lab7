const { body, param, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array().map(e => e.msg).join(', '),
      data: null
    });
  }
  next();
};

const registrationRules = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 60 }).withMessage('Name must be under 60 characters'),
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Enter a valid email address').normalizeEmail(),
  body('role').notEmpty().withMessage('Role is required').isIn(['Batter', 'Bowler', 'All-Rounder', 'Wicket-Keeper']).withMessage('Role must be Batter, Bowler, All-Rounder, or Wicket-Keeper'),
  body('team').trim().notEmpty().withMessage('Team/City is required').isLength({ max: 50 }).withMessage('Team must be under 50 characters'),
  body('tournamentId').notEmpty().withMessage('Tournament ID is required').isMongoId().withMessage('Invalid tournament ID'),
  body('walletAddress').optional({ nullable: true }).isString(),
  body('txHash').optional({ nullable: true }).isString(),
  body('paymentStatus').optional().isIn(['Pending', 'Paid', 'Failed']).withMessage('paymentStatus must be Pending, Paid, or Failed'),
];

const updateRegistrationRules = [
  param('id').isMongoId().withMessage('Invalid registration ID'),
  body('paymentStatus').optional().isIn(['Pending', 'Paid', 'Failed']).withMessage('Invalid payment status'),
  body('walletAddress').optional({ nullable: true }).isString(),
  body('txHash').optional({ nullable: true }).isString(),
];

const tournamentRules = [
  body('name').trim().notEmpty().withMessage('Tournament name is required'),
  body('date').notEmpty().withMessage('Date is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('status').optional().isIn(['Open', 'Upcoming', 'Full', 'Closed']).withMessage('Invalid status'),
  body('teams').notEmpty().withMessage('Number of teams is required').isInt({ min: 2 }).withMessage('Teams must be at least 2'),
  body('maxPlayers').optional().isInt({ min: 1 }),
  body('fee').optional().isString(),
];

const updateTournamentRules = [
  param('id').isMongoId().withMessage('Invalid tournament ID'),
  body('status').optional().isIn(['Open', 'Upcoming', 'Full', 'Closed']).withMessage('Invalid status'),
  body('teams').optional().isInt({ min: 2 }),
  body('maxPlayers').optional().isInt({ min: 1 }),
];

module.exports = {
  handleValidationErrors,
  registrationRules,
  updateRegistrationRules,
  tournamentRules,
  updateTournamentRules,
};
