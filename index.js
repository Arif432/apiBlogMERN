const express = require('express');
const app = express()
const cors = require('cors');
const mongoose = require('mongoose')
const User = require('./models/User')
const bcrypt = require('bcryptjs')
const jwt =  require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const salt = bcrypt.genSaltSync(10)
const secret = "sads3242sadad23423"

app.use(cors({credentials:true , origin:"http://localhost:3000"}));
app.use(express.json());
app.use(cookieParser());



mongoose.connect("mongodb+srv://nawazarif901:qBDJ3qVHwh5MpMhI@blogwebapp.hzjgpml.mongodb.net/?retryWrites=true&w=majority")

app.post('/register', async (req,res) => {
  console.log("request contains" ,req)
// received from frontend
    const {username,password} = req.body;
    // res.json({requestedData:{username,password}})
    
    // new user object with props specified created in db
    try {
      const userDoc = await User.create(
        {
          username,
          password:bcrypt.hashSync(password,salt)
        })
      res.json(userDoc)
      
    } catch (error) {
      res.status(400).json(error)
    }
  });

app.post('/login',async (req,res)=>{
  const {username,password} = req.body

  // find the user whose name equlled to user in findOne
  const userDoc = await User.findOne({username})
  const passOk = bcrypt.compareSync(password,userDoc.password)

  if (passOk) {
    //auth relevent payload,secret for server only ,options empty
    jwt.sign({username,id:userDoc._id} , secret,{} ,(err,token) =>{
      if (err) {
        alert("unpossible")
      }else{
        // res.json(token)
        // response contains cokie named token
       //cok set here
      //  snippet sets the value of the cookie in the response sent from the server to the client. The client's web browser will receive and store this cookie.
        res.cookie('token',token).json("saved")
      }
    })
  } 
  else {
    res.status(400).json("wrong ")    
  }
})

app.get('/profile',(req,res)=>{
  // getting that cookie token
  // cok revieved here
  const {token} = req.cookies

  jwt.verify(token,secret,{},(err,info)=>{
    if (err) throw err

    else {
      console.log("information",info)
      res.json(info)
    }
  })
})

app.post('/logout',(req,res)=>{
  res.cookie("token",'').json('logged out')
})

  app.listen(5000)