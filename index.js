import express from 'express';
import bodyParser from 'body-parser';
import usersRoutes from './routes/users.js';
import dotenv from "dotenv";
import cors from 'cors';
import {createOrder,executeOrder} from './paypalClient.js';

dotenv.config();
const app = express();


//middleware
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(bodyParser.json());
app.use('/users',usersRoutes);

//routes
app.get('/',(req,res) => {
    res.send('Hellow world');
});

app.get('/create-order',async (req,res) =>{
    
    var result=await createOrder();
    res.send(result);
});

app.get('/execute-order',async (req,res)=>{
    console.log(req.query);
    //recive token and PayerID and execute the order
    var result=await executeOrder(req.query.token,req.query.PayerID);
    //insert transaction into firestore
    res.send('order exectued');
});

app.get('/cancel-order',(req,res)=>{
    res.send('cacelled');
});

app.listen(process.env.PORT,() => {
    console.log(`Server Running on port: http://localhost:${process.env.PORT}`);
});
