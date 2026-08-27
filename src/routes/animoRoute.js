const express = require('express');
const router = express.Router();
const { obtenerMisAnimos } = require('../controllers/animoController');
const verifyToken = require('../middleware/verifyToken');

router.use(verifyToken);
router.get('/', obtenerMisAnimos);

module.exports = router;