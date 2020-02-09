const express=require('express');
const app=express();
const http=require('http');
const mongoose=require('mongoose');
const logger=require('./app/lib/loggerLib');
const appConfig=require('./app/Config/appConfig');
const bodyParser=require('body-parser');
const cookieParser=require('cookie-parser');
const globalErrorMiddleWare=require('./app/middleware/appErrorHandler');
const routeLoggerMiddleware=require('./app/middleware/routelogger');
const setRouter=require('./app/route/route');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
app.use(globalErrorMiddleWare.globalErrorHandler)
app.use(routeLoggerMiddleware.logIp)
app.use('/uploads',express.static('uploads'));

setRouter.setRouter(app);

app.use(globalErrorMiddleWare.globalNotFoundHandler)

const server=http.createServer(app);
server.listen(appConfig.port)
server.on('error', onError)
server.on('listening', onListening)
//end server listening code



//error listener for http server 'error' event.
function onError(error){
    if(error.syscall !== 'listen')  {
        logger.captureError(error.code+'not equal Listen','serverOnErrorHandler',10)
        throw error;
    }
    switch(error.code) {
        case 'EACCES':
            logger.captureError(error.code+':elavated privilages required','serverOnErrorHandler',10)
            process.exit(1)
            break;
         case 'EADDRINUSE':
             logger.captureError(error.code,':port is already in use Ashok','serverOnErrorHandler',10)
             process.exit(1)
             break;
         default:
             logger.captureError(error.code+':some unknown error occured','serverOnErrorHandler',10)       
    }
}

//event listener for Http server 'listening' event;
    function onListening(){
        var addr=server.address()
        var bind=typeof addr === 'string'?'pipe'+addr:'port'+appConfig.port;
        ('Listening on'+bind)
        console.log(bind)
       
    }


//mongodb connection
mongoose.connect('mongodb://127.0.0.1:27017/project',{useNewUrlParser:true,useCreateIndex:true})

mongoose.connection.on('error',function(err){
console.log('some error occured')
})

mongoose.connection.on('open',function(err,res){
    if(err){
        console.log('databse error')
    }
    else {
        console.log('connected successfully')
    }
})