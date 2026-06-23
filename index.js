const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a MongoDB (Local o Atlas)
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/fastship';
mongoose.connect(uri)
.then(() => console.log('Conexión exitosa a la base de datos MongoDB'))
.catch((err) => console.error('Error al conectar a MongoDB:', err));

// Rutas base
app.use('/api/envios', require('./routes/envios'));

// Iniciar Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor de FastShip inicializado y corriendo en el puerto ${PORT}`);
});
