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
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin:[process.env.ORIGIN],
    credentials:true,
}));
app.use("/auth", require("./routes/userRouter"));
app.use("/votesessions", require("./routes/votesessionRouter"));



