const express = require('express');

const {
  crearEntrada, obtenerEntradas, obtenerEntradaPorId, actualizarEntrada, eliminarEntrada, buscarEntradas
} = require('../controllers/entradaController');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();
router.use(verifyToken);
// Crear entrada
router.post('/', crearEntrada);
// Buscar entradas
router.get('/buscar', buscarEntradas);
// Obtener todas las entradas
router.get('/', obtenerEntradas);
// Obtener una entrada por ID
router.get('/:id', obtenerEntradaPorId);
// Actualizar entrada
router.put('/:id', actualizarEntrada);
// Eliminar entrada
router.delete('/:id', eliminarEntrada);


module.exports = router;