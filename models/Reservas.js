const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reserva = new Schema({
    checkin: {
        type: Date,
        required: true
    },
    checkout: {
        type: Date,
        required: true
    },
    pessoas: {
        type: Number,
        required: true
    },
    quarto: {
        type: Schema.Types.ObjectId,
        ref: 'quartos',
        required: true
    },
    promo: {
        type: String,
        default: 0
    },
    cpf: {
        type: String,
        required: true,
        unique: true
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('reservas', reserva);



