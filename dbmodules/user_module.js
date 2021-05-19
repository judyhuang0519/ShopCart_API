var db
function set(connect_db) {
    db = connect_db
}
function show  (db){
    db.query("SELECT * FROM users_table;",
    (error,rows)=>{
        error_show(error,"show")
        console.log(rows);    
    })
}
const table ="user"
function all (){
    return new Promise((resolve,reject)=>{
        db.query(
            "SELECT * FROM users_table;",
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

function del(user_account){
    return new Promise((resolve,reject)=>{
        let query_params = [user_account]
        db.query(
            "DELETE FROM users_table WHERE user_account= ?;",
            query_params,
            (error,okPacket)=>{
                if(error){
                    error_show(error,"del")
                    resolve({error: error})
                }else{
                    if(okPacket.affectedRows == 0){
                        //console.log("Item id: "+item_id+" is not exist")
                        let msg = {msg: `User: { account: ${user_account} } is not exist`}
                        resolve(msg)
                    }else{
                        let msg = {msg: `Success Delete User: { account: ${user_account} }`}
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
            "SELECT COUNT(*) FROM users_table;",
            //query_params,
            (error,rowPacket)=>{
                if(error){
                    error_show(error,"del_all_count")
                    resolve({error:error})
                }else{
                    console.log(rowPacket)
                    console.log(rowPacket[0]['COUNT(*)'] + " user exist")
                    delMsg += `${rowPacket[0]['COUNT(*)']} users exist`
                }
            })
        db.query(
            "DELETE FROM users_table;",
            (error,okPacket)=>{
                if(error){
                    error_show(error,"del_all_delete")
                    resolve({error:error})
                }else{
                    console.log("Success Delete "+okPacket.affectedRows+" users")
                    delMsg += `Success Delete ${okPacket.affectedRows} users`
                }
            })
        db.query(
            "ALTER TABLE users_table AUTO_INCREMENT = 1;",
            (error)=>{
                if(error){
                    error_show(error,"del_all_alter")
                    resolve({error:error})
                }else{
                    console.log("Success Alter AUTO_INCREMENT to 1")
                    delMsg += "Success Alter users_table AUTO_INCREMENT to 1"
                    let msg = {msg:delMsg}
                    resolve(result(msg))
                }
            })   
    })
}
/*var query_params = [account]
    db.query(
        "DELETE FROM users_table WHERE user_account= ?;",
        query_params,
        (error)=>{error_show(error,"delete")})
}*/
function add(user_account, user_password){
    return new Promise((resolve, reject)=>{
        let query_params = [user_account, user_password]
        db.query(
            "INSERT INTO users_table (user_account, user_password) value(? , ?);",
            query_params,
            (error)=>{
                //code: 'ER_DUP_ENTRY',errno: 1062,sqlMessage: "Duplicate entry '12' for key 'orders_table.PRIMARY'",
                if(error){
                    error_show(error,"add")
                    resolve({error:error}) 
                }else{
                    let msg = {msg: `Success Insert User: { account: ${user_account} , password: ${user_password} }`}
                    resolve(result(msg))
                }
            })    
    })
}
/*    var query_params = [account,password]
    //var query_params = ["'"+account+"'","'"+password+"'"]
    //console.dir(db)
    db.query(
        "INSERT INTO users_table (user_account, user_password) value(? , ?);",
        query_params,
        (error)=>{
            if(error){
                error_show(error,"add")
                if(error.code=="ER_DUP_ENTRY"){
                    console.log("dulpicate error")
                    console.log("User: "+account+" already exist")
                }
            }
        })
}*/
function update(user_account,new_password){
    return new Promise((resolve, reject)=>{
        let query_params = [new_password,user_account]
        db.query(
            "UPDATE users_table SET user_password = ? WHERE user_account = ?;",
            query_params,
            (error,okPacket)=>{
                if(error){
                    error_show(error,"update")
                    resolve({error:error})
                }else{
                    if(okPacket.affectedRows == 0){
                        let msg = {msg: `User: { account: ${user_account} } is not exist`}
                        //console.log("Item id: "+item_id+" is not exist")
                        resolve(msg)
                    }else{
                        let msg = {msg: `Success Update User: { account: ${user_account} , password: ${new_password} }`}
                        resolve(result(msg))
                    }
                }
        })
    }) 
}
 /*   var query_params = [new_password,account]
    //var query_params = ["'"+account+"'","'"+password+"'"]
    //console.dir(db)
    db.query(
        "UPDATE users_table SET user_password = ? WHERE user_account = ?;",
        query_params,
        (error,okPacket)=>{
            error_show(error,"add")
            if(okPacket.affectedRows == 0){
                console.log("User: "+account+" is not exist")
            }
        })
}*/
function search_ById (user_id){
    return new Promise((resolve,reject)=>{
        var query_params = [user_id]
        db.query(
            "SElECT * FROM users_table WHERE user_id= ?;",
            query_params,
            (error,rowPacket)=>{
                if(error){
                    error_show(error,"search")
                    resolve({error:error});
                }
                else{
                     if(rowPacket.length != 0){
                        //console.log("User: "+account+" already exist")
                        resolve({data : JSON.stringify(rowPacket)})
                    }else{
                        //console.log("User: "+account+" is not exist")
                        let msg = {msg: `User: { id: ${user_id} } is not exist`}
                        resolve(msg)
                    }
                }
        })  
    })
}
function search (query_data){
    return new Promise((resolve,reject)=>{
        //var query_params = [user_account]
        console.log("&&&")
        let params_data = get_query(query_data)
        console.log(params_data)
        let query_params = [`${params(params_data)}`]
        console.log(query_params)
        console.log("&&&")
        db.query(
            "SElECT * FROM users_table " + query_params,
            (error,rowPacket)=>{
                if(error){
                    error_show(error,"search_ByAccount")
                    resolve({error:error});
                }
                else{
                     if(rowPacket.length != 0){
                        //console.log("User: "+account+" already exist")
                        resolve({data : JSON.stringify(rowPacket)})
                    }else{
                        //console.log("User: "+account+" is not exist")
                        let msg = {msg: `User: { account:  } is not exist`}
                        resolve(msg)
                    }
                }
        })  
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
        console.log("user."+type +"() error:\n"+ error)
    }
    

}
module.exports ={
    set,
    show,
    all,
    del,
    del_all,
    add,   
    update,
    search, 
}
