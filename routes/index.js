var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/acomodacoes', function(req, res, next) {
  res.render('pages/acomodacoes');
});
router.get('/restaurante', function(req, res, next) {
  res.render('pages/restaurante');
});
router.get('/spa', function(req, res, next) {
  res.render('pages/spa');
});
router.get('/atividades', (req, res, next) => {
  res.render('pages/atividades')
})
router.get('/eventos', (req, res, next) => {
  res.render('pages/eventos')
})
router.get('/login', function(req, res, next) {
  res.render('pages/login');
});


module.exports = router;
