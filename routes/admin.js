var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')

const {
  eAdmin
} = require('../helpers/eAdmin')

require('../models/quartos')
const Quarto = mongoose.model('quartos')

require('../models/Usuario')
const Usuario = mongoose.model("usuarios")

require('../models/Reservas')
const Reserva = mongoose.model("reservas")

/* GET users listing. */

router.get('/', eAdmin, (req, res) => {
  Quarto.find((err, docs) => {
    if (!err) {
      res.render('admin/quarto/quartos', {
        quartos: docs
      })
    }
  })
});

router.get('/usuarios', eAdmin, (req, res) => {
  Usuario.find((err, docs) => {
    if (!err) {
      res.render('admin/usuario/usuarios', {
        usuarios: docs
      })
    }
  })
});

router.get('/reservas', eAdmin, (req, res) => {
  Reserva.find({}).populate('quarto').exec((err, docs) => {
    if(!err){
      res.render('admin/reserva/reservas', {reservas: docs})
    }
  })
    })

      // QUARTOS

      //Criar ou editar quarto

      router.get("/addOrEditQuarto", eAdmin, (req, res) => {
        res.render("admin/quarto/addQuarto")
      });

      router.post("/addOrEditQuarto", (req, res) => {
        if (req.body.id == "") {
          insertQuarto(req, res);
        } else {
          updateQuarto(req, res);
        }
      });

      updateQuarto = (req, res) => {
        Quarto.findByIdAndUpdate({
            _id: req.body.id
          },
          req.body, {
            new: true,
            runValidators: true
          },
          (err, doc) => {
            if (!err) {
              res.redirect("/admin/");
            } else {
              if (err.max === "ValidationError") {
                handleValidationError(err, req.body);
                res.render("admin/quarto/addQuarto", {
                  quartos: req.body
                });
              } else {
                console.log("Erro: " + err);
              }
            }
          }
        );
      };
      insertQuarto = (req, res) => {
        var addQuarto = new Quarto();
        addQuarto.numero = req.body.numero;
        addQuarto.tipo = req.body.tipo;
        addQuarto.maxPessoas = req.body.maxPessoas;
        addQuarto.criancas = req.body.criancas;
        addQuarto.preco = req.body.preco;
        addQuarto.save((err, doc) => {
          if (!err) {
            req.flash('success_msg', "Quarto criado com sucesso")
            res.redirect("/admin/");
          } else {
            if (err.name === "ValidationError") {
              handleValidationError(err, req.body);
              res.render("admin/quarto/addQuarto", {
                quartos: req.body
              });
            } else {
              console.log("Erro: " + err);
            }
          }
        });
      };
      handleValidationError = (err, body) => {
        for (field in err.errors) {
          switch (err.errors[field].path) {
            case "numero":
              body.numeroErr = err.errors[field].message;
              break;
            case "tipo":
              body.tipoErr = err.errors[field].message;
              break;
            case "maxPessoas":
              body.maxPessoasErr = err.errors[field].message;
              break;
            case "criancas":
              body.criancasErr = err.errors[field].message;
              break;
            case "preco":
              body.precoErr = err.errors[field].message;
              break;
            default:
              break;
          }
        }
      };

      // Alterar dados quarto

      router.get("/addOrEditQuarto/:id", eAdmin, (req, res) => {
        Quarto.findById(req.params.id, (err, doc) => {
          if (!err) {
            res.render("admin/quarto/addQuarto", {
              quartos: doc
            });
          }
        });
      });

      // Deletar quarto

      router.get('/delquarto/:id', eAdmin, (req, res) => {
        Quarto.findByIdAndRemove(req.params.id, (err, doc) => {
          if (!err) {
            req.flash('success_msg', "Quarto deletado!");
            res.redirect('/admin');
          } else {
            req.flash('error_msg', "Houve um erro ao deletar o quarto.");
            res.redirect('/admin');
          }
        });
      });

      router.get("/editReserva/:id", eAdmin, (req, res) => {
        
          Reserva.findById(req.params.id).populate('quarto').exec((err, docs) => {
            if(!err){
              res.render('users/reserva', {reservas: docs})
            }
          })
            })

            router.get('/delReserva/:id', eAdmin, (req, res) => {
              Reserva.findByIdAndRemove(req.params.id, (err, doc) => {
                if (!err) {
                  req.flash('success_msg', "Quarto deletado!");
                  res.redirect('/admin/reservas');
                } else {
                  req.flash('error_msg', "Houve um erro ao deletar o quarto.");
                  res.redirect('/admin/reservas');
                }
              });
            });

      module.exports = router;