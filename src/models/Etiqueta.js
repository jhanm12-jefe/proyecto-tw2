const mongoose = require('mongoose');

const etiquetaSchema = new mongoose.Schema(
  {
    usuarioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    nombre: {
      type: String,
      required: true,
      trim: true
    },
    nombreNormalizado: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Índice de texto para búsquedas eficientes
etiquetaSchema.index({ nombre: 'text' });

module.exports = mongoose.model('Etiqueta', etiquetaSchema);