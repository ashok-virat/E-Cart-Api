const shortid=require('shortid');
const mongoose=require('mongoose');
const passwordhashing=require('./../lib/hashpassword');
const response=require('./../lib/responseLib');
const logger=require('./../lib/loggerLib');
const check=require('./../lib/checkLib');
const validation=require('./../lib/paramvalidation');
const token=require('./../lib/tokenLib');


const userpath=require('./../models/user');
const UserModel= mongoose.model('UserModel');
const authpath=require('./../models/auth');
const AuthModel=mongoose.model('Auth');
const product=require('../models/product');
const productModel=mongoose.model('productModel');

//signup function is start
let signup=(req,res)=>{
    let validateuseremail=()=>{
        return new Promise((resolve,reject)=>{
      
            if(req.body.email){
               
            if(!validation.Email(req.body.email)){
                 logger.captureError('email does not meet requirement','email validation',8);
                 let apiResponse=response.response(true,'email does not meet requirement',404,null);
                 reject(apiResponse);
            }
            else if(check.isEmpty(req.body.email)){
                logger.captureError('email is not there','email validation',5);
                let apiResponse=response.response(true,'email is not there',400,null);
                reject(apiResponse);
            }
            else{
               
                resolve(req);
            }
            }
            else {
                logger.captureError('email parameter is missing','email validation',10);
                let apiResponse=response.response(true,'email parameter is missing',403,null);
                reject(apiResponse);
            }
        })
    }
    let validateuserpassword=()=>{
        return new Promise((resolve,reject)=>{
         
            if(req.body.password){
               
            if(!validation.Password(req.body.password)){
                 logger.captureError('password not meet requirement','email validation',8);
                 let apiResponse=response.response(true,'password does not meet requirement',404,null);
                 reject(apiResponse);
            }
            else if(check.isEmpty(req.body.password)){
                logger.captureError('password is not there','email validation',5);
                let apiResponse=response.response(true,'password is not there',400,null);
                reject(apiResponse);
            }
            else{
               
                resolve(req);
            }
            }
            else {
                logger.captureError('password parameter is missing','email validation',10);
                let apiResponse=response.response(true,'password parameter is missing',403,null);
                reject(apiResponse);
            }
        })
    }

    
  
   let createUser=()=>{
       return new Promise((resolve,reject)=>{
           UserModel.findOne({email:req.body.email})
           .exec((err,emailDeatils)=>{
               if(err){
                logger.captureError('some error occured','createuser',10);
                   let apiResponse=response.response(true,err.message,400,null);
                   reject(apiResponse);
               }
               else if(check.isEmpty(emailDeatils)){
                   let createuser=new UserModel({
                            userId:shortid.generate(),
                            firstName:req.body.firstName,
                            lastName:req.body.lastName,
                            email:req.body.email,
                            password:passwordhashing.hashpassword(req.body.password),
                            createdOn:Date.now()
                   })
                   createuser.save((err,createuser)=>{
                       if(err){
                        logger.captureError('error','createuser',10);
                           let apiResponse=response.response(true,err.message,403,null)
                           reject(apiResponse)
                       }
                       else{
                           let object=createuser.toObject();
                           resolve(object);  
                           console.log(object) 
                       }
                   })
               }
               else {
                logger.captureError('email is already present','createuser',10);
                   let apiResponse=response.response(true,'email is already present',500,null);
                   reject(apiResponse);
               }
           })
       })
   }

       validateuseremail(req,res)
        .then(validateuserpassword)
       .then(createUser)
       .then((resolve)=>{

           delete resolve.password;

           let apiResponse=response.response(false,'signup succesfully',200,resolve);
           res.send(apiResponse);
       })
       .catch((reject)=>{
           res.send(reject);
       })
}

//signup function end



//signin function is start

let signin=(req,res)=>{
    
    let checkemail=()=>{
        return new Promise((resolve,reject)=>{
             if(req.body.email){
                 UserModel.findOne({email:req.body.email},(err,result)=>{
                     if(err){
                        logger.captureError(err.message,'checkmail',8);
                         let apiResponse=response.response(true,err.message,404,null)
                         reject(apiResponse)
                     }
                     else if(check.isEmpty(result)){
                        logger.captureError('user not found','checkmail',8);
                         let apiResponse=response.response(true,'user not found',400,null)
                         reject(apiResponse)
                     }
                     else {
                         resolve(result)
                     }
                 })
             }
             else {
                logger.captureError('Email parameter is missing','checkmail',8);
                 let apiResponse=response.response(true,'Email parameter is missing',500,null)
                 reject(apiResponse)
             }
        })
    }
    let checkpassword=(userDetails)=>{
        return new Promise((resolve,reject)=>{
            if(req.body.password){
                passwordhashing.comparepassword(req.body.password,userDetails.password,(err,result)=>{
                    if(err){
                        logger.captureError("password is not match",'checkpassword',8);
                        let apiResponse=response.response(true,"password is not match",404,null)
                        reject(apiResponse)
                    }
                    else if(result){
                        let newuserDetails=userDetails.toObject();
                        delete newuserDetails.password;
                        delete newuserDetails.__v;
                        delete newuserDetails._id;
                        resolve(newuserDetails);
                    }
                    else {
                        logger.captureError('Log In Failed.Wrong Password','checkpassword',8);
                        let apiResponse=response.response(true,'Log In Failed.Wrong Password',400,null)
                        reject(apiResponse)
                    }
                })
            }
            else {
                logger.captureError('password parrameter is missing','checkpassword',8);
                let apiResponse=response.response(true,'passeord parrameter is missing',404,null)
                reject(apiResponse)
            }
        })
    } 

    let generatetoken=(newuserDetails)=>{
        return new Promise((resolve,reject)=>{
             token.generateToken(newuserDetails,(err,tokenDetails)=>{
                 if(err){
                    logger.captureError('some error occured','genertae token',8);
                    let apiResponse=response.response(true,'token is not generated',400,null)
                    reject(apiResponse)
                 }
                 else {
                     tokenDetails.userId=newuserDetails.userId;
                     tokenDetails.userDetails=newuserDetails;
                   
                     resolve(tokenDetails);
                 }
             })
        })
    }
    let saveToken=(tokenDetails)=>{
        
        return new Promise((resolve,reject)=>{
            AuthModel.findOne({userId:tokenDetails.userId},(err,retrievedUserSetails)=>{
                if(err){
                    logger.captureError(err.message,'userController:saveToken',10)
                    let apiResponse=response.generate(true,'Failed to Generate Token',500,null)
                    reject(apiResponse)
                }
                else if(check.isEmpty(retrievedUserSetails)) {
                    let newAuthToken=new AuthModel({
                        userId:tokenDetails.userId,
                        authToken:tokenDetails.token,
                        tokenSecret:tokenDetails.tokenSecret,
                        tokenGenerationTime:Date.now()
                    })
                   
                    newAuthToken.save((err,newTokenDetails)=>{
                        if(err){
                            logger.captureError(err.message,'userController:saveToken()',10)
                            let apiResponse=response.generate(true,'Failed To Generate Token',500,null)
                            reject(apiResponse)
                        }
                        else{
                            let responseBody={
                                authToken:newTokenDetails.authToken,
                                userDetails:tokenDetails.userDetails
                            }
                            
                            resolve(responseBody)
                        }
                    })
                }else {
                    retrievedUserSetails.authToken=tokenDetails.token;
                    retrievedUserSetails.tokenSecret=tokenDetails.tokenSecret;
                    retrievedUserSetails.tokenGenerationTime=Date.now();
                    retrievedUserSetails.save((err,newTokenDetails)=>{
                             if(err){
                                 logger.captureError(err.message,'userController:saveToken()',10)
                                 let apiResponse=response.response(true,'Failed To Generate Token',500,null)
                                 reject(apiResponse)
                             }
                             else {
                                   let responseBody={
                                    authToken:newTokenDetails.authToken,
                                    userDetails:tokenDetails.userDetails
                                   }
                                  
                                   resolve(responseBody)
                             }
                    })
                    
                }
            })
        })
    
    }
       
    checkemail(req,res)
    .then(checkpassword)
    .then(generatetoken)
    .then(saveToken)
    .then((resolve)=>{
        
        let apiResponse=response.response(false,'signin successfully',200,resolve);
        res.send(apiResponse)
    })
    .catch((reject)=>{
  
    res.send(reject)
   
    })
}
//sign in function end


//add product code start
let newproduct=(req,res)=>{
    let addproduct=new productModel({
        productId:shortid.generate(),
        userId:req.body.userId,
        productName:req.body.productName,
        prize:req.body.prize,
        category:req.body.category,
        product:req.file.path,
        discription:req.body.discription,
        adminName:req.body.adminName,
        createdOn:Date.now()
    })
    addproduct.save((err,result)=>{
        if(err){
            let apiResponse=res.response(true,'Product Not added',400,null);
            res.send(apiResponse);
        }
        else {
            let apiResponse=response.response(false,'Product Is Added',200,result);
            res.send(apiResponse);
        }
    })
}
//add product code end


//edit product code start
let updateproduct=(req,res)=>{
    console.log(req.file)
    let options=req.body;
    if (req.file) {
         options.product = req.file.path;
    }
    console.log(options)
    productModel.update({productId:req.body.productId},options,{multi:true}).exec((err,result)=>{
        if(err){
            logger.captureError(err.message,'update product',6)
            let apiResponse=response.response(true,'some error occured',500,null)
            res.send(apiResponse)
        }
        else {
            let apiResponse=response.response(false,'product Is Updated Suceessfully',200,result);
            res.send(apiResponse)
        }
    })
}
//edit product code end


//delete product code start
 
let deleteproduct=(req,res)=>{
    productModel.deleteOne({productId:req.body.productId},(err,result)=>{
        if(err){
            logger.captureError(err.message,'deleteleProduct',3)
            let apiResponse=response.response(true,'some error occured',500,null)
            res.send(apiResponse)
        }
        else if(check.isEmpty(result)){
            let apiResponse=response.response(true,'No Product Is Found',403,null)
            res.send(apiResponse)
        }
        else {
            let apiResponse=response.response(false,'Product Is Deleted Suceessfully',200,result);
            res.send(apiResponse)
        }
       })
}

//delet product code end


//get all product code start 
 let getmyproducts=(req,res)=>{
     productModel.find((err,result)=>{
         if(err){
             let apiResponse=response.response(true,'some error occured',404,null);
             res.send(apiResponse);
         }
         else {
             let apiResponse=response.response(false,'Products Are Listed',200,result);
             res.send(apiResponse);
         }
     })
 }
//get all product code end


//get single product code start
let getsingleproduct=(req,res)=>{
    productModel.findOne({productId:req.body.productId},(err,result)=>{
        if(err){
            let apiResponse=response.response(true,'some error occured',404,null);
            res.send(apiResponse);
        }
        else {
            let apiResponse=response.response(false,'Product Is Listed',200,result);
            res.send(apiResponse);
        }
    })
}
//end single product code end

//get toys
let gettoys=(req,res)=>{
    productModel.find({category:req.body.category},(err,result)=>{
        if(err){
            let apiResponse=response.response(true,'some error occured',404,null);
            res.send(apiResponse);
        }
        else {
            let apiResponse=response.response(false,'Product Is Listed',200,result);
            res.send(apiResponse);
        }
    })
}
//end

//get toys
let getdresses=(req,res)=>{
    productModel.find({category:req.body.category},(err,result)=>{
        if(err){
            let apiResponse=response.response(true,'some error occured',404,null);
            res.send(apiResponse);
        }
        else {
            let apiResponse=response.response(false,'Product Is Listed',200,result);
            res.send(apiResponse);
        }
    })
}
//end

//get toys
let getshoes=(req,res)=>{
    productModel.find({category:req.body.category},(err,result)=>{
        if(err){
            let apiResponse=response.response(true,'some error occured',404,null);
            res.send(apiResponse);
        }
        else {
            let apiResponse=response.response(false,'Product Is Listed',200,result);
            res.send(apiResponse);
        }
    })
}
//end

module.exports={
    signup:signup,
    signin:signin,
    newproduct:newproduct,
    updateproduct:updateproduct,
    deleteproduct:deleteproduct,
    getmyproducts:getmyproducts,
    getsingleproduct:getsingleproduct,
    gettoys:gettoys,
    getdresses:getdresses,
    getshoes:getshoes
}