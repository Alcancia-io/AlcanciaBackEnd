const express = require('express');
const bodyParser  = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const validator = require('express-validator');
const deposits = require('./routes/deposits.js');
const users = require('./routes/users.js');
const login = require('./routes/login.js');
const withdraws = require('./routes/withdraws.js');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerdoc = require('./docs/api-doc');

//const csrfMiddleware = csrf({ cookie: true });
dotenv.config();

//app init
const app = express();

swaggerOptions=swaggerdoc;
const swaggerDocs = swaggerJsDoc(swaggerOptions);
//middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
//app.use(cookieParser());
//app.use(csrfMiddleware);
app.use('/api/users',users);
//app.use('/api/login',login);
app.use('/api/deposits',deposits);
app.use('/api/withdraws',withdraws);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/*
app.all("*", (req, res, next) => {
    req.csrfToken=csrfToken();
    res.cookie("XSRF-TOKEN", req.csrfToken);
    next();
});
*/

app.listen(process.env.PORT,() => {
    console.log(`Server Running on port: http://localhost:${process.env.PORT}`);
});
