const Rol = require('../models/rol');


// =====================================================
// OBTENER TODOS LOS ROLES
// =====================================================

const getRoles = async (req, res) => {
  try {

    const roles = await Rol.find();

    res.status(200).json({
      mensaje: 'Roles obtenidos correctamente',
      roles
    });

  } catch (error) {

    res.status(500).json({
      error: 'Error al obtener los roles',
      detalle: error.message
    });

  }
};


// =====================================================
// OBTENER ROL POR ID
// =====================================================

const getRolById = async (req, res) => {
  try {

    const rol = await Rol.findById(req.params.id);

    if (!rol) {
      return res.status(404).json({
        error: 'Rol no encontrado'
      });
    }

    res.status(200).json({
      mensaje: 'Rol obtenido correctamente',
      rol
    });

  } catch (error) {

    res.status(500).json({
      error: 'Error al obtener el rol',
      detalle: error.message
    });

  }
};


// =====================================================
// CREAR ROL
// =====================================================

const createRol = async (req, res) => {
  try {

    const { nombre, descripcion } = req.body;

    // Comprobar si el rol ya existe
    const rolExiste = await Rol.findOne({ nombre });

    if (rolExiste) {
      return res.status(400).json({
        error: 'El rol ya existe'
      });
    }

    // Crear nuevo rol
    const nuevoRol = new Rol({
      nombre,
      descripcion
    });

    // Guardar rol
    const savedRol = await nuevoRol.save();

    res.status(201).json({
      mensaje: 'Rol creado correctamente',
      rol: savedRol
    });

  } catch (error) {

    res.status(500).json({
      error: 'Error al crear el rol',
      detalle: error.message
    });

  }
};


// =====================================================
// ACTUALIZAR ROL
// =====================================================

const updateRol = async (req, res) => {
  try {

    const { nombre, descripcion } = req.body;

    const rol = await Rol.findById(req.params.id);

    if (!rol) {
      return res.status(404).json({
        error: 'Rol no encontrado'
      });
    }

    rol.nombre = nombre || rol.nombre;
    rol.descripcion = descripcion || rol.descripcion;

    const updatedRol = await rol.save();

    res.status(200).json({
      mensaje: 'Rol actualizado correctamente',
      rol: updatedRol
    });

  } catch (error) {

    res.status(500).json({
      error: 'Error al actualizar el rol',
      detalle: error.message
    });

  }
};


// =====================================================
// ELIMINAR ROL
// =====================================================

const deleteRol = async (req, res) => {
  try {

    const rol = await Rol.findById(req.params.id);

    if (!rol) {
      return res.status(404).json({
        error: 'Rol no encontrado'
      });
    }

    await Rol.findByIdAndDelete(req.params.id);

    res.status(200).json({
      mensaje: 'Rol eliminado correctamente'
    });

  } catch (error) {

    res.status(500).json({
      error: 'Error al eliminar el rol',
      detalle: error.message
    });

  }
};


module.exports = {
  getRoles,
  getRolById,
  createRol,
  updateRol,
  deleteRol
};