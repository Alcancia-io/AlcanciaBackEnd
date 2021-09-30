import express from 'express';
import bodyParser from 'body-parser';
import usersRoutes from './routes/users.js';
import dotenv from "dotenv";

dotenv.config();
const app = express();


//middleware

app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(bodyParser.json());
app.use('/users',usersRoutes);

//routes
app.get('/',(req,res) => {
    res.send('Hellow world');
});

app.listen(process.env.PORT,() => {
    console.log(`Server Running on port: http://localhost:${process.env.PORT}`);
});
