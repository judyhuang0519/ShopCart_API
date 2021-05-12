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
                    reject({error:error});
                }else{
                    resolve({ data : JSON.stringify(rowPacket) });    
                }
            })
    })
}

function del(account){
    return new Promise((resolve,reject)=>{
        let query_params = [account]
        db.query(
            "DELETE FROM users_table WHERE user_account= ?;",
            query_params,
            (error,okPacket)=>{
                if(error){
                    error_show(error,"del")
                    reject({error: error})
                }else{
                    if(okPacket.affectedRows == 0){
                        //console.log("Item id: "+item_id+" is not exist")
                        resolve({msg: `User: { id: ${user_id} } is not exist`})
                    }else{
                        resolve({msg: `Success Delete User: { id: ${user_id} }`})
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
                    reject({error:error})
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
                    reject({error:error})
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
                    reject({error:error})
                }else{
                    console.log("Success Alter AUTO_INCREMENT to 1")
                    delMsg += "Success Alter users_table AUTO_INCREMENT to 1"
                    resolve(delMsg)
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
                    reject({error:error}) 
                }else{
                    resolve({msg: `Success Insert User: { account: ${user_account} , password: ${user_password} }`})
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
        let query_params = [new_password,account]
        db.query(
            "UPDATE users_table SET user_password = ? WHERE user_account = ?;",
            query_params,
            (error,okPacket)=>{
                if(error){
                    error_show(error,"update")
                    reject({error:error})
                }else{
                    if(okPacket.affectedRows == 0){
                        //console.log("Item id: "+item_id+" is not exist")
                        resolve({msg: `User: { account: ${user_account} } is not exist`})
                    }else{
                        resolve({msg: `Success Update User: { account: ${user_account} , password: ${new_password} }`})
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
            "SElECT user_id FROM users_table WHERE user_id= ?;",
            query_params,
            (error,rowPacket)=>{
                if(error){
                    error_show(error,"search")
                    reject({error:error});
                }
                else{
                     if(rowPacket.length != 0){
                        //console.log("User: "+account+" already exist")
                        resolve(rowPacket)
                    }else{
                        //console.log("User: "+account+" is not exist")
                        resolve({msg: `User: { id: ${user_id} } is not exist`})
                    }
                }
        })  
    })
}
function search_ByAccount (user_account){
    return new Promise((resolve,reject)=>{
        var query_params = [user_account]
        db.query(
            "SElECT user_account FROM users_table WHERE user_account= ?;",
            query_params,
            (error,rowPacket)=>{
                if(error){
                    error_show(error,"search_ByAccount")
                    reject({error:error});
                }
                else{
                     if(rowPacket.length != 0){
                        //console.log("User: "+account+" already exist")
                        resolve(rowPacket)
                    }else{
                        //console.log("User: "+account+" is not exist")
                        resolve({msg: `User: { account: ${user_account} } is not exist`})
                    }
                }
        })  
    })
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
    //search,
    search_ByAccount
 
    
}
