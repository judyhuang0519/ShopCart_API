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
    console.log("Order DB Success")
  }
});
/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log("get Oeder request")
  next()
  //res.send('respond with a resource');
});
router.get('/del', function(req, res, next) {
  if(req.query.id){
    console.log("order del request")
    order.del(req.query.id)
    .then((result)=>{
      res.json(result)
    })
  }else{
    console.log("order delall request")
    order.del_all().then((result)=>{
      res.json(result)
    })
  }
});
router.use(function(req,res,next){
  order.all()
  .then((orders)=>{
    res.json(orders)
  })
});
module.exports = router;
