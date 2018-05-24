var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* Get Blank Page. */
router.get('/blank', function(req, res, next){
  res.render('blank');
});

/* Sig-in page. */
router.get('/signin', function(req, res, next){
  res.render('commons/sign-in');
})

/* List page. */
router.get('/list', function(req, res, next){
  res.render('list');
});

module.exports = router;
