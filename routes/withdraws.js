const express = require('express');
const router = express.Router();
const {param,header,body,validationResult} = require('express-validator');
const {checkAuth} = require('../middlewares/firebase.js');

router.post('/',
            checkAuth,
            withdrawController.doWithdraw
);

module.exports = router;