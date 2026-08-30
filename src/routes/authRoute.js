const express = require('express');
const router = express.Router();
const {login , register, updateProfile} = require('../controllers/authController');

router.post('/login', login);
router.post('/register', register);
router.put('/:id', updateProfile);

module.exports = router;
