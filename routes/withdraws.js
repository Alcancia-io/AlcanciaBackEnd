const express = require('express');
const router = express.Router();
const {param,header,body,validationResult} = require('express-validator');
const {checkAuth} = require('../middlewares/firebase.js');
const withdrawController = require('../controllers/withdrawController.js');

router.post('/',
            header('Authorization').not().isEmpty(),
            body('amount').not().isEmpty(),
            body('country').not().isEmpty(),
            body('account').not().isEmpty(),
            body('bank').not().isEmpty(),
            (req, res, next) => {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                  return res.status(400).json({ errors: errors.array() });
                }
                return next();
            },
            checkAuth,
            withdrawController.doWithdraw
);

module.exports = router;