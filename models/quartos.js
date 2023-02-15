const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Quarto = new Schema({
    numero: {
        type: Number,
        required: true,
        unique: true
    },
    tipo: {
        type: String,
        required: true
    },
    maxPessoas: {
        type: Number,
        required: true
    },
    criancas: {
        type: Number,
        required: true
    },
    preco: {
        type: Number,
        required:  true
    },
    reserva: {
        type: Number,
        default: 0
    },
    date:{
        type: Date,
        default: Date.now()
    }
});

mongoose.model('quartos', Quarto);