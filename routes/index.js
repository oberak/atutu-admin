var express = require('express');
var router = express.Router();
var User = require('../model/User');
var Category = require('../models/Category');



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

/* INIT admin account  */
router.get('/init', function(req, res, next) {
  // make model using req.body
  var user = new User();
  user.name = 'Admin';
  user.phone = '097945';
  user.email = 'nay@gmail.com';
  user.password = 'nay1500';
  user.role = 'ADMIN';

      user.save(function(err, result){
        if(err) throw err;
        req.flash('success', 'Registration successful.Welcome to '+user.name);
        res.redirect('/signin');
      });
});

/* Insert sample data */
// TODO have to delete
var Category = require('../models/Category');
router.get('/samples', function(req, res, next){
    // make model using req.body
    var data = [
        {name: {my:'ပညာရေး', en:'Education'}, use:{ c:true, e:true, v: true}, dispOrder:0},
        {name: {my:'အိမ်', en:'House'}, use:{ c:true, e:true, v: true}, dispOrder:1},
        {name: {my:'ကျန်းမာရေး', en:'Health'}, use:{ c:true, e:true, v: false}, dispOrder:2},
        {name: {my:'ကလေးများ', en:'Children'}, use:{ c:true, e:false, v: true}, dispOrder:3},
        {name: {my:'ဗုဒ္ဓဘာသာ', en:'Buddhism'}, use:{ c:false, e:true, v: true}, dispOrder:4},
    ];

    // save to database using Model
    console.log('save data', data);
    Category.insertMany(data, function(err, docs){
        if(err) throw err;
        console.log('result', docs);
        res.end('ok');
    });
});

router.post('/signin', function(req, res, next) {
  var user = new User();
  // make model using req.body
  User.findOne({ email: req.body.email}, function(err, user){
    if(err) throw err;
    console.log('selected user:', user);
    if(user == null || !User.compare(req.body.password, user.password)){
        req.flash('warn', 'Email not exists or password not matched!!');
        res.redirect('/signin');
    }else{
        req.session.user = {name: user.name, email: user.email, role: user.role};
        if(user.role == 'ADMIN'){
          res.redirect('/list');
        }
    }// user exists
  });
});

/* manage category */
/*router.all('/category', function(req, res, next){
  var query = {};

  if (req.body.keyword ) {
  var query = { $or: [ {name: {'$regex': req.body.keyword, '$options': 'i'}},
                       {use: {'$regex': req.body.keyword}},
                       {dispOrder: {'$regex': req.body.keyword}}

                      ]
              };
    }
  Category.find(query, function(err, data){
    if(err) throw err;
    res.render('campaign/category', {users: data});
  });
});*/

router.get('/category', function(req, res, next) {
  res.render('campaign/category');
});

router.post('/category', function(req, res, next) {
  Category.find({}, function(err, doc){
    if(err) res.json(500, {'err': err.message});
    else res.json({ users: doc});
  });
});

router.post('/view/:id', function(req, res, next) {
  Category.findById(req.params.id, function(err, rtn){
      if(err) es.json(500, {'err': err.message});
      else res.json({ user: rtn});
    });
  });

module.exports = router;
