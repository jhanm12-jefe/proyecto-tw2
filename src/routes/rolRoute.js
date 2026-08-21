const express = require('express');
const {
  getRoles, getRolById, createRol, updateRol,deleteRol
} = require('../controllers/rolController');

const verifyToken = require('../middleware/verifyToken');
const checkRole = require('../middleware/checkRole');

const router = express.Router();

router.use(verifyToken);
router.get('/', getRoles);
router.get('/:id', getRolById);

router.post('/', checkRole(['admin']), createRol);
router.put('/:id', checkRole(['admin']), updateRol);
router.delete('/:id', checkRole(['admin']), deleteRol);

module.exports = router;