const mongoose = require('mongoose');

const entradaSchema = new mongoose.Schema({
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El usuario es obligatorio']
  },
  titulo: {
    type: String,
    required: [true, 'El título de la entrada es obligatorio'],
    trim: true
  },
  contenido: {
    type: String,
    required: [true, 'El contenido de la entrada es obligatorio'],
    trim: true
  },
  estadoAnimo: {
    type: String,
    required: [true, 'El estado de ánimo es obligatorio'],
    trim: true
  },
  etiquetas: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Entrada', entradaSchema);