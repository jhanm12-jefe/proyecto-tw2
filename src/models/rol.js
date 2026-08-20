const mongoose = require('mongoose');

const rolSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del rol es obligatorio'],
    trim: true,
    unique: true
  },
  descripcion: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Rol', rolSchema);