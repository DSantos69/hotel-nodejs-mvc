const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Usuario')
const Usuario = mongoose.model("usuarios")
const bcrypt = require('bcryptjs')
const passport = require('passport')

router.get('/login', (req, res, next) => (
    res.render('users/login')
));

router.post('/login', (req, res, next) => (
  
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req,res,next)

));

router.get('/logout', (req,res,)=>{

  req.logout();
  req.flash('success_msg, "Deslogodo com sucesso')
  res.redirect('/')

})


router.get("/cadastrar", (req, res) => {
    res.render("users/cadastro")
  });
  
  router.post("/cadastrar", (req, res) => {
    if (req.body.id == "") {
      insertUsuario(req, res);
    } else {
      updateUsuario(req, res);
    }
  });
  
  updateUsuario = (req, res) => {
    Usuario.findByIdAndUpdate({
        _id: req.body.id
      },
      req.body, {
        new: true,
        runValidators: true
      },
      (err, doc) => {
        if (!err) {
          res.redirect("/users/login");
        } else {
          if (err.max === "ValidationError") {
            handleValidationError(err, req.body);
            res.render("users/cadastro", {
              usuarios: req.body
            });
          } else {
            console.log("Erro: " + err);
          }
        }
      }
    );
  };
  insertUsuario = (req, res) => {
    var addUsuario = new Usuario();
    addUsuario.nome = req.body.nome;
    addUsuario.email = req.body.email;
    addUsuario.senha = req.body.senha;
    
    bcrypt.genSalt(10, (erro, salt) => {
      bcrypt.hash(addUsuario.senha, salt, (erro, hash) => {
        if(erro){
          req.flash('error_msg', "houve um erro ao salvar o usuário!")
          res.redirect("/cadastrar")
        }

        addUsuario.senha = hash 

        addUsuario.save((err, doc) => {
          if (!err) {
            req.flash('success_msg', "Usuário criado com sucesso")
            res.redirect("/users/login");
          } else {
            if (err.name === "ValidationError") {
              handleValidationError(err, req.body);
              res.render("users/cadastro", {
                usuarios: req.body
              });
            } else {
              console.log("Erro: " + err);
            }
          }
        });
      })
    })

    
  };
  handleValidationError = (err, body) => {
    for (field in err.errors) {
      switch (err.errors[field].path) {
        case "nome":
          body.numeroErr = err.errors[field].message;
          break;
        case "email":
          body.tipoErr = err.errors[field].message;
          break;
        case "senha":
          body.maxPessoasErr = err.errors[field].message;
          break;
        
        default:
          break;
      }
    }
  };
  
  // Alterar dados usuario
  
  router.get("/admin/editUser/:id", (req, res) => {
    Usuario.findById(req.params.id, (err, doc) => {
      if (!err) {
        res.render("users/cadastro", {
          usuarios: doc
        });
      }
    });
  });
  
  
  // Deletar usuario
  
  router.get('/admin/delUser/:id', (req, res) => {
    Usuario.findByIdAndRemove(req.params.id, (err, doc) => {
      if (!err) {
        req.flash('success_msg', "Usuário deletado!");
        res.redirect('/admin');
      } else {
        req.flash('error_msg', "Houve um erro ao deletar o Usuário.");
        res.redirect('/admin');
      }
    });
  });

module.exports = router;