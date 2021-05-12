var db;
function set(connect_db) {
    db = connect_db
}
function show (){
    db.query("SELECT * FROM items_table;",
        (error,rows)=>{
            if(error){
                error_show(error,"show")
            }else{
                console.log(rows);  
            }
        })
}

function all (){
    return new Promise((resolve,reject)=>{
        db.query(
            "SELECT * FROM items_table;",
            (error,rowPacket)=>{
                if(error){
                    error_show(error,"all")
                    reject({error:error});
                }else{
                    resolve({ data : JSON.stringify(rowPacket) });    
                }
            })
    })
}

function del(item_id){
    return new Promise((resolve,reject)=>{
        let query_params = [item_id]
        db.query(
            "DELETE FROM items_table WHERE item_id= ?;",
            query_params,
            (error,okPacket)=>{
                if(error){
                    error_show(error,"del")
                    reject({error: error})
                }else{
                    if(okPacket.affectedRows == 0){
                        //console.log("Item id: "+item_id+" is not exist")
                        resolve({msg: `Item: { id: ${item_id} } is not exist`})
                    }else{
                        /*all().then((result)=>{
                            result = {...result, msg: `Success Delete Item: { id: ${item_id} }`}
                            resolve(result)
                        }).catch((error)=>{
                            reject(error)
                        })*/
                        resolve(result(`Success Delete Item: { id: ${item_id} }`))
                    }
                }
            })
    })
}
function del_all(){
    return new Promise((resolve,reject)=>{
        let delMsg=""
        db.query(
            "SELECT COUNT(*) FROM items_table;",
            //query_params,
            (error,rowPacket)=>{
                if(error){
                    error_show(error,"del_all_count")
                    reject({error:error})
                }else{
                    console.log(rowPacket)
                    console.log(rowPacket[0]['COUNT(*)'] + " item exist")
                    delMsg += `${rowPacket[0]['COUNT(*)']} items exist\n`
                }
            })
        db.query(
            "DELETE FROM items_table;",
            (error,okPacket)=>{
                if(error){
                    error_show(error,"del_all_delete")
                    reject({error:error})
                }else{
                    console.log("Success Delete "+okPacket.affectedRows+" items")
                    delMsg += `Success Delete ${okPacket.affectedRows} items\n`
                }
            })
        db.query(
            "ALTER TABLE items_table AUTO_INCREMENT = 1;",
            (error)=>{
                if(error){
                    error_show(error,"del_all_alter")
                    reject({error:error})
                }else{
                    console.log("Success Alter AUTO_INCREMENT to 1")
                    delMsg += "Success Alter items_table AUTO_INCREMENT to 1\n"
                    all().then((result)=>{
                        result={...result, msg:delMsg}
                        resolve(result)
                    })
                    
                }
            })   
    })
}
/*
Price Checking Move to Front-Ended

if( (isNaN(Number(price))) || (Number(price)<=0) || (`${Number(price)}`.length >9)){
    console.log("Price error: "+ price)
} 

Price Checking Move to Front-Ended
*/

function add(item_name, item_price){
    return new Promise((resolve, reject)=>{
        let query_params = [item_name,parseFloat(item_price).toFixed(2)]
        db.query(
            "INSERT INTO items_table (item_name, item_price) value(? , ?);",
            query_params,
            (error)=>{
                //code: 'ER_DUP_ENTRY',errno: 1062,sqlMessage: "Duplicate entry '12' for key 'orders_table.PRIMARY'",
                if(error){
                    error_show(error,"add")
                    reject({error:error}) 
                }else{
                    resolve({msg: `Success Insert Item: { name: ${item_name} , price: ${item_price} }`})
                }
            })    
    })
}
function update(item_id, new_name, new_price){
    return new Promise((resolve, reject)=>{
        let query_params = [item_id, new_name, new_price]
        db.query(
            "UPDATE items_table SET item_name = ?,item_price = ? WHERE item_id = ?;",
            query_params,
            (error,okPacket)=>{
                if(error){
                    error_show(error,"update")
                    reject({error:error})
                }else{
                    if(okPacket.affectedRows == 0){
                        //console.log("Item id: "+item_id+" is not exist")
                        resolve({msg: `Item: { id: ${item_id} } is not exist`})
                    }else{
                        resolve({msg: `Success Update Item: { id: ${item_id} , name: ${new_name} , price: ${new_price}}`})
                    }
                }
        })
    }) 
}

function search (item_name){
    return new Promise((resolve,reject)=>{
        let query_params = ["%"+item_name+"%"]
        db.query(
            "SElECT item_id, item_name, item_price FROM items_table WHERE item_name LIKE ?;",
            query_params,
            (error,rowPacket)=>{
                if(error){
                    error_show(error,"search")
                    reject({error:error});
                }
                else{
                    if(rowPacket.length != 0){
                        /*console.log("Matched Items:")
                         rows.forEach(row => {
                            console.log(row.item_name)
                         });*/
                        resolve(rowPacket)
                    }else{
                        //console.log("Item: "+item_name+"  no matched")
                        resolve({msg: `Item: { name: ${item_name} } No Matched`})
                    }
                }
        })  
    })
}

function search_ByPrice (min, max){
    return new Promise((resolve,reject)=>{
        let query_params = [min, max]
        db.query(
            "SElECT item_id,item_name, item_price FROM items_table WHERE item_price BETWEEN ? AND ?;",
            query_params,
            (error,rowPacket)=>{
                if(error){
                    error_show(error,"search_ByPrice")
                    reject({error:error});
                }
                else{
                     if(rowPacket.length!= 0){
                        /*console.log("Matched Items:")
                        rowPacket.forEach(row => {
                            console.log(row.item_name)
                         });*/
                        //console.log("Matched Items:\n"+rows)
                        resolve(rowPacket)
                    }else{
                        //console.log("> $"+min+"item < $"+max+" no matched")
                        resolve({msg: `Item: { price: (${min}, ${max}) } No Matched`})
                    }
                }
        })  
    })
}
async function result(msg){
    try{
        let result = await all()
        result = {...result, msg: msg}
    }catch(error){
        result = error
    }
    return result
}
function error_show(error,type){
    if(error){
        console.log("item."+type +"() error:\n"+ error)
    }
}
module.exports ={
    set,
    all,
    del,
    del_all,
    add,
    update,
    search,
    search_ByPrice
    
}
