const Envio = require('../models/Envio');

// Registrar un nuevo envío
exports.registrarEnvio = async (req, res) => {
    try {
        const nuevoEnvio = new Envio(req.body);
        await nuevoEnvio.save();
        res.status(201).json({ mensaje: 'Envío registrado exitosamente', envio: nuevoEnvio });
    } catch (error) {
        if(error.code === 11000) {
            return res.status(400).json({ error: 'El ID del pedido ya existe' });
        }
        res.status(500).json({ error: 'Error al registrar el envío', detalle: error.message });
    }
};

// Consultar envíos activos
exports.obtenerEnvios = async (req, res) => {
    try {
        const envios = await Envio.find();
        res.status(200).json(envios);
    } catch (error) {
        res.status(500).json({ error: 'Error al consultar los envíos', detalle: error.message });
    }
};

// Buscar envío por ID de pedido
exports.obtenerEnvioPorId = async (req, res) => {
    try {
        const envio = await Envio.findOne({ id_pedido: req.params.id_pedido });
        if (!envio) {
            return res.status(404).json({ error: 'Envío no encontrado' });
        }
        res.status(200).json(envio);
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar el envío', detalle: error.message });
    }
};

// Actualizar el estado del envío
exports.actualizarEstado = async (req, res) => {
    try {
        const { estado } = req.body;
        
        // Validación básica de estados permitidos
        const estadosPermitidos = ['pendiente', 'en tránsito', 'entregado'];
        if(!estadosPermitidos.includes(estado)) {
             return res.status(400).json({ error: 'Estado no válido. Use: pendiente, en tránsito, o entregado.' });
        }

        const envio = await Envio.findOneAndUpdate(
            { id_pedido: req.params.id_pedido },
            { estado: estado },
            { new: true, runValidators: true }
        );

        if (!envio) {
            return res.status(404).json({ error: 'Envío no encontrado para actualizar' });
        }

        res.status(200).json({ mensaje: 'Estado actualizado correctamente', envio });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el estado', detalle: error.message });
    }
};
