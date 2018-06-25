var express = require('express');
var multer = require('multer');
var router = express.Router();
var User = require('../model/User');
var Category = require('../models/Category');
var upload = multer({ dest: 'public/upload' });
var Campaign = require('../models/Campaign');



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
    // make model using req.bodys
    var data = [
        {name: {my:'ပညာရေး', en:'Education'}, contact:{ c:true, e:true, v:true }, dispOrder:0},
        {name: {my:'အိမ်', en:'House'}, contact:{c:true, e:true, v:true}, dispOrder:1},
        {name: {my:'ကျန်းမာရေး', en:'Health'}, contact:{ c:true, e:true, v:false}, dispOrder:2},
        {name: {my:'ကလေးများ', en:'Children'}, contact:{ c:true, e:false, v:true}, dispOrder:3},
        {name: {my:'ဗုဒ္ဓဘာသာ', en:'Buddhism'}, contact:{ c:false, e:true, v:true}, dispOrder:4},
    ];

    // save to database using Model
    console.log('save data', data);
    Category.insertMany(data, function(err, docs){
        if(err) throw err;
        console.log('result', docs);
        res.end('ok');
    });
});

//view campoign list
router.all('/campaign-list', function(req, res, next) {
  var query = {};

Campaign.count(query, function(err, count){
  var paging = {
    currpage: Number(req.body.currpage) || 1,
    perpage: Number(req.body.perpage) || 3,
    count: count,
    total: Math.ceil(count/(req.body.perpage || 3)),
    psize: 5,
    skip: {}
  };
  //ToDo start, END\
  paging.start = (Math.ceil(paging.currpage/paging.psize)-1)*paging.psize+1;
  paging.end = paging.start+paging.psize-1;
  if(paging.end>paging.total) paging.end = paging.total;
  //ToDo pre, Next
  paging.skip.next = paging.psize * Math.ceil(paging.currpage/paging.psize) +1;
  paging.skip.prev = paging.skip.next - paging.psize*2;
  Campaign.find(query).skip((paging.currpage -1) * paging.perpage).limit(paging.perpage).exec(function(err, doc){
    if(err) throw err;
      res.render('campaign/campaign-list', {campaigns: doc, paging: paging});
    });
  });
});

//report list view
router.get('/report-list', function(req,res,next){
    res.render('campaign/report-list')
});

router.get('/user-list', function(req,res,next){
    res.render('campaign/user-list')
});

router.get('/point-transfer', function(req,res,next){
    res.render('campaign/point-transfer')
});

router.get('/point-history', function(req,res,next){
    res.render('campaign/point-history')
});

router.get('/campaign-detail', function(req,res,next){
    res.render('campaign/campaign-detail')
});

router.get('/user-detail', function(req,res,next){
    res.render('campaign/user-detail')
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

//category view
router.get('/category', function(req, res, next) {
  res.render('campaign/category');
});

router.post('/category', function(req, res, next) {
  Category.find({}, function(err, doc){
    if(err) res.json(500, {'err': err.message});
    else res.json({ categories: doc});
  });
});

//modify popup view
router.post('/view/:id', function(req, res, next) {
  Category.findById(req.params.id, function(err, rtn){
      if(err) res.json(500, {'err': err.message});
      else res.json({ categories: rtn});
    });
  });

router.post('/category/modify', function(req, res, next) {
  Category.findById(req.body.catid, function(err, category){
      category.name.my = req.body.myanmarname;
      category.name.en = req.body.englishname;
      category.contact.c = req.body.campaign;
      category.contact.e = req.body.hotevent;
      category.contact.v = req.body.volunteer;
      category.save(function (err, rtn){
      if(err) res.json(500, {'err': err.message});
      else res.json({ Categories: rtn});
      });
    });
  });

  //add popup view
  router.post('/add/:id', function(req, res, next) {
    Category.findById(req.params.id, function(err, rtn){
        if(err) res.json(500, {'err': err.message});
        else res.json({ categories: rtn});
      });
    });

  router.post('/category/add',upload.any(), function(req, res, next) {
    var category = new Category();
    category.name.my = req.body.myanmarname;
    category.name.en = req.body.englishname;
    category.contact.c = req.body.campaign;
    category.contact.e = req.body.hotevent;
    category.contact.v = req.body.volunteer;
    for(var i in req.files){
      category[req.files[i].fieldname] = '/uploads/' + req.files[i].filename;
    }
    category.save(function (err, rtn){
      if(err) res.json(500, {'err': err.message});
      else res.json({ Categories: rtn});
        });
      });

  //delete popup view
  router.post('/dele/:id', function(req, res, next) {
    Category.findById(req.params.id, function(err, rtn){
        if(err) res.json(500, {'err': err.message});
        else res.json({ categories: rtn});
      });
    });

    router.post('/category/dele', function(req, res, next) {
      Category.findByIdAndRemove(req.body.catid, function(err, rtn){
          if(err) res.json(500, {'err': err.message});
          else res.json({ categories: rtn});
        });
      });


module.exports = router;
