const Etiqueta = require('../models/Etiqueta');

const obtenerMisEtiquetas = async (req, res) => {
  try {
    const etiquetas = await Etiqueta.find({ usuarioId: req.user.id }).sort({ nombre: 1 });
    res.status(200).json({
      mensaje: 'Etiquetas obtenidas correctamente',
      etiquetas
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error al obtener las etiquetas',
      detalle: error.message
    });
  }
};

module.exports = { obtenerMisEtiquetas };