const bcrypt=require('bcryptjs');
const saltRounds=10;

let logger=require('./../lib/loggerLib');

let hashpassword=(myPlianPassword)=>{
    let salt=bcrypt.genSaltSync(saltRounds);
    let hash=bcrypt.hashSync(myPlianPassword,salt);
    return hash;
}

let comparepassword=(oldPassword,hashpassword,cb)=>{
    bcrypt.compare(oldPassword,hashpassword,(err,res)=>{
        if(err){
            logger.captureError(err.message,'Comparison Error',5)
            cb(err,null)
        }
        else {
            cb(null,res)
        }
    })
}

module.exports={
    hashpassword:hashpassword,
    comparepassword:comparepassword
}