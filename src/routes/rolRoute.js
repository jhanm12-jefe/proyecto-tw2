const express = require('express');

const {
  getRoles,
  getRolById,
  createRol,
  updateRol,
  deleteRol
} = require('../controllers/rolController');

const router = express.Router();

router.get('/', getRoles);
router.get('/:id', getRolById);
router.post('/', createRol);
router.put('/:id', updateRol);
router.delete('/:id', deleteRol);

module.exports = router;