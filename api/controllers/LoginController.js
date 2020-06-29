const util = require('util');
const jwt = require('jsonwebtoken');
const moment = require('moment-timezone');
const UsersService = require('../services/UsersService');
const configJwt = require('../configs/jsonwebtoken');
const {signInValidator} = require('../validators/LoginValidator');
const messages = require('../constants/messages');

moment().tz('Asia/Ho_Chi_Minh').format();
const {
    isEmpty,
    responseError,
    resJsonError,
} = require('../libs/shared');

module.exports = {
    index: async (req, res) => {
        res.json({Success: true, Message: 'Connect success!'});
    },
    signIn: async (req, res) => {
        try {
            req.checkBody(signInValidator);
            const errors = req.validationErrors();
            if (errors) {
                responseError();
                return res.json(
                    {
                        Success: false,
                        StatusCode: 40008,
                        Message: messages.CODES_ERROR[40008],
                        Errors: errors,
                    },
                );
            }
            const params = {};
            params.UserName = req.body.UserName ? req.body.UserName : '';
            params.Password = req.body.Password ? req.body.Password : '';
            const resUser = await UsersService.findOneUserName(params);
            if (!resUser) {
                return res.json({
                    Success: false,
                    StatusCode: 40010,
                    Message: messages.CODES_ERROR[40010],
                });
            }
            const { Info, RoleCode, RoleName} = resUser.RoleObjectId;
            /* create token */
            const token = jwt.sign({
                UserObjectId: resUser._id,
                RoleCode,
                RoleName,
                RoleObjectId: resUser.RoleObjectId._id,
                UserCode: resUser.UserCode,
            },
            configJwt.secret, {
                expiresIn: configJwt.expires,
            });
            const response = {};
            response.UserObjectId = resUser._id;
            response.UserCode = resUser.UserCode;
            response.Info = resUser.Info;
            response.Status = resUser.Status;
            response.UserName = resUser.UserName;
            response.Email = resUser.Email;
            response.Mobile = resUser.Mobile;
            response.Avatar = resUser.Avatar;
            response.JoinDate = resUser.JoinDate;
            response.RoleObjectId = resUser.RoleObjectId._id;
            response.RoleCode = resUser.RoleObjectId.RoleCode;
            response.RoleName = resUser.RoleObjectId.RoleName;
           
            /* save ExpiresDate */
            const decoded = jwt.verify(token, configJwt.secret);
            const expiresDate = moment(decoded.exp * 1000).format('YYYY-MM-DD HH:mm:ss');
            const paramsLogin = {};
            paramsLogin.UserObjectId = resUser._id;
            paramsLogin.ExpiresDate = expiresDate;
            await UsersService.updateExpiresDate(paramsLogin);
            /* end save ExpiresDate */
            return res.json({
                Success: true,
                Token: token,
                StatusCode: 10000,
                Message: messages.CODES_SUCCESS[10000],
                Data: response,
            });
        } catch (errors) {
            return resJsonError(res, errors, 'login');
        }
    },
};
