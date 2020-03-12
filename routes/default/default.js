const express = require('express');

const router = express.Router();
const LoginController = require('../../controllers/LoginController');

router.route('/').get(LoginController.index);
router.route('/login').post(LoginController.login);
router.route('/logout').get(LoginController.logout);
router.route('/getSession').get(LoginController.getSession);

module.exports = router;
