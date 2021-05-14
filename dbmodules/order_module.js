var db
function set(connect_db) {
    db = connect_db
}
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
function del(order_id){
    return new Promise((resolve,reject)=>{
        let query_params = [order_id]
        db.query(
            "DELETE FROM orders_table WHERE order_id= ?;",
            query_params,
            (error,okPacket)=>{
                if(error){
                    error_show(error,"del")
                    resolve({error: error})
                }else{
                    if(okPacket.affectedRows == 0){
                        //console.log("Item id: "+item_id+" is not exist")
                        let msg = {msg: `Order: { id: ${order_id} } is not exist`}
                        resolve(result(msg))
                    }else{
                        let msg = {msg: `Success Delete Order: { id: ${order_id} }`}
                        resolve(result(msg))
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
                    .then((detail_resolve)=>{
                        let msg = {msg:detail_resolve}
                        //console.log("detail_resolve:")
                        //console.log(detail_resolve)
                        resolve(result(msg))
                    })
                }
        })     
    })  
}

async function add_details(order_id, details){
    let addMsg=""
    let addCount=0
    for (row in details){
        try {
            addMsg += await add_orderdetail(order_id, details[row].item_id, details[row].num)
            addCount++
        } catch (error) {
            addMsg+=error
        }
    }
    addMsg += `Success Adding Order: { id: ${order_id} } ${addCount} details`
    return Promise.resolve(addMsg)
}

function add_orderdetail(order_id,item_id,item_num){
    return new Promise ((resolve,reject)=>{
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
function del_detail(order_id,item_id){
    return new Promise((resolve,reject)=>{
        let query_params = [order_id,item_id]
        db.query(
            "DELETE FROM ordersdetails WHERE order_id= ? AND item_id= ?;",
            query_params,
            (error,okPacket)=>{
                if(error){
                    error_show(error,"del_detail")
                    resolve({error:error})
                }else{
                    if(okPacket.affectedRows == 0){
                        let msg = {msg: `Order: { id: ${order_id} }, Item: { id: ${item_id} } is not exist`}
                        //console.log("(Order_id: "+order_id+" , Item_id: "+item_id+") is not exist")
                        resolve(msg)
                    }else{
                        let msg = {msg: `Success Delete Order: { id: ${order_id} }, Item: { id: ${item_id} }`}
                        resolve(result_detail(msg))
                    }
                } 
        })
    })
}

function update_detail(order_id,item_id,update_num){
    return new Promise((resolve,reject)=>{
        if(update_num<0){
            console.log("Invalid update num")
            resolve({error:"Invalid update num"})
        }else if(update_num == 0){
            del_detail(order_id,item_id).then((del_detail_resolve)=>{resolve(del_detail_resolve)})
        }else{
            let query_params = [update_num, order_id, item_id]
            db.query(
                "UPDATE ordersdetails SET item_num = ? WHERE order_id = ? AND item_id = ?;",
                query_params,
                (error,okPacket)=>{
                    if(error){
                        error_show(error,"update_detail")
                        resolve({error:error})
                    }else{
                        if(okPacket.affectedRows == 0){
                            let msg = {msg: `Success Update Order: { id: ${order_id} }, Item: { id: ${item_id} , num: ${update_num}}`}
                            //console.log("(Order_id: "+order_id+" , Item_id: "+item_id+") is not exist")
                            resolve(result_detail(msg))
                        }
                    }
                })
        }
    })
}
function search_ByUser (user_id){
    return new Promise((resolve,reject)=>{
        let query_params = [user_id]
        db.query("SELECT * FROM orders_table WHERE user_id = ?;",
        query_params,
        (error,rowPacket)=>{
            if(error){
                error_show(error,"search_ByUser")
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
function update(order_id,new_order_id){
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
}
function search (order_id){
    let query_params = [order_id]
    db.query("SELECT * FROM orders_table WHERE order_id = ?;",
    query_params,
    (error,rowPacket)=>{
        if(error){
            error_show(error,"show")
            resolve({error:error})
        }else{
            resolve({data : JSON.stringify(rowPacket)})
        }
    })
}
async function result(msg){
    try{
        let data = await all()
        data = {...data, msg}
        return data
    }catch(error){
        return error
    }
    //return data
}
async function result_detail(msg){
    try{
        let data = await all_detail()
        data = {...data, msg}
        return data
    }catch(error){
        return error
    }
    //return data
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
    update_detail,
    search_ByUser,
    //update,//test
    //search//test
   
    /*update*/
}
