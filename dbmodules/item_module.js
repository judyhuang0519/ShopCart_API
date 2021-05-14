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
const table = "item"
function all (){
    return new Promise((resolve,reject)=>{
        db.query(
            "SELECT * FROM items_table;",
            (error,rowPacket)=>{
                if(error){
                    error_show(error,"all")
                    reject({error:error});
                }else{
                    resolve({data : JSON.stringify(rowPacket)});    
                }
            })
    })
}

/*function del(item_id){
    return new Promise((resolve,reject)=>{
        let query_params = [item_id]
        db.query(
            "DELETE FROM items_table WHERE item_id= ?;",
            query_params,
            (error,okPacket)=>{
                if(error){
                    error_show(error,"del")
                    //console.log(error.sqlMessage)
                    resolve({error: error.sqlMessage})
                }else{
                    if(okPacket.affectedRows == 0){
                        //console.log("Item id: "+item_id+" is not exist")
                        let msg = {msg:`Item: { id: ${item_id} } is not exist`}
                        resolve(msg)
                    }else{
                        /*all().then((result)=>{
                            result = {...result, msg: `Success Delete Item: { id: ${item_id} }`}
                            resolve(result)
                        }).catch((error)=>{
                            reject(error)
                        })
                        let msg = {msg:`Success Delete Item: { id: ${item_id} }`}
                        resolve(result(msg))
                    }
                }
            })
    })
}*/
function del(query_data){
    return new Promise((resolve,reject)=>{
        let params_data = get_query(query_data)
        let query_params = [`${params(params_data)}`]
        console.log(params_data)
        //let query_params = [item_id]
        db.query(
            "DELETE FROM items_table " +query_params,
            (error,okPacket)=>{
                if(error){
                    error_show(error,"del")
                    resolve({error: error.sqlMessage})
                }else{
                    if(okPacket.affectedRows == 0){
                        let msg = {msg:`Item is not exist`}
                        resolve(msg)
                    }else{
                        let msg = {msg:`Success Delete Item!`}
                        resolve(result(msg))
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
                    
                    resolve({error:error.sqlMessage})
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
                    resolve({error:error.sqlMessage})
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
                    resolve({error:error.sqlMessage})
                }else{
                    console.log("Success Alter AUTO_INCREMENT to 1")
                    delMsg += "Success Alter items_table AUTO_INCREMENT to 1\n"
                    let msg = { msg: delMsg}
                    resolve(result(msg))
                    /*all().then((result)=>{
                        result={...result, msg:delMsg}
                        resolve(result)
                    })*/
                    
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
                    resolve({error:error}) 
                }else{
                    let msg = {msg: `Success Insert Item: { name: ${item_name} , price: ${item_price} }`}
                    resolve(result(msg))
                }
            })    
    })
}
function update(item_id, new_name, new_price){
    return new Promise((resolve, reject)=>{
        let query_params = [ new_name, new_price,item_id]
        db.query(
            "UPDATE items_table SET item_name = ?,item_price = ? WHERE item_id = ?;",
            query_params,
            (error,okPacket)=>{
                if(error){
                    error_show(error,"update")
                    resolve({error:error})
                }else{
                    if(okPacket.affectedRows == 0){
                        //console.log("Item id: "+item_id+" is not exist")
                        let msg={msg: `Item: { id: ${item_id} } is not exist`}
                        resolve(msg)
                    }else{
                        let msg = {msg: `Success Update Item: { id: ${item_id} , name: ${new_name} , price: ${new_price}}`}
                        resolve(result(msg))
                    }
                }
        })
    }) 
}

function search (query_data){
    return new Promise((resolve,reject)=>{
        console.log(query_data)
        let params_data = get_query(query_data)
        let query_params = [`${params(params_data)}`]
        db.query(
            "SElECT * FROM items_table " + query_params,
            (error,rowPacket)=>{
                if(error){
                    error_show(error,"search")
                    resolve({error:error});
                }
                else{
                    if(rowPacket.length != 0){
                        console.log("Matched Items:")
                        rowPacket.forEach(row => {
                            console.log(row.item_name)
                         });
                        resolve({data : JSON.stringify(rowPacket)})
                    }else{
                        let msg = {msg: `Item: ${JSON.stringify(params_data)} No Matched`}
                        resolve(msg)
                    }
                }
        }) 
    })
}
/*function search (item_name){
    return new Promise((resolve,reject)=>{
        let query_params = ["%"+item_name+"%"]
        db.query(
            "SElECT item_id, item_name, item_price FROM items_table WHERE item_name LIKE ?;",
            query_params,
            (error,rowPacket)=>{
                if(error){
                    error_show(error,"search")
                    resolve({error:error});
                }
                else{
                    if(rowPacket.length != 0){
                        /*console.log("Matched Items:")
                         rows.forEach(row => {
                            console.log(row.item_name)
                         });
                        resolve({data : JSON.stringify(rowPacket)})
                    }else{
                        //console.log("Item: "+item_name+"  no matched")
                        let msg = {msg: `Item: { name: ${item_name} } No Matched`}
                        resolve(msg)
                    }
                }
        })  
    })
}
*/
function search_ByPrice (min, max){
    return new Promise((resolve,reject)=>{
        let query_params = [min, max]
        db.query(
            "SElECT item_id,item_name, item_price FROM items_table WHERE item_price BETWEEN ? AND ?;",
            query_params,
            (error,rowPacket)=>{
                if(error){
                    error_show(error,"search_ByPrice")
                    resolve({error:error});
                }
                else{
                     if(rowPacket.length!= 0){
                        /*console.log("Matched Items:")
                        rowPacket.forEach(row => {
                            console.log(row.item_name)
                         });*/
                        //console.log("Matched Items:\n"+rows)
                        resolve({data : JSON.stringify(rowPacket)})
                    }else{
                        //console.log("> $"+min+"item < $"+max+" no matched")
                        let msg={msg: `Item: { price: (${min}, ${max}) } No Matched`}
                        resolve(msg)
                    }
                }
        })  
    })
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
async function result(msg){
    try{
        console.log(msg)
        console.log("#")
        let data = await all()
        data = {...data, ...msg}
        console.log(data)
        return data
    }catch(error){
        return error
    }
    //return data
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
          data_mode = "<="
          break;
        case "max":
          data_key=`${table}_price`
          data_mode = ">="
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
        console.log("item."+type +"() error:\n")
        console.log(error.sqlMessage)
        console.log("--------------")
       
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
    //search_params,
    search_ByPrice,
    //search_params
    
}
