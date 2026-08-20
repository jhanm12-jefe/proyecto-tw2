const express = require('express');
const cors = require('cors');

const app = express();
const rolRoute = require('./routes/rolRoute');
const authRoute = require('./routes/authRoute');

app.use(cors());
app.use(express.json());
app.use('/api/roles', rolRoute);
app.use('/api/auth', authRoute);

app.get('/', (req, res) => {
    res.send('Servidor funcionando correctamente');
});

module.exports = app;