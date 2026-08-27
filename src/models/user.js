const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const entradaSchema = require('./entrada');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'El nombre de usuario es obligatorio'],
      trim: true,
      unique: true
    },

    email: {
      type: String,
      required: [true, 'El email es obligatorio'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Por favor usa un email válido']
    },

    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
      minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
    },

    // Definición de rolId para referenciar la colección Rol
    rolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Rol',
      required: [true, 'El rol es obligatorio']
    },

    // Subdocumento embebido para las entradas del diario
    entradas: [entradaSchema]
  },
  {
    timestamps: true
  }
);

// Método para comparar contraseña en el Login
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);