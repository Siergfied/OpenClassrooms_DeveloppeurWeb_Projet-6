const express = require('express');
const router = express.Router();

const userController = require('../controllers/user_controller');

const passwordVerification = require('../middleware/passwordVerification');

//POST /api/auth/signup
router.post('/api/auth/signup', passwordVerification, userController.signup);
//POST /api/auth/login
router.post('/api/auth/login', userController.login);

module.exports = router;