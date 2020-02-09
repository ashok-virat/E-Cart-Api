
const mongoose = require('mongoose'),
Schema = mongoose.Schema;

let userSchema = new Schema({
userId:{
    type:String,
    required:true
},
productName:{
    type:String,
    default:''
},
adminName:{
    type:String,
    default:''
},
product:{
    type:String
},
productId:{
    type:String,
    unique:true
},
discription:{
    type:String,
    default:''
},
prize:{
    type:String,
    default:''
},
category:{
    type:String,
    default:''
},
createdOn:{
    type:Date,
    default:Date.now()
}

})


mongoose.model('productModel', userSchema);