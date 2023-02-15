var express = require('express');
var router = express.Router();
const mongoose = require('mongoose')

const {
  logado
} = require('../helpers/logado')

require('../models/quartos')
const Quarto = mongoose.model('quartos')
require('../models/Reservas')
const Reserva = mongoose.model("reservas")

router.get('/', logado,  (req, res) => {
  Quarto.find((err,docs) => {
  if(!err){
    res.render("users/reserva", {quartos: docs})
  }
  })
})

router.post('/', logado, (req,res) => {

  var reserva = new Reserva();
  reserva.checkin = req.body.checkin;
  reserva.checkout = req.body.checkout;
  reserva.pessoas = req.body.pessoas;
  reserva.quarto = req.body.quarto;
  reserva.promo = req.body.promo;
  reserva.cpf = req.body.cpf;

  reserva.save((err,doc)=>{
    if (!err) {
      req.flash('success_msg', "Reserva feita com sucesso!")
      res.redirect('/reserva/dados')  
    }else{
      req.flash('error_msg', "Erro ao fazer sua reserva.")
      res.redirect('/reserva/')  
    }
    
  })

})

router.get('/dados', logado, (req,res) => {
  res.render('reserva/dados')
})

router.post('/dados', logado, (req, res) => {
  Reserva.find({cpf: req.body.cpf}).populate('quarto').exec((err, docs) => {
    if(!err){
      res.render('reserva/info', {reserva: docs})
    }
  })
})  


module.exports = router;