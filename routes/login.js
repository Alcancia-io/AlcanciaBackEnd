const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
//const admin = require('../middlewares/firebase.js');

router.post('/',async (req,res) =>{
    //let user = await admin.auth().signInWithEmailAndPassword('A01209400@itesm.mx','Royito01$_');
    /*
    await admin.auth().createCustomToken('MMHoNsa1JxhB4hWN2sHGRb4ir4m2').then((customToken) => {
        res.status(200).send(customToken);
    })
    .catch((error) => {
        res.status(500);
    })*/
    //res.send(user.data);  
});

module.exports = router;