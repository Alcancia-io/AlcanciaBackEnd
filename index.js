import express from 'express';
import bodyParser from 'body-parser';
import usersRoutes from './routes/users.js';

const app = express();
const PORT = 8000;

//middleware
app.use(bodyParser.json());
app.use('/users',usersRoutes);

//routes
app.get('/',(req,res) => {
    res.send('Hellow world');
});

app.listen(PORT,() => {
    console.log(`Server Running on port: http://localhost:${PORT}`);
});
