const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const rolEmbeddedSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del rol es obligatorio'],
    trim: true
  },
  descripcion: {
    type: String,
    trim: true
  }
}, { _id: false });

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'El nombre de usuario es obligatorio'],
    trim: true, // Quita espacios extra
    unique: true
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Por favor usa un email válido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: 6
  },
  rol: {
    type: rolEmbeddedSchema,
    required: [true, 'El rol es obligatorio']
  },
  rolId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rol'
  }
}, {
  timestamps: true
});

// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);