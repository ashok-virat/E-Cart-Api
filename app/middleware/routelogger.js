const appconfig=require('./../Config/appConfig');

let requestIpLogger=(req,res,next)=>{
    let remoteIp=req.connection.remoteAddress+'://'+req.connection.remotePort;
    let realIp=req.headers['X-REAL-IP'];
    console.log(req.method+'Request Made From'+remoteIp+'for route'+req.originalUrl)

    if (req.method === 'OPTIONS') {
      console.log('!OPTIONS')
      var headers={};

      //IE8 does not allow domains to be specified, just the *
      //headers["Access-control-Allow-Origin"]=req.headers.origin
      headers['Access-Control-Allow-Origin']="*";
      headers['Access-Control-Allow-Methods']="POST,GET,PUT,DELETE,OPTIONS";
      headers['Access-Control-Allow-Credentials']=false;
      headers['Access-Control-Max-Age']='86400' //24 hours
      headers['Access-Control-Allow-Headers']="X-Requested-With, X-HTTP-Method-Override,Content-Type,Accept";
      res.WriteHead(200,headers)
      res.end();  
    }
    else {
      //enable or disable cors here
      res.header('Access-Control-Allow-Origin',appconfig.allowedCorsOrigin)
      res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE,OPTIONS')
      res.header('Access-Control-Allow-Headers',"Origin,X-Requested-With,Content-Type,Accept");
      next()
    }
}



module.exports={
  logIp:requestIpLogger
}