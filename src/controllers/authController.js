const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const Rol = require('../models/rol');

// =====================================================
// GENERAR TOKEN
// =====================================================
const signToken = (user) =>
  jwt.sign(
    {
      id: user._id,
      rol: user.rolId ? user.rolId.nombre : 'usuario'
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d'
    }
  );

// =====================================================
// LOGIN
// =====================================================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario y traer su rol
    const user = await User.findOne({ email }).populate('rolId');

    if (!user) {
      return res.status(401).json({
        error: 'El correo es inválido'
      });
    }

    // Comparar contraseña
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        error: 'Credenciales inválidas'
      });
    }

    // Verificar que tenga un rol
    if (!user.rolId) {
      return res.status(500).json({
        error: 'El usuario no tiene un rol asignado'
      });
    }

    // Generar token
    const token = signToken(user);

    // No enviar contraseña ni la lista completa de entradas en el login
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.entradas;

    res.status(200).json({
      mensaje: 'Inicio de sesión exitoso',
      token,
      usuario: userResponse
    });

  } catch (error) {
    res.status(500).json({
      error: 'Error al iniciar sesión',
      detalle: error.message
    });
  }
};

// =====================================================
// REGISTER
// =====================================================
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Buscar el rol usuario
    const defaultRol = await Rol.findOne({
      nombre: 'usuario'
    });

    if (!defaultRol) {
      return res.status(500).json({
        error: 'El rol usuario no existe en la base de datos'
      });
    }

    // Verificar email
    const emailExiste = await User.findOne({ email });
    if (emailExiste) {
      return res.status(400).json({
        error: 'El correo ya está registrado'
      });
    }

    // Verificar username
    const usernameExiste = await User.findOne({ username });
    if (usernameExiste) {
      return res.status(400).json({
        error: 'El nombre de usuario ya está registrado'
      });
    }

    // Encriptar contraseña
    const encrypt_password = await bcrypt.hash(password, 10);

    // Crear usuario con arreglo de entradas vacío
    const newUser = new User({
      username,
      email,
      password: encrypt_password,
      rolId: defaultRol._id,
      entradas: []
    });

    // Guardar usuario
    const savedUser = await newUser.save();

    // Traer el usuario con su rol para firmar el token
    const userWithRol = await User.findById(savedUser._id).populate('rolId');

    const token = signToken(userWithRol);

    // Preparar respuesta limpia
    const userResponse = userWithRol.toObject();
    delete userResponse.password;
    delete userResponse.entradas;

    res.status(201).json({
      mensaje: 'Usuario registrado correctamente',
      token,
      usuario: userResponse
    });

  } catch (error) {
    res.status(500).json({
      error: 'Error al registrar usuario',
      detalle: error.message
    });
  }
};

module.exports = {
  login,
  register
};