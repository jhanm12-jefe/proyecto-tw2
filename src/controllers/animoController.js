const Animo = require('../models/Animo');

const obtenerMisAnimos = async (req, res) => {
  try {
    const animos = await Animo.find({ usuarioId: req.user.id }).sort({ nombre: 1 });
    res.status(200).json({
      mensaje: 'Ánimos obtenidos correctamente',
      animos
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error al obtener los estados de ánimo',
      detalle: error.message
    });
  }
};

module.exports = { obtenerMisAnimos };