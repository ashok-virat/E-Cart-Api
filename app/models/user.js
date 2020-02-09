
const mongoose = require('mongoose'),
Schema = mongoose.Schema;

let userSchema = new Schema({
userId: {
  type: String,
  default: '',
  index: true,
  unique: true
},
firstName: {
  type: String,
  required:true
},
lastName: {
  type: String,
  default: ''
},
password: {
  type: String,
  required:true
},
email: {
  type: String,
  required:true
}
})


mongoose.model('UserModel', userSchema);