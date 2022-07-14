const express = require('express');
const { 
    register, login, 
    logout, currentUser, 
    forgotPassword, resetPassword
} = require('../controllers/auth');
const { requireSignIn } = require('../middlewares');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/current-user', requireSignIn, currentUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;