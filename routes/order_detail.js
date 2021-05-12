var express = require('express');
var router = express.Router();

var mysql      = require('mysql');

var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'password',
  database: 'test_shopping_cart'
});
var order = require('../dbmodules/order_module')
db.connect((error)=>{
  if(error){
    console.log("Error: " + error)
  }else{
    order.set(db)
    console.log("OrderDetail DB Success")
  }
});
/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log("get Detail request")
  next()
  //res.send('respond with a resource');
});
router.use(function(req,res,next){
  order.all_detail()
  .then((orders)=>{
    res.json(orders)
  })
});
module.exports = router;
