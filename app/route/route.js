const appConfig=require('./../Config/appConfig');
const controller=require('./../controller/usercontroller');
const multer = require('multer');
const authorization=require('./../middleware/auth');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
})
const fileFilter=(req,file,cb)=>{
    if(file.mimetype=='image/png' || file.mimetype=='image/jpeg' || file.mimetype=='image/jpg'){
        cb(null,true)
    }
    else {
        cb(null,false)
    }
 }

const upload = multer({
    storage: storage,
    fileFilter:fileFilter
})



let setRouter=(app)=>{

    let baseUrl=`${appConfig.apiVersion}/users`;

    app.post(`${baseUrl}/signup`,controller.signup);
    app.post(`${baseUrl}/signin`,controller.signin);
    app.post(`${baseUrl}/addproduct/:authToken`,authorization.isAuthorized,upload.single('product'),controller.newproduct);
    app.post(`${baseUrl}/updateproduct/:authToken`,authorization.isAuthorized,upload.single('product'),controller.updateproduct);
    app.post(`${baseUrl}/deleteproduct/:authToken`,authorization.isAuthorized,controller.deleteproduct);
    app.get(`${baseUrl}/getallproducts/:authToken`,authorization.isAuthorized,controller.getmyproducts);
    app.post(`${baseUrl}/getsingleproduct/:authToken`,authorization.isAuthorized,controller.getsingleproduct);
    app.post(`${baseUrl}/gettoys`,controller.gettoys);
    app.post(`${baseUrl}/getshoes`,controller.getshoes);
    app.post(`${baseUrl}/getdress`,controller.getdresses);
}

module.exports={
    setRouter:setRouter
}