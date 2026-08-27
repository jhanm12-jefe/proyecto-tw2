const mongoose = require('mongoose');

const animoSchema = new mongoose.Schema(
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
    // Guarda el texto en minúsculas para evitar duplicados como "Feliz" y "feliz"
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

// Índice de texto para búsquedas eficientes e insensibles
animoSchema.index({ nombre: 'text' });

module.exports = mongoose.model('Animo', animoSchema);