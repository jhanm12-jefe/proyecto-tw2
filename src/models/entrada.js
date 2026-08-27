const mongoose = require('mongoose');

const entradaSchema = new mongoose.Schema(
  {
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

    fecha: {
      type: Date,
      default: Date.now
    },

    animo: {
      type: String,
      trim: true,
      default: ''
    },

    etiquetas: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

// Exportamos únicamente el Schema para embeberlo en User.js
module.exports = entradaSchema;