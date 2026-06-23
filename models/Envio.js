const mongoose = require('mongoose');

const envioSchema = new mongoose.Schema({
    id_pedido: {
        type: String,
        required: [true, 'El ID del pedido es obligatorio'],
        unique: true,
        trim: true
    },
    remitente: {
        type: String,
        required: [true, 'El remitente es obligatorio'],
        trim: true
    },
    destinatario: {
        type: String,
        required: [true, 'El destinatario es obligatorio'],
        trim: true
    },
    direccion_entrega: {
        type: String,
        required: [true, 'La dirección de entrega es obligatoria'],
        trim: true
    },
    estado: {
        type: String,
        enum: ['pendiente', 'en tránsito', 'entregado'],
        default: 'pendiente'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Envio', envioSchema);
