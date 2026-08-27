const User = require('../models/user');
const Animo = require('../models/Animo');
const Etiqueta = require('../models/Etiqueta');

// =====================================================
// CREAR ENTRADA
// =====================================================
const crearEntrada = async (req, res) => {
  try {
    const { titulo, contenido, animo, etiquetas, fecha } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // 1. Crear el objeto de entrada embebido
    const nuevaEntrada = {
      titulo,
      contenido,
      fecha: fecha ? new Date(fecha) : new Date(),
      animo: animo || '',
      etiquetas: etiquetas || []
    };

    user.entradas.push(nuevaEntrada);
    await user.save();

    // Obtener la entrada recién insertada con su _id generado por Mongoose
    const entradaGuardada = user.entradas[user.entradas.length - 1];

    // 2. Sincronizar Ánimo en la colección catálogo (si se envió)
    if (animo && animo.trim() !== '') {
      const normalizado = animo.toLowerCase().trim();
      await Animo.updateOne(
        { usuarioId: userId, nombreNormalizado: normalizado },
        { $setOnInsert: { usuarioId: userId, nombre: animo.trim(), nombreNormalizado: normalizado } },
        { upsert: true }
      );
    }

    // 3. Sincronizar Etiquetas en la colección catálogo (si se enviaron)
    if (etiquetas && Array.isArray(etiquetas)) {
      for (const etiq of etiquetas) {
        if (etiq.trim() !== '') {
          const normalizado = etiq.toLowerCase().trim();
          await Etiqueta.updateOne(
            { usuarioId: userId, nombreNormalizado: normalizado },
            { $setOnInsert: { usuarioId: userId, nombre: etiq.trim(), nombreNormalizado: normalizado } },
            { upsert: true }
          );
        }
      }
    }

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

// =====================================================
// OBTENER MIS ENTRADAS (Directo del Usuario Logueado)
// =====================================================
const obtenerEntradas = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('entradas');
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Ordenar por fecha de creación (más reciente primero)
    const entradasOrdenadas = user.entradas.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({
      mensaje: 'Entradas obtenidas correctamente',
      entradas: entradasOrdenadas
    });

  } catch (error) {
    res.status(500).json({
      error: 'Error al obtener las entradas',
      detalle: error.message
    });
  }
};

// =====================================================
// OBTENER ENTRADA POR ID
// =====================================================
const obtenerEntradaPorId = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Buscar la entrada dentro del arreglo del usuario
    const entrada = user.entradas.id(req.params.id);

    if (!entrada) {
      return res.status(404).json({ error: 'Entrada no encontrada' });
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

// =====================================================
// ACTUALIZAR ENTRADA
// =====================================================
const actualizarEntrada = async (req, res) => {
  try {
    const { titulo, contenido, animo, etiquetas, fecha } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const entrada = user.entradas.id(req.params.id);
    if (!entrada) {
      return res.status(404).json({ error: 'Entrada no encontrada' });
    }

    // Actualizar campos
    if (titulo !== undefined) entrada.titulo = titulo;
    if (contenido !== undefined) entrada.contenido = contenido;
    if (animo !== undefined) entrada.animo = animo;
    if (etiquetas !== undefined) entrada.etiquetas = etiquetas;
    if (fecha !== undefined) entrada.fecha = new Date(fecha);

    await user.save();

    // Sincronizar catálogo de ánimos y etiquetas nuevamente
    if (animo && animo.trim() !== '') {
      const normalizado = animo.toLowerCase().trim();
      await Animo.updateOne(
        { usuarioId: userId, nombreNormalizado: normalizado },
        { $setOnInsert: { usuarioId: userId, nombre: animo.trim(), nombreNormalizado: normalizado } },
        { upsert: true }
      );
    }

    res.status(200).json({
      mensaje: 'Entrada actualizada correctamente',
      entrada
    });

  } catch (error) {
    res.status(500).json({
      error: 'Error al actualizar la entrada',
      detalle: error.message
    });
  }
};

// =====================================================
// ELIMINAR ENTRADA
// =====================================================
const eliminarEntrada = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const entrada = user.entradas.id(req.params.id);
    if (!entrada) {
      return res.status(404).json({ error: 'Entrada no encontrada' });
    }

    // Eliminar subdocumento mediante pull/deleteOne
    user.entradas.pull(req.params.id);
    await user.save();

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

// =====================================================
// BUSCADOR AVANZADO (Por Coincidencia Flexible y Calendario)
// =====================================================
const buscarEntradas = async (req, res) => {
  try {
    const { query, animo, etiqueta, anio, mes, dia } = req.query;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    let resultados = user.entradas;

    // 1. Filtrar por término general de búsqueda (Búsqueda en Título, Ánimo o Contenido)
    const terminoBusqueda = query || req.query.titulo;
    if (terminoBusqueda && terminoBusqueda.trim() !== '') {
      const regex = new RegExp(terminoBusqueda.trim(), 'i');
      resultados = resultados.filter(e =>
        regex.test(e.titulo) ||
        regex.test(e.contenido) ||
        regex.test(e.animo) ||
        e.etiquetas.some(tag => regex.test(tag))
      );
    }

    // 2. Filtro específico por Ánimo (si se especifica en query)
    if (animo && animo.trim() !== '') {
      const regexAnimo = new RegExp(animo.trim(), 'i');
      resultados = resultados.filter(e => regexAnimo.test(e.animo));
    }

    // 3. Filtro específico por Etiqueta (si se especifica en query)
    if (etiqueta && etiqueta.trim() !== '') {
      const regexEtiqueta = new RegExp(etiqueta.trim(), 'i');
      resultados = resultados.filter(e => e.etiquetas.some(tag => regexEtiqueta.test(tag)));
    }

    // 4. Filtrado por Calendario (Día, Mes, Año)
    if (anio) {
      let inicioFecha, finFecha;

      if (dia && mes) {
        // Buscar un Día Específico
        inicioFecha = new Date(anio, mes - 1, dia, 0, 0, 0, 0);
        finFecha = new Date(anio, mes - 1, dia, 23, 59, 59, 999);
      } else if (mes) {
        // Buscar un Mes Completo
        inicioFecha = new Date(anio, mes - 1, 1, 0, 0, 0, 0);
        finFecha = new Date(anio, mes, 0, 23, 59, 59, 999);
      } else {
        // Buscar todo el Año
        inicioFecha = new Date(anio, 0, 1, 0, 0, 0, 0);
        finFecha = new Date(anio, 11, 31, 23, 59, 59, 999);
      }

      resultados = resultados.filter(e => {
        const fechaEntrada = new Date(e.fecha || e.createdAt);
        return fechaEntrada >= inicioFecha && fechaEntrada <= finFecha;
      });
    }

    // Ordenar los resultados filtrados
    resultados.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({
      mensaje: 'Búsqueda realizada correctamente',
      total: resultados.length,
      entradas: resultados
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