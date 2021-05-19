var db
function set(connect_db) {
    db = connect_db
}
const table ="order"
function show  (){
    db.query("SELECT * FROM orders_table;",
    (error,rows)=>{
        error_show(error,"show")
        console.log(rows);    
    })
}
function all (){
    return new Promise((resolve,reject)=>{
        db.query(
            "SELECT * FROM orders_table;",
            (error,rowPacket)=>{
                if(error){
                    error_show(error,"all")
                    resolve({error:error});
                }else{
                    resolve({ data : JSON.stringify(rowPacket) });    
                }
            })
    })
}
function all_detail (){
    return new Promise((resolve,reject)=>{
        db.query(
            "SELECT * FROM ordersdetails;",
            (error,rowPacket)=>{
                if(error){
                    error_show(error,"all")
                    resolve({error:error});
                }else{
                    resolve({ data : JSON.stringify(rowPacket) });    
                }
            })
    })
}
function del(query_data){
    return new Promise((resolve,reject)=>{
        let params_data = get_query(query_data)
        let query_params = [`${params(params_data)}`]
        console.log(query_params)
        //let query_params = [order_id]
        db.query(
            "DELETE FROM orders_table "+ query_params,
            (error,okPacket)=>{
                if(error){
                    error_show(error,"del")
                    resolve({error: error})
                }else{
                    if(okPacket.affectedRows == 0){
                        //console.log("Item id: "+item_id+" is not exist")
                        let msg = {msg: `Order: { id:  } is not exist`}
                        resolve(result(`Order: { id:  } is not exist`))
                    }else{
                        let msg = {msg: `Success Delete Order: { id:  }`}
                        resolve(result(`Success Delete Order: { id:  }`))
                    }
                }
            })
    })
}

function add(user_id, details){
    return new Promise((resolve,reject)=>{
        let query_params = [user_id]
        db.query(
            "INSERT INTO orders_table (user_id) value (?);",
            query_params,
            (error,okPacket)=>{
                //code ER_NO_REFERENCED_ROW_2
                if(error){
                    error_show(error,"add")
                    resolve({error:error})
                }else{
                    //console.log(okPacket.insertId)
                    add_details(okPacket.insertId,details,db)
                    .then((detail_resolve)=>{console.log("%%")
                        let msg = {msg:detail_resolve}
                        
                        resolve(result(detail_resolve))
                    }).catch((e)=>{
                        console.log("*")
                        console.log(e)
                    })
                }
        })     
    })  
}

async function add_details(order_id, details){
    let addMsg=""
    let addCount=0
    console.log(details)
    for (row in details){
        try {
            addMsg += await add_orderdetail(order_id, details[row].item_id, details[row].item_num)
            addCount++
        } catch (error) {
            addMsg+=error
        }
    }
    addMsg += `Success Adding Order: { id: ${order_id} } ${addCount} details`
    return Promise.resolve(result_detail(addMsg))
}

function add_orderdetail(order_id,item_id,item_num){
    return new Promise ((resolve,reject)=>{
        console.log(item_id)
        let query_params = [order_id, item_id, item_num]
        db.query(
            "INSERT INTO ordersdetails (order_id,item_id,item_num) value(?,?,?);",
            query_params,
            (error,okPacket)=>{
                if(error){
                    //  code: 'ER_NO_REFERENCED_ROW_2',errno: 1452,
                    //item_id not exist
                    error_show(error,"add_detail")
                    reject(`Item: { id: ${item_id} } is not exist\n`)
                }else{
                    resolve(`Success Detail Adding Item: { id: ${item_id} , num: ${item_num} } \n`)
                }
        })     
    })
}
/*function add_detail(order_id, details){
    return Promise.resolve("aa").then((addMsg)=>{
        let add_rows_count = 0;
        console.log("ordeID: "+order_id);
        for(row in details){
            let query_params = [order_id, details[row].item_id, details[row].num]
            console.log(details[row].item_id+" : "+details[row].num)
            db.query(
                "INSERT INTO ordersdetails (order_id,item_id,item_num) value(?,?,?);",
                query_params,
                (error,okPacket)=>{
                    if(error){
                        //  code: 'ER_NO_REFERENCED_ROW_2',errno: 1452,
                        //item_id not exist
                        error_show(error,"add_detail")
                        addMsg += `Item: { id: ${details[row].item_id} } is not exist\n`
                        //console.log(`Item: { id: details[row].item_id } is not exist`)
                    }else{
                        add_rows_count+=okPacket.affectedRows;
                        addMsg += `Success Order Adding Item: { id: ${details[row].item_id} , num: ${details[row].item_num} } \n`
                        //console.log(`Success Adding Order { id: ${order_id} } ${add_rows_count} Details`)
                    }
            })
            console.log("for")     
        }
        console.log("then")
        console.log(addMsg)
        console.log("then")
    }).then((res)=>{
        console.log("res")
        console.log(typeof(res))
    })
}*/
/*    let add_rows_count = 0;
    console.log("ordeID"+order_id);
    for(row in details){
        let query_params = [order_id, details[row].item_id, details[row].num]
        console.log(details[row].item_id+" : "+details[row].num)
        db.query(
            "INSERT INTO ordersdetails (order_id,item_id,item_num) value(?,?,?);",
            query_params,
            (error,okPacket)=>{
                if(error){
                    //  code: 'ER_NO_REFERENCED_ROW_2',errno: 1452,
                    //item_id not exist
                    error_show(error,"add_detail")
                    console.log("Item_id: "+details[row].item_id+"not exist")
                }else{
                    add_rows_count+=okPacket.affectedRows;
                    console.log("Success adding "+add_rows_count+" details")
                }
        })     
    }
}*/
function del_all(){
    return new Promise((resolve,reject)=>{
        let delMsg=""
        db.query(
            "SELECT COUNT(*) FROM orders_table;",
            //query_params,
            (error,rowPacket)=>{
                if(error){
                    error_show(error,"del_all_count")
                    resolve({error:error})
                }else{
                    console.log(rowPacket)
                    console.log(rowPacket[0]['COUNT(*)'] + " order exist")
                    delMsg += `${rowPacket[0]['COUNT(*)']} orders exist`
                }
            })
        db.query(
            "DELETE FROM orders_table;",
            (error,okPacket)=>{
                if(error){
                    error_show(error,"del_all_delete")
                    resolve({error:error})
                }else{
                    console.log("Success Delete "+okPacket.affectedRows+" orders")
                    delMsg += `Success Delete ${okPacket.affectedRows} orders`
                }
            })
        db.query(
            "ALTER TABLE orders_table AUTO_INCREMENT = 1;",
            (error)=>{
                if(error){
                    error_show(error,"del_all_alter")
                    resolve({error:error})
                }else{
                    console.log("Success Alter AUTO_INCREMENT to 1")
                    delMsg += "Success Alter orders_table AUTO_INCREMENT to 1"
                    resolve(result(delMsg))
                }
            })   
    })
}
function del_detail(query_data){
    return new Promise((resolve,reject)=>{
        let params_data = get_query(query_data)
        let query_params = [`${params(params_data)}`]
        //let query_params = [order_id,item_id]
        console.log(query_params)
    
        db.query(
            "DELETE FROM ordersdetails "+query_params,
            (error,okPacket)=>{
                if(error){
                    error_show(error,"del_detail")
                    resolve({error:error})
                }else{
                    if(okPacket.affectedRows == 0){
                        let msg = {msg: `Order: { id: ${query_data.order_id} }, Item: { id: ${query_data.item_id} } is not exist`}
                        //console.log("(Order_id: "+order_id+" , Item_id: "+item_id+") is not exist")
                        resolve(`Order: { id: ${query_data.order_id} }, Item: { id: ${query_data.item_id} } is not exist`)
                    }else{
                        let msg = {msg: `Success Delete Order: { id: ${query_data.order_id} }, Item: { id: ${query_data.item_id} }`}
                        resolve(result_detail(`Success Delete Order: { id: ${query_data.order_id} }, Item: { id: ${query_data.item_id} }`))
                    }
                } 
        })
    })
}
function del_detail_all(){
    return new Promise((resolve,reject)=>{
        let delMsg=""
        db.query(
            "SELECT COUNT(*) FROM ordersdetails;",
            //query_params,
            (error,rowPacket)=>{
                if(error){
                    error_show(error,"del_all_count")
                    resolve({error:error})
                }else{
                    console.log(rowPacket)
                    console.log(rowPacket[0]['COUNT(*)'] + " order exist")
                    delMsg += `${rowPacket[0]['COUNT(*)']} orders exist`
                }
            })
        db.query(
            "DELETE FROM ordersdetails;",
            (error,okPacket)=>{
                if(error){
                    error_show(error,"del_all_delete")
                    resolve({error:error})
                }else{
                    console.log("Success Delete "+okPacket.affectedRows+" orders")
                    delMsg += `Success Delete ${okPacket.affectedRows} orders`
                }
            })
        db.query(
            "ALTER TABLE orders_table AUTO_INCREMENT = 1;",
            (error)=>{
                if(error){
                    error_show(error,"del_all_alter")
                    resolve({error:error})
                }else{
                    console.log("Success Alter AUTO_INCREMENT to 1")
                    delMsg += "Success Alter orders_table AUTO_INCREMENT to 1"
                    resolve(result(delMsg))
                }
            })   
    })
}
async function update (order_id,update_data){
    let updateMsg=""
    let updateCount=0
    console.log(update_data)
    for(row in update_data){
        try {
            updateMsg += await update_detail(Number(order_id), update_data[row].item_id, update_data[row].item_num)
            updateCount++
        } catch (error) {
            updateMsg+=error
        }
    }
    
    updateMsg += `Success Adding Order: { id: ${order_id} } ${updateCount} details`
    return Promise.resolve(result_detail(updateMsg))
    
}
function update_detail(order_id,item_id,update_num){
    return new Promise((resolve,reject)=>{
        console.log(item_id)
        if(update_num<0||!update_num||!item_id){
            console.log("Invalid update num")
            reject("Invalid update num")
        }else if(update_num == 0){
            del_detail(order_id,item_id).then(()=>{resolve()})
        }else{
  
            let query_params = [update_num, order_id, item_id]
            console.log(query_params)
            db.query(
                "UPDATE ordersdetails SET item_num = ? WHERE order_id = ? AND item_id = ?;",
                query_params,
                (error,okPacket)=>{
                    if(error){
                        error_show(error,"update_detail")
                        reject(`Item: { id: ${item_id} } is not exist\n`)
                    }else{
                        
                            let msg = {msg: `Success Update Order: { id: ${order_id} }, Item: { id: ${item_id} , num: ${update_num}}`}
                            //console.log("(Order_id: "+order_id+" , Item_id: "+item_id+") is not exist")
                            resolve(`Success Update Order: { id: ${order_id} }, Item: { id: ${item_id} , num: ${update_num}}`)
                       
                    }
                })
        }
    })
}

function search (user_id){
    return new Promise((resolve,reject)=>{
        let query_params = [user_id]
        db.query("SELECT * FROM orders_table WHERE user_id = ?;",
        query_params,
        (error,rowPacket)=>{
            if(error){
                error_show(error,"search")
                resolve({error:error})
            }else{
                //console.log(rowPacket);
                resolve({data : JSON.stringify(rowPacket)})
            }
        })
    })

}
//for test
//orders_table update  
/*function update(order_id,new_order_id){
    let query_params = [new_order_id,order_id]
    db.query(
        "UPDATE orders_table SET order_id = ? WHERE order_id = ?;",
        query_params,
        (error,okPacket)=>{
            //code: 'ER_DUP_ENTRY',errno: 1062,sqlMessage: "Duplicate entry '12' for key 'orders_table.PRIMARY'",
            if(error){
                error_show(error,"update")
                resolve({error:error})
            }else if(okPacket.affectedRows == 0){
                let msg = `Order_id: ${order_id} is not exist`
                //console.log("Order_id: "+order_id+" is not exist")
                resolve(msg)
            }
        })
}*/
function search_detail (query_data){
    //let query_params = [order_id]
    console.log(query_data)
    return new Promise((resolve,reject)=>{
        let params_data = get_query(query_data)
        let query_params = [`${params(params_data)}`]
        console.log(query_params)
        db.query("SELECT * FROM ordersdetails "+query_params,
        (error,rowPacket)=>{
            if(error){
                error_show(error,"show")
                resolve({error:error})
            }else{
                resolve({data : JSON.stringify(rowPacket)})
            }
        })
    })
}
async function result(msg){
    try{

        let data = await all()
        data.msg = msg

        return data
    }catch(error){
        return error
    }
    //return data
}
async function result_detail(msg){
    try{
        let data = await all_detail()
        data.msg = msg
        return data
    }catch(error){
        return error
    }
    //return data
}
function params(data){
    let query_string =" "
    for(let index = 0,  where_and = "WHERE "; index < data.length; index++){
        query_string += where_and
        if(index == 0){
            where_and = "AND "
        }
        query_string +=`${data[index].key}`
        query_string +=` ${data[index].mode} `
        query_string += `${data[index].value} ` 
    }
    return query_string
}
function get_query(query){
    let params_data = []
    let keys=Object.keys(query)
    //console.log(query)
    //console.log(Object.entries(query))
    keys.forEach((key)=>{
      let data_key
      let data_value = query[key]
      let data_mode = "="
      switch(key){
        case "id":
          data_key=`${table}_id`
          break;
        case "name":
          data_key=`${table}_name`
          data_value = '"'+data_value+'"'
          break;
        case "name_like":
          data_key=`${table}_name`
          data_value = "'%"+data_value+"%'"
          data_mode = "LIKE"
          break
        case "account":
          data_key=`${table}_account`
          data_value = '"'+data_value+'"'
          break;
        case "account_like":
          data_key=`${table}_account`
          data_value = "'%"+data_value+"%'"
          data_mode = "LIKE"
          break;
        case "password":
            data_key=`${table}_account`
            data_value = '"'+data_value+'"'
            break
        case "num":
            data_key = "item_num"
        case "min":
          data_key=`${table}_price`
          data_mode = ">="
          break;
        case "max":
          data_key=`${table}_price`
          data_mode = "<="
          break;
        default:
            data_key = key
      }
      params_data.push({key:data_key,value:data_value,mode:data_mode})
    })
    return params_data
}
function error_show(error,type){
    if(error){
        console.log("order."+type +"() error:\n"+ error)
    }
}
module.exports ={
    set,
    show,
    all,
    all_detail,
    del,
    add,
    add_details,
    del_all,
    del_detail,
    del_detail_all,
    update_detail,
    search,
    search_detail,
    update,//test
    //search//test
   
    /*update*/
}
