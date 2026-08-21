const Entrada = require('../models/entrada');
const crearEntrada = async (req, res) => {
  try {

    const {
      titulo,
      contenido,
      animo,
      etiquetas
    } = req.body;

    const nuevaEntrada = new Entrada({
      usuarioId: req.user.id,
      titulo,
      contenido,
      animo,
      etiquetas: etiquetas || []
    });

    const entradaGuardada = await nuevaEntrada.save();

    res.status(201).json({
      mensaje: 'Entrada creada correctamente',
      entrada: entradaGuardada
    });

  } catch (error) {

    res.status(500).json({
      error: 'Error al crear la entrada',
      detalle: error.message
    });

  }
};

const obtenerEntradas = async (req, res) => {
  try {

    const entradas = await Entrada.find({
      usuarioId: req.user.id
    }).sort({ createdAt: -1 });

    res.status(200).json({
      mensaje: 'Entradas obtenidas correctamente',
      entradas
    });

  } catch (error) {

    res.status(500).json({
      error: 'Error al obtener las entradas',
      detalle: error.message
    });

  }
};
const obtenerEntradaPorId = async (req, res) => {
  try {

    const entrada = await Entrada.findOne({
      _id: req.params.id,
      usuarioId: req.user.id
    });

    if (!entrada) {
      return res.status(404).json({
        error: 'Entrada no encontrada'
      });
    }

    res.status(200).json({
      mensaje: 'Entrada obtenida correctamente',
      entrada
    });

  } catch (error) {

    res.status(500).json({
      error: 'Error al obtener la entrada',
      detalle: error.message
    });

  }
};
const actualizarEntrada = async (req, res) => {
  try {

    const {
      titulo,
      contenido,
      animo,
      etiquetas
    } = req.body;

    const entrada = await Entrada.findOne({
      _id: req.params.id,
      usuarioId: req.user.id
    });

    if (!entrada) {
      return res.status(404).json({
        error: 'Entrada no encontrada'
      });
    }

    entrada.titulo = titulo ?? entrada.titulo;
    entrada.contenido = contenido ?? entrada.contenido;
    entrada.animo = animo ?? entrada.animo;
    entrada.etiquetas = etiquetas ?? entrada.etiquetas;

    const entradaActualizada = await entrada.save();

    res.status(200).json({
      mensaje: 'Entrada actualizada correctamente',
      entrada: entradaActualizada
    });

  } catch (error) {

    res.status(500).json({
      error: 'Error al actualizar la entrada',
      detalle: error.message
    });

  }
};
const eliminarEntrada = async (req, res) => {
  try {

    const entrada = await Entrada.findOneAndDelete({
      _id: req.params.id,
      usuarioId: req.user.id
    });

    if (!entrada) {
      return res.status(404).json({
        error: 'Entrada no encontrada'
      });
    }

    res.status(200).json({
      mensaje: 'Entrada eliminada correctamente'
    });

  } catch (error) {

    res.status(500).json({
      error: 'Error al eliminar la entrada',
      detalle: error.message
    });

  }
};

const buscarEntradas = async (req, res) => {
  try {

    const {
      titulo,
      animo,
      etiqueta
    } = req.query;

    const filtros = {
      usuarioId: req.user.id
    };
    if (titulo) {

      filtros.titulo = {
        $regex: titulo,
        $options: 'i'
      };

    }
    if (animo) {

      filtros.animo = {
        $regex: animo,
        $options: 'i'
      };

    }
    if (etiqueta) {

      filtros.etiquetas = {
        $regex: etiqueta,
        $options: 'i'
      };

    }
    const entradas = await Entrada.find(filtros)
      .sort({ createdAt: -1 });


    res.status(200).json({
      mensaje: 'Búsqueda realizada correctamente',
      filtros: {
        titulo: titulo || null,
        animo: animo || null,
        etiqueta: etiqueta || null
      },
      entradas
    });

  } catch (error) {

    res.status(500).json({
      error: 'Error al buscar entradas',
      detalle: error.message
    });

  }
};
module.exports = {
  crearEntrada,
  obtenerEntradas,
  obtenerEntradaPorId,
  actualizarEntrada,
  eliminarEntrada,
  buscarEntradas
};