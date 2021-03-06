const express=require('express');
const app=express();
const morgan=require('morgan');
const bodyParser=require('body-parser');
const mongoose=require("mongoose");

//Routes
const productRoutes=require('./api/routes/products');
const orderRoutes=require("./api/routes/orders");
const userRoutes=require("./api/routes/user");

//Database connection
mongoose.connect("mongodb://127.0.0.1:2717/shop",{
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(()=>{
    console.log("Successfully connected to db");
})
.catch(err=>{
    console.log(err);
});
app.use(morgan('dev'));
app.use("/uploads",express.static('uploads')); //To parse the requests at the uploads folder and make it publically available
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method=='OPTIONS')
    {
        res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});
//Configuring the routes to the app
app.use("/products",productRoutes);
app.use("/orders",orderRoutes);
app.use("/user",userRoutes);
app.use((req,res,next)=>{
    const error=new Error('Not Found');
    error.status=400;
    next(error);
});
app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    });
});
module.exports=app;