var express = require('express');
var router = express.Router();
//var user = require('./user_module')
//var user = require('../dbmodules/user_module')
var item = require('../dbmodules/item_module')
//var order = require('../dbmodules/order_module')
var mysql      = require('mysql');
var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'password',
  database: 'test_shopping_cart'
});

db.connect((error)=>{
  if(error){
    console.log("Error: " + error)
  }else{
    item.set(db)
    console.log("Item DB Success")
  }
});

/* GET users listing. */
router.get('/del', function(req, res, next) {
  if(req.query.id){
    console.log("item del request")
    item.del(req.query.id)
    .then((result)=>{
      res.json(result)
    }).catch((error)=>{
      res.json(error)
    })
  }else{
    console.log("item delall request")
    item.del_all().then((result)=>{
      res.json(result)
    }).catch((error)=>{
      res.json(error)
    })
  }
});
router.post('/add', function(req, res, next) {
  //console.log("item add request")
  //console.log(req.body)
  next()
});
/*router.post("/",function(req, res,next) {
  console.log("postItems request");
  console.log(req.body);

  order.add(8,req.body)
 
  res.json({PS:00}); 
});
*/

router.use(function(req,res,next){
  //console.log("QQ")
  item.all()
  .then((items)=>{
    res.json(items)
  })
});
module.exports = router;
