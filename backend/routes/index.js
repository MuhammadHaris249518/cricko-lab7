const express = require('express');
const router  = express.Router();

router.use('/players',       require('./playerRoutes'));
router.use('/registrations', require('./registrationRoutes'));
router.use('/tournaments',   require('./tournamentRoutes'));

// Public config — safe values the frontend needs (no secrets)
router.get('/config', (req, res) => {
  res.json({
    success: true,
    data: {
      recipientWallet: process.env.RECIPIENT_WALLET || '0x0000000000000000000000000000000000000000',
      network: 'Sepolia Testnet',
      chainId: '0xaa36a7'
    }
  });
});

module.exports = router;
