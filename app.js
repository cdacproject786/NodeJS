require('dotenv').config() //npm i dotenv
const express = require('express');
const app = express();
const userRouter = require('./Routes/patient.router')
const fileUpload = require('express-fileupload') //npm i express-fileupload
const cors = require('cors')
const bodyparser = require('body-parser')
const cookie = require('cookie-parser')

//middlewares
app.use(fileUpload({
    useTempFiles:true
}))
app.use(express.json({limit: '25mb'}));
app.use(express.urlencoded({limit: '25mb'}));
/* app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:false}))
 */
//app.use(cors())
app.use(function(req,res,next){
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers','Content-Type,authorization');
    res.setHeader('Access-Control-Allow-Credentials',true);
    next();
})
app.use("/",userRouter)


app.listen(process.env.APP_PORT, () =>{
    console.log("Server is running on port : ", process.env.APP_PORT)
})