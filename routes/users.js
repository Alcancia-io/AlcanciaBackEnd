import express from "express";
import {checkIfAuthenticated} from '../auth.js';
import {userCreate} from '../firestoreClient.js';

const router = express.Router();




//INDEX
router.get('/',(req,res) => {
    res.send('hello');
});

//CREATE
router.post('/',checkIfAuthenticated, async (req, res) =>{
    
    const user = req;
    res=userCreate(user.body,res);
    return res;
});

//PUT/PATCH


//DELETE

export default router;