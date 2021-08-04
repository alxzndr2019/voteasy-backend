const router = require('express').Router();
const User = require("../models/userModel")
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const config = require('config');
const key = config.get('SECRET');
const jwtDecode = require('jwt-decode');
const nodemailer=require('nodemailer');

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service : 'Gmail',

    auth: {
      user: 'ohiozeomiunu@gmail.com',
      pass: 'heatbake',
    }
});

var otp = Math.random();
otp = otp * 1000000;
otp = parseInt(otp);
console.log(otp);
router.post('/confirmation',function(req,res){
    const email=req.body.email;
    const contestant = req.body.contestant
      // send mail with defined transport object
     var mailOptions={
         to: email,
        subject: "Vote Confirmation",
        html:"<h3>Thank you for your vote </h3>"  + "<h3>Your vote for </h3>"  + "<h1 style='font-weight:bold;'>" +contestant+"</h1>" + "<h3>has been acknowledged</h3>"// html body
      };
      
      transporter.sendMail(mailOptions, (error, info) => {
         if (error) {
             return console.log(error);
         }
         console.log('Message sent: %s', info.messageId);   
         console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
   
         res.status(200).json({successMessage:"your otp has been sent"});
     });
 });
router.post('/send',function(req,res){
   const email=req.body.email;

     // send mail with defined transport object
    var mailOptions={
        to: email,
       subject: "Otp for registration is: ",
       html: "<h3>OTP for account verification is </h3>"  + "<h1 style='font-weight:bold;'>" + otp +"</h1>" // html body
     };
     
     transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);   
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  
        res.status(200).json({successMessage:"your otp has been sent"});
    });
});
router.post('/resend',function(req,res){
    const email=req.body.email;
    var mailOptions={
        to: email,
       subject: "Otp for registration is: ",
       html: "<h3>OTP for account verification is </h3>"  + "<h1 style='font-weight:bold;'>" + otp +"</h1>" // html body
     };
     transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);   
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        res.status(200).json({successMessage:"your otp has been sent"});
    });

});
router.post('/verify',function(req,res){
    const otpverify = req.body.otpverify;
    if(otpverify==otp){
        res.status(200).json({successMessage:"you have registered successfully"});
    }
    else{
        res.status(400).json({errorMessage:"otp incorrect"});
    }
}); 

router.post("/",async(req,res)=>{

    try{
  const{name,  role,   email,nin, votes, password,passwordVerify, otpverify}=req.body;
  //validation
  if(!email || !password || !passwordVerify   )
  return res
  .status(400)
  .json({errorMessage:"please enter all required shit"});

  if(password.length<6)
  return res
  .status(400)
  .json({errorMessage:"please let the password be greater than 6, biko"});

  if(password !== passwordVerify)
  return res
  .status(400)
  .json({errorMessage:"please enter thesame password twice"});

const existingUser =  await User.findOne({email});
if (existingUser)
return res
.status(400)
.json({errorMessage:"Account with this email already exists"});


//hash password

const salt = await bcrypt.genSalt();
const passwordHash = await bcrypt.hash(password, salt);
//save new user to data base

const newUser = new User({

    name,
    role,
    votes,
    nin,
    email,
    passwordHash,
    otpverify
});
const savedUser = await newUser.save();

//sign the token 

const token = jwt.sign({
    user:savedUser._id,
    email:savedUser.email,
    nin:savedUser.nin,
    name: savedUser.name,
    role: savedUser.role,
    votes: savedUser.votes,
    otpverify: savedUser.otpverify
},
key);
const decoded = jwtDecode(token);
console.log(decoded);


// set the token in a HTTP-ONLY cookie


res.cookie("token", token,{
    httpOnly: true,
})
.send();
    }catch(err){
        console.error(err);
        res.status(500).send();
    }
});

router.post("/login", async(req, res)=>{
    try{
        const{email,password}=req.body;

        //validate
        if(!email || !password)
        return res
        .status(400)
        .json({errorMessage:"please enter all required shit"});

        const existingUser = await User.findOne({email});
        if(!existingUser)
        return res
           .status(401)
           .json({errorMessage:'Wrong email or password.'});

           const passwordCorrect = await bcrypt.compare(password, existingUser.passwordHash);
           if(!passwordCorrect)
           return res
           .status(401)
           .json({errorMessage:'Wrong email or password.'});


       //sign the token 

const token = jwt.sign({
    user:existingUser._id,
    email:existingUser.email,
    nin:existingUser.nin,
    name: existingUser.name,
    role:existingUser.role,
    votes: existingUser.votes,
    otp: existingUser.otp
},
key);

// set the token in a HTTP-ONLY cookie
res.cookie("token", token,{
    httpOnly: true,
})
.send();

    }catch(err){
        console.error(err);
        res.status(500).send();
    }
});

router.get("/logout",(req,res)=>{
    res
    .cookie("token","",{
        httpOnly: true,
        expires: new Date(0),
    })
    res.status(200).json({successMessage:"you have logged out successfully"})

    .send();
})

router.get("/loggedIn",(req,res)=>{
    try{
        const token =req.cookies.token;
   
        
        if(!token)
        return  res.status(401).json(false);
       jwt.verify(token, key);
      
   
     res.send(true);
       }catch(err){
           res.json(false);
       }

});

router.get("/users", async(req,res)=>{
    try{
     const users = await User.find();
     res.json(users);
    }catch(err){
        console.error(err);
        res.status(500).send();
    }
})

router.get('/users/:_id',async(req,res)=>{
    try{
       const user =await User.findById(req.params._id);
       res.json(user);
    }catch(err){
        console.error(err);
        res.status(500).send();
    }
})


router.get("/current",(req,res)=>{
    try{
        const token =req.cookies.token;
        if(!token)
        return  res.status(401).json(false);
       jwt.verify(token, key);

       res.send(token);
        }catch(err){
        res.json(err)
    }
});





module.exports = router;