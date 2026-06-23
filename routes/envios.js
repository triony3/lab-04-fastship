const express = require('express');
const router = express.Router();
const envioController = require('../controllers/envioController');

// Rutas (CRUD)
router.post('/', envioController.registrarEnvio);
router.get('/', envioController.obtenerEnvios);
router.get('/:id_pedido', envioController.obtenerEnvioPorId);
router.patch('/:id_pedido/estado', envioController.actualizarEstado);

module.exports = router;
