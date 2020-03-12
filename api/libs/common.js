/**
Mr : Dang Xuan Truong
Email: truongdx@runsystem.net
*/
const util = require('util');
const jwt = require('jsonwebtoken');
const moment = require('moment-timezone');
const configJwt = require('../configs/jsonwebtoken');

moment().tz('Asia/Ho_Chi_Minh').format();

const messages = require('../constants/messages');
const {
    isEmpty, capitalizeFirstLetter, isArray,
} = require('../libs/shared');

const UsersService = require('../services/UsersService');

module.exports = {
    verifyToken: async (req, res, next) => {
        try {
            const token = req.headers['x-access-token'] || req.body.Token || req.query.Token;
            if (!token) {
                return res.json({
                    Success: false,
                    StatusCode: 40009,
                    Message: messages.CODES_ERROR[40009],
                });
            }
            jwt.verify(token, configJwt.secret, async (err, decoded) => {
                if (err) {
                    return res.json({
                        Success: false,
                        StatusCode: 40009,
                        Message: messages.CODES_ERROR[40009],
                    });
                }

                const format = 'YYYY-MM-DD HH:mm:ss';
                req.decoded = decoded;
                const expiresDate = moment(decoded.exp * 1000).format(format);
                const paramsUser = {};
                paramsUser.UserObjectId = decoded.UserObjectId;
                const userInfo = await UsersService.getExpiresDate(paramsUser);
                if (isEmpty(userInfo)) {
                    return res.json({
                        Success: false,
                        Status: 40012,
                        Message: messages.CODES_ERROR[40012],
                    });
                }
                const beforeTime = moment(expiresDate, format);
                const afterTime = moment(userInfo.ExpiresDate
                    ? userInfo.ExpiresDate : moment().format(format), format);
                if (beforeTime.isSame(afterTime)) {
                    req.decoded.UserName = userInfo.UserName;
                    return next();
                }
                return res.json({
                    Success: false,
                    StatusCode: 40013,
                    Message: messages.CODES_ERROR[40013],
                });
            });
        } catch (err) {
            if (err.name === 'JsonWebTokenError') {
                return res.json({
                    Success: false,
                    StatusCode: 40009,
                    Message: messages.CODES_ERROR[40009],
                });
            }
            return res.json({
                Success: false,
                Status: 100001,
                Message: messages.CODES_ERROR[100001],
                Errors: err,
            });
        }
    },
};
