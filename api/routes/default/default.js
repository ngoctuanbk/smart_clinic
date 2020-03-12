const express = require('express');

const defaultApiRouter = express.Router();

const LoginController = require('../../controllers/LoginController');

defaultApiRouter.route('/signIn').post(LoginController.signIn);

module.exports = defaultApiRouter;
