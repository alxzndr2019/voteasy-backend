const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config()
const key = process.env.SECRET;
function auth(req, res,next){
    try{
     const token =req.cookies.token;

     
     if(!token)
     return  res.status(401).json({errorMessage: "Unauthorized"});
    const verified= jwt.verify(token, key);
    req.user = verified.user;

    

    next();
    }catch(err){
        console.error(err);
        res.status(401).json({errorMessage: "Unauthorized"});
    }
}

module.exports = auth;