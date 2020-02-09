const jwt=require('jsonwebtoken');
const shortid=require('shortid');
const secretKey='somerandonstringvalue';

let generateToken=(data,cb)=>{
    try{
        let claims={
            jwtid:shortid.generate(),
            iat:Date.now(),
            sub:'authToken',
            iss:'edChat',
            data:data
        }
        let tokenDetails={
            token:jwt.sign(claims,secretKey),
            tokenSecret:secretKey
        }
        cb(null,tokenDetails)
    }
    catch (err) {
        console.log(err)
        cb(err,null)
    }
 
}

let verifyClaim=(token,secretKey,cb)=>{
    jwt.verify(token,secretKey,(err,decoded)=>{
        if(err){
            console.log('error while verify token')
            console.log(err)
            cb(err,null)
        }
        else {
            console.log(decoded)
            console.log('user verified')
        
            cb(null,decoded)
        }
    })
}

let verifyClaimWithoutSecret=(token,cb)=>{
    jwt.verify(token,secretKey,(err,decoded)=>{
        if(err){
            console.log('err while verify token');
            console.log(err);
            cb(err,null)
        }
        else {
            console.log('user verified');
            cb(null,decoded)
        }
    })
}

module.exports={
    generateToken:generateToken,
    verifyClaim:verifyClaim,
    verifyClaimWithoutSecret:verifyClaimWithoutSecret
}