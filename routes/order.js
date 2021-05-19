const { request } = require('express');
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
/* Search order by user_id */
router.get('/', function(req, res, next) {
  console.log("get Oeder request")
  if(req.query.id){
    order.search(req.query.id)
    .then((items)=>{
      console.log(items)
      res.json(items)
    })
  }else{
    order.all()
    .then((items)=>{
      console.log(items)
      res.json(items)
    })
  }
  
  //res.send('respond with a resource');
});
//search order detail
router.get('/:order_id', function(req, res, next) {
  console.log("orderdetail search request")
  console.log(typeof(req.params.order_id))
  let search_query = {...req.query}
  if(req.params.order_id == "detail"){
    /*console.log("orderdetail request")
    order.all_detail()
    .then((result)=>{
      console.log(result)
      res.json(result)
    })*/
  }else{
    //let search_query = {...req.query}
    search_query.order_id = req.params.order_id
   
  } order.search_detail(search_query)
    .then((result)=>{
      res.json(result)
    })

})
/* get all order */

/* add order */
router.post('/', function(req, res, next) {
  console.log("order search request")
  console.log(req.body)
  order.add(req.body.user_id,req.body.order_data)
  .then((result)=>{
    res.json(result)
  })
})
/* add order detail*/
router.post('/:order_id', function(req, res, next) {
  console.log("order search request")
  console.log(req.body)
  let add_data = {...req.body}
  delete add_data.order_id
  order.add_details(req.params.order_id,add_data)
  .then((result)=>{
    console.log("DD")
    //console.log(result)
    res.json(result)
  })
})
//delete
router.delete('/', function(req, res, next) {
  console.log("order delete request")
  console.log(req.query)
  if(Object.keys(req.query).length!=0)
  {
    order.del(req.query)
    .then((result)=>{
      res.json(result)
    })
  }else{
    console.log("$")
    order.del_all()
    .then((result)=>{
      res.json(result)
    })
  }
})
/* delete order detail*/
router.delete('/:order_id', function(req, res, next) {
  console.log("orderdetail delete request")
  console.log(req.query)
  if(req.params.order_id == "detail"){
    order.del_detail_all()
    .then((result)=>{
      res.json(result)
    })
  }else{
    let delete_query = {...req.query}
    delete_query.order_id = req.params.order_id
    order.del_detail(delete_query)
    .then((result)=>{
      res.json(result)
    })
  }
  /*if(req.query)
  {
    order.del_detail(req.params.order_id,req.query.item_id)
    .then((result)=>{
      res.json(result)
    })
  }else{
    if(req.params.order_id =="detail")
    {
      order.del_detail_all()
      .then((result)=>{
        res.json(result)
      })
    }else{

    }*/
    console.log("$")
    
}
)
/*router.patch('/', function(req, res, next) {
  console.log("order update request")
  let id = req.body.id
  let item_id = req.body.item_id
  let num = req.body.num
  order.update_detail(id,item_id,num)
})*/
router.patch('/:order_id', function(req, res, next) {
  console.log("orderdetail update request")
  /*let id = req.params.id
  let item_id = req.body.item_id
  let num = req.body.num*/
  console.log(req.body)
  let update_data = {...req.body}
  delete update_data.order_id
  order.update(req.params.order_id,update_data)
  .then((orders)=>{
    console.log(orders)
    res.json(orders)
  })
})
router.use(function(req,res,next){
  order.all()
  .then((orders)=>{
    res.json(orders)
  })
});
module.exports = router;
