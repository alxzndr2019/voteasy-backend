const express = require('express');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const http = require('http');
const app = express();
const dotenv = require("dotenv");
dotenv.config()
const port= process.env.PORT || 8000;
const server = http.createServer(app);

connectDB();
app.get('/', (req,res)=> res.send('Voting app Api is up and running'));



server.listen(port,()=>console.log(`Voting system server running on port ${port}`));
app.use(cookieParser());

app.use(function(req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
  
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  
    // Request headers you wish to allow
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization'
    );
  
    //  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
    // Pass to next layer of middleware
    next();
  });
 app.use(express.json());
 
// app.use(cors({
//     origin:[process.env.ORIGIN],
//     credentials:true,
// }));
app.use("/auth", require("./routes/userRouter"));
app.use("/votesessions", require("./routes/votesessionRouter"));



