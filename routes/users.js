import { Account, CHAINS } from "@anchor-protocol/anchor-earn";
import express from "express";
import {checkIfAuthenticated} from '../auth.js';
import {userCreate, userDetail} from '../firestoreClient.js';

const router = express.Router();

//CREATE
router.post('/',checkIfAuthenticated, async (req, res) =>{
    
    const user = req;
    const account = new Account(CHAINS.TERRA);
    user.body.accAddress = account.accAddress;
    user.body.publicKey = account.publicKey;
    user.body.privateKey = account.privateKey;
    user.body.mnemonic = account.mnemonic;
    res=userCreate(user.body,res);
    return res;
});

//GET DETAIL

router.get('/',checkIfAuthenticated, async (req, res) =>{
    
    const user = req;
    res=userDetail(user.body,res);
    return res;
});

//PATCH


//DELETE

export default router;