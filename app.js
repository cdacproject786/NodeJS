require('dotenv').config() //npm i dotenv
const express = require('express');
const app = express();
const userRouter = require('./Routes/patient.router')
const fileUpload = require('express-fileupload') //npm i express-fileupload


//middlewares
app.use(fileUpload({
    useTempFiles:true
}))
app.use(express.json())
app.use('/',userRouter)

app.listen(process.env.APP_PORT, () =>{
    console.log("Server is running on port : ", process.env.APP_PORT)
})