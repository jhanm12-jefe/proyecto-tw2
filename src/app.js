const express = require('express');
const cors = require('cors');

const app = express();

// Importación de rutas
const rolRoute = require('./routes/rolRoute');
const authRoute = require('./routes/authRoute');
const entradaRoutes = require('./routes/entradaRoute');
const animoRoute = require('./routes/animoRoute');
const etiquetaRoute = require('./routes/etiquetaRoute');

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoute);

// Registro de endpoints
app.use('/api/roles', rolRoute);
app.use('/api/entradas', entradaRoutes);
app.use('/api/animos', animoRoute);
app.use('/api/etiquetas', etiquetaRoute);

app.get('/', (req, res) => {
    res.send('Servidor funcionando correctamente');
});

module.exports = app;