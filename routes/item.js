var express = require('express');
var router = express.Router();
//var user = require('./user_module')
//var user = require('../dbmodules/user_module')
var item = require('../dbmodules/item_module')
var order = require('../dbmodules/order_module')

//var order = require('../dbmodules/order_module')
var mysql      = require('mysql');
const { request } = require('express');
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
const table = "item"
router.get('/all', function(req, res, next) {
  console.log("get Item request")
  item.all()
  .then((items)=>{
    //console.log(result.data)
    res.json(items)
  })
});
/* GET users listing. */
router.post('/add',function(req, res, next){
  console.log("item add request")
  console.log(req.body)
  let name = req.body.item_name
  let price = req.body.item_price
  if( (isNaN(Number(price))) || (Number(price)<=0) || (`${Number(price)}`.length >9)){
    res.json({msg:"Invalid price"})
  }else if (name == ""||!name){
    res.json({msg:"Invalid name"})
  }else{
    item.add(name,price)
    .then((result)=>{
      res.json(result)
    })
  } 
  //next()
})
router.get('/del', function(req, res, next) {
  console.log("item del request")
  console.log('#')
  console.log(req.query)
  console.log('#')
  if(req.query){
    console.log("%")
    item.del(req.query)
    .then((result)=>{
      res.json(result)
    })
  }else{
    item.del_all()
    .then((result)=>{
      res.json(result)
    })
  }
  
  /*if(req.query.id){
    console.log("item del request")
    item.del(req.query.id)
    .then((result)=>{
      res.json(result)
    })
  }else{
    console.log("item delall request")
    item.del_all().then((result)=>{
      res.json(result)
    })
  }*/
});
router.get('/search', function(req, res, next) {
  console.log("item search request")
  console.log(req.query)
  console.log(" request")
  item.search(req.query)
  .then((result)=>{
    res.json(result)
  })
  /*if(req.query.id){
    console.log("item search id request")
    console.log(req.query.id)
    item.del(req.query.id)
    .then((result)=>{
      res.json(result)
    })
  }else if (req.query.name){
    console.log("item search name request")
    console.log(req.query.name)
    item.search(req.query.name).then((result)=>{
      res.json(result)
    })
  }else if (req.query.price){
    console.log("item search price request")
    console.log(req.query.price)
  }*/
  return next()
});
router.post('/update',function(req, res, next){
  console.log("item update request")
  console.log(req.body)
  let id = req.body.item_id
  let name = req.body.new_name
  let price = req.body.new_price
  if( (isNaN(Number(price))) || (Number(price)<=0) || (`${Number(price)}`.length >9)){
    //console.log((isNaN(Number(price))))
    res.json({msg:"Invalid price"})
  }else if ((name == ""||!name) && (price == ""||!price)){
    res.json({msg:"Invalid input"})
  }else{
    item.update(id,name,price)
    .then((result)=>{
      res.json(result)
    })
  } 
  //next()
})
router.post("/",function(req, res,next) {
  console.log("postItems request");
  console.log(req.body);

  order.add(1,req.body)
 
  res.json({PS:00}); 
});


router.use(function(req,res,next){
  //console.log("QQ")
  item.all()
  .then((items)=>{
    res.json(items)
  })
});

module.exports = router;
