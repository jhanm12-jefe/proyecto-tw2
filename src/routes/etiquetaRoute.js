const express = require('express');
const router = express.Router();
const { obtenerMisEtiquetas } = require('../controllers/etiquetaController');
const verifyToken = require('../middleware/verifyToken');

router.use(verifyToken);
router.get('/', obtenerMisEtiquetas);

module.exports = router;