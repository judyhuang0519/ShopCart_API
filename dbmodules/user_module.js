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
function search (user_id){
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
function search_ByAccount (user_account){
    return new Promise((resolve,reject)=>{
        var query_params = [user_account]
        db.query(
            "SElECT * FROM users_table WHERE user_account= ?;",
            query_params,
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
                        let msg = {msg: `User: { account: ${user_account} } is not exist`}
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
    search_ByAccount
 
    
}
