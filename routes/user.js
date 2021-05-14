var express = require('express');
var router = express.Router();

var mysql      = require('mysql');

var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'password',
  database: 'test_shopping_cart'
});
var user = require('../dbmodules/user_module')

db.connect((error)=>{
  if(error){
    console.log("Error: " + error)
  }else{
    user.set(db)
    console.log("User DB Success")
  }
});
/* GET users listing. */
router.get('/all', function(req, res, next) {
  console.log("get User request")
  user.all()
  .then((users)=>{
    //console.log(result.data)
    res.json(users)
  })
});
router.post('/add',function(req, res, next){
  console.log("user add request")
  console.log(req.body)
  let account = req.body.user_account
  let password = req.body.user_password
  if(account != "" && password != ""){
    user.add(account,password)
    .then((result)=>{
      res.json(result)
    })
  }else{
    res.json({msg:"Invalid input"})
  }
  //next()
})
router.get('/del', function(req, res, next) {
  if(req.query.id){
    console.log("user del request")
    user.del(req.query.id)
    .then((result)=>{
      console.log(result)
      res.json(result)
    })
  }else{
    console.log("user delall request")
    user.del_all()
    .then((result)=>{
      res.json(result)
    })
  }
});
router.post('/update',function(req, res, next){
  console.log("user update request")
  console.log(req.body)
  let account = req.body.user_account
  let new_password = req.body.new_password
  if(account != "" && new_password != ""){
    user.update(account,new_password)
    .then((result)=>{
      res.json(result)
    })
  }else{
    res.json({msg:"Invalid input"})
  }
  //next()
})
router.get('/search', function(req, res, next) {
  if(req.query.id){
    console.log("user search id request")
    user.search(req.query.id)
    .then((result)=>{
      console.log(result)
      res.json(result)
    })
  }else if(req.query.account){
    console.log("user search account request")
    user.search_ByAccount(req.query.account)
    .then((result)=>{
      res.json(result)
    })
  }else{
    next()
  }
});
/*router.post('/',function(req, res, next) {
  console.log("get User request")
  next()
  //res.send('respond with a resource');
});*/
router.use(function(req,res,next){
  user.all()
  .then((users)=>{
    //console.log(result.data)
    res.json(users)
  })
});
module.exports = router;
