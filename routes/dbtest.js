var express = require('express');
var router = express.Router();
var mysql      = require('mysql');
var user = require('../dbmodules/user_module')
var item = require('../dbmodules/item_module')
var order = require('../dbmodules/order_module')
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
    user.set(db)
    item.set(db)
    order.set(db)
    console.log("dbtest Success")
  }
});
router.get('/',async function(req, res, next) {
    console.log("getdb request")
    //table_show(res, "items_table")
    //console.log("a1")
    item.add("item1",10)
    //order.del_all()
    /*await order.add(8,{
      '0': { item_id: 10, item_name: 'item5', item_price: 50, num: 2 },
      '1': { item_id: 3, item_name: 'item3', item_price: 30, num: 1 },
      '2': { item_id: 2, item_name: 'item2', item_price: 20, num: 1 }
    })*/
    //order.add()
    //order.del_all(db)
    //item.search_price(100,100,db)
    //item.add("item5",50,db)
    //user.search("test",db)
    
    //console.log("aa")
    //user.add("rrr","777")
    //user.delete("aaa",db)
    //console.log("a")
    table_show(res)

    //table_show(res, "oders_table")
    //table_show(res, "odersdetails")

 
});
function table_show(res){
  var render_object={};
  db.query("SELECT * FROM users_table",(error,rows)=>{
    if (error){
      console.log(" error: "+error)
    }else{
      render_object.user_rows = rows
    }
  })
  db.query("SELECT * FROM orders_table",(error,rows)=>{
    if (error){
      console.log(" error: "+error)
    }else{
      render_object.order_rows = rows
    }
  })
  db.query("SELECT * FROM ordersdetails",(error,rows)=>{
    if (error){
      console.log(" error: "+error)
    }else{
      render_object.orderdetail_rows = rows
    }
  })
  db.query("SELECT * FROM items_table",(error,rows)=>{
    if (error){
      console.log(" error: "+error)
    }else{
      render_object.item_rows = rows
      res.render('db', render_object);
    }
  })
}
/*router.get('/', function(req, res, next) {
  connection.query("SELECT * FROM ordersdetails",(error,rows)=>{
    if (error){
      console.log("getItems error: "+error)
    }else{
      console.log("BBB ");
      console.log(rows);
      res.render('db', {orderdetail_rows : rows});
      console.log("/BBB ");
    }
  })
})*/


module.exports = router;