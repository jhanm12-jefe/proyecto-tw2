const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const Rol = require('../models/rol');


const signToken = (user) =>
  jwt.sign(
    {
      id: user._id,
      rol: user.rol.nombre
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN
    }
  );

const login = async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        error: 'El correo es inválido'
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        error: 'Credenciales inválidas'
      });
    }

    const token = signToken(user);
    const userResponse = user.toObject();

    delete userResponse.password;

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

const register = async (req, res) => {
  try {

    const { username, email, password } = req.body;
    const defaultRol = await Rol.findOne({
      nombre: 'usuario'
    });

    if (!defaultRol) {
      return res.status(500).json({
        error: 'El rol usuario no existe'
      });
    }

    const emailExiste = await User.findOne({ email });

    if (emailExiste) {
      return res.status(400).json({
        error: 'El correo ya está registrado'
      });
    }

    const usernameExiste = await User.findOne({ username });

    if (usernameExiste) {
      return res.status(400).json({
        error: 'El nombre de usuario ya está registrado'
      });
    }

    const encrypt_password = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: encrypt_password,

      rolId: defaultRol._id,

      rol: {
        nombre: defaultRol.nombre,
        descripcion: defaultRol.descripcion
      }
    });

    const savedUser = await newUser.save();
    const token = signToken(savedUser);
    const userResponse = savedUser.toObject();
    delete userResponse.password;

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