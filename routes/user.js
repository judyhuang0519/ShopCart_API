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
router.get('/', function(req, res, next) {
  console.log("get User request")
  next()
  //res.send('respond with a resource');
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
