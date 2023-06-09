const { config } = require('dotenv');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');
const jwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');


app.use(cors());
app.options('*',cors());

//middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(jwt({
    secret: process.env.secret,
    algorithms: ['HS256'],
    
}).unless({
    path:[
        {url: /\/public\/uploads(.*)/, methods: ['GET','OPTIONS'] },
        {url: /\/api\/v1\/products(.*)/, methods: ['GET','OPTIONS'] },
        {url: /\/api\/v1\/categories(.*)/, methods: ['GET','OPTIONS'] },
        '/api/v1/users/login',
        '/api/v1/users/register'
    ]
}));

app.use(errorHandler);
app.use('/public/uploads',express.static(__dirname + '/public/uploads'));


//Routes
const productsRoutes = require('./routes/products');
const categoriesRoutes =require('./routes/categories');
const usersRoutes = require('./routes/users');
const ordersRoutes =require('./routes/orders');




const api = process.env.API_URL;

//Routers
app.use(`${api}/products`,productsRoutes);
app.use(`${api}/categories`,categoriesRoutes);
app.use(`${api}/users`,usersRoutes);
app.use(`${api}/orders`,ordersRoutes);


//Database
mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology:true ,
    dbName: 'eshop-database2'
})
.then(()=>{
    console.log('Database connection is ready');
})
.catch((err)=>{
    console.log(err);
})

//Server
app.listen(3000,()=>{
   
    console.log('App is listening to port 3000');
})