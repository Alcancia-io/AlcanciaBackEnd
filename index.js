const express = require('express');
const bodyParser  = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const validator = require('express-validator');
const deposits = require('./routes/deposits.js');
const users = require('./routes/users.js');
const login = require('./routes/login.js');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerdoc = require('./docs/api-doc');
dotenv.config();

//app init
const app = express();

swaggerOptions=swaggerdoc;
const swaggerDocs = swaggerJsDoc(swaggerOptions);
//middleware
app.use(cors());
app.use(express.json());
app.use('/api/users',users);
app.use('/api/login',login);
app.use('/api/deposits',deposits);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(process.env.PORT,() => {
    console.log(`Server Running on port: http://localhost:${process.env.PORT}`);
});
