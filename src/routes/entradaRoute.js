const express = require('express');
const {
  crearEntrada,
  obtenerEntradas,
  obtenerEntradaPorId,
  actualizarEntrada,
  eliminarEntrada,
  buscarEntradas
} = require('../controllers/entradaController');

const verifyToken = require('../middleware/verifyToken');
const router = express.Router();

router.use(verifyToken);

// Buscar entradas (Debe ir antes de /:id)
router.get('/buscar', buscarEntradas);

// Crear y obtener todas
router.post('/', crearEntrada);
router.get('/', obtenerEntradas);

// Operaciones por ID
router.get('/:id', obtenerEntradaPorId);
router.put('/:id', actualizarEntrada);
router.delete('/:id', eliminarEntrada);

module.exports = router;