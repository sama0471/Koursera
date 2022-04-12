const express = require('express');
const authController = require('../controllers/authController');
const autho = require('../middleware/auth');

const router = express.Router();

router.post('/register', authController.register);  
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.get('/me', autho.protect, authController.getMe);
router.post('/forgotpassword', authController.forgotPassword); 
router.put('/forgotpassword/:resettoken', authController.resetPassword);
router.put('/updatedetails', autho.protect, authController.updateDetails);
router.put('/updatepassword', autho.protect, authController.updatePassword);

module.exports = router;