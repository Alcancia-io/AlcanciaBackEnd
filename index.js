const express = require('express');
const bodyParser  = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const validator = require('express-validator');
const deposits = require('./routes/deposits.js');
dotenv.config();

//app init
const app = express();

//middleware
app.use(cors());
app.use(express.json());
//app.use('/users',users);
app.use('/deposits',deposits);

app.listen(process.env.PORT,() => {
    console.log(`Server Running on port: http://localhost:${process.env.PORT}`);
});
