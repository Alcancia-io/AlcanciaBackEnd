const express = require('express');
const { param, header, validationResult } = require('express-validator');
const router = express.Router();
const { checkAuth } = require('../middlewares/firebase')
const userController = require('../controllers/userCotroller.js');

router.get(
    '/:uid',
    header('Authorization').not().isEmpty(),
    param('uid').not().isEmpty(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        return next();
    },
    checkAuth,
    userController.getUser
);
    
router.get(
    '/:uid/deposits',
    header('Authorization').not().isEmpty(),
    param('uid').not().isEmpty(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        return next();
    },
    checkAuth,
    userController.getUserDeposits
);

module.exports = router;