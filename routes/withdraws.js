const express = require('express');
const router = express.Router();
const {param,header,body,validationResult} = require('express-validator');
const {checkAuth} = require('../middlewares/firebase.js');
const withdrawController = require('../controllers/withdrawCotroller.js');

router.post('/',
            //checkAuth,
            withdrawController.doWithdraw
);

module.exports = router;