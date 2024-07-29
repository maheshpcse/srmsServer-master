// Add admin authentication & authorization API's
const _ = require('underscore');
const moment = require('moment');
const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const validator = require('express-joi-validation');
const envConfig = require('../configs/env.config.js');
const spConfig = require('../configs/sp.config.js');
const userSP = require('../libraries/usersp.js');
const logger = require('../configs/logger.config');

// Common Send Response object using Async method - (Success/Error)
const sendResponseAsync = async (response, success, error, statusCode, message, data) => {
    return response.status(201).json({
        success: success,
        error: error,
        statusCode: statusCode,
        message: message,
        data: data
    });
}

// Common Send Response object - (Success/Error)
const sendResponse = (response, success, error, statusCode, message, data) => {
    return response.status(201).json({
        success: success,
        error: error,
        statusCode: statusCode,
        message: message,
        data: data
    });
}

// Admin Login - POST Method
const adminLogin = async (request, response, next) => {
    logger.info('In adminLogin(), request body isss', request.body);
    let adminData = {};
    let message = '';
    try {
        const {
            adminname,
            password
        } = request.body;

        await userSP.selectDataSP(spConfig.GET_ADMIN_LOGIN, [adminname], null).then(async resData => {
            // logger.info('Get admin login resData isss', resData);

            if (resData && resData.length) {
                const match = await bcrypt.compare(password, resData[0][0][0].password);
                logger.info('match password isss', match ? match.toString() : '');

                if (match) {
                    adminData = Object.assign({}, resData[0][0][0]);
                    const encryptData = {
                        admin_id: adminData.admin_id,
                        user_id: adminData.user_id,
                        adminname: adminData.adminname,
                        username: adminData.username,
                        email: adminData.email,
                        role: adminData.role
                    }
                    const accessToken = JWT.sign(encryptData, envConfig.database.securitykey, {
                        algorithm: 'HS256',
                        expiresIn: '1h'
                    });
                    const refreshToken = JWT.sign(encryptData, envConfig.database.securitykey, {
                        algorithm: 'HS256',
                        expiresIn: '1h'
                    });
                    adminData['token'] = accessToken;
                    adminData['accessToken'] = accessToken;
                    adminData['refreshToken'] = refreshToken;
                    adminData['issued'] = moment().format('YYYY-MM-DD HH:mm:ss');
                    adminData['expired'] = moment().add(30, 'minutes').format('YYYY-MM-DD HH:mm:ss');
                    /* const minutes = 1440;
                    const expTimeInMS = new Date().getTime() + (minutes * 60 * 1000);
                    var cookieData = cookie.serialize('elmstoken', token);
                    cookieData = cookieData.concat(';Expires=' + new Date(expTimeInMS).toUTCString() + `;HttpOnly;Secure;Path=/`);
                    var prev = response.getHeader('set-cookie') || [];
                    var header = Array.isArray(prev) ? prev.concat(cookieData)
                        : Array.isArray(cookieData) ? [prev].concat(cookieData)
                            : [prev, cookieData];
                    logger.info('final header isss:', header);
                    response.setHeader('set-cookie', header); */
                } else {
                    message = 'Password is invalid';
                    throw new Error(message);
                }
            } else if (resData && resData.length == 0) {
                message = 'Username or Email ID is invalid';
                throw new Error(message);
            } else {
                message = 'Error while generating token';
                throw new Error(message);
            }

        }).catch(errData => {
            message = message || 'Error while finding username or email id';
            throw errData;
        });

        return response.status(200).json({
            success: true,
            error: false,
            statusCode: 200,
            message: 'Admin login successful',
            data: adminData
        });
    } catch (error) {
        logger.error('Error at try catch API result', error);

        return response.status(200).json({
            success: false,
            error: true,
            statusCode: 500,
            message: message || 'Error at try catch API result',
            data: error
        });
    }
}

// Validate Token - POST METHOD
const validateToken = async (request, response, next) => {
    logger.info('In validateAdmin(), request headers isss', request.headers);

    let adminLoginData = {};
    let message = '';

    try {
        let authorizedToken = request.headers['authorization'] || request.headers['x-access-token'];
        logger.info('authorizedToken isss:', authorizedToken);

        if (!authorizedToken || authorizedToken === '') {
            message = message || 'Token is not found';
            throw new Error(message);
        } else {
            authorizedToken = authorizedToken.split(',')[0];
        }

        // logger.info('Final authorizedToken isss', authorizedToken);

        await JWT.verify(authorizedToken, envConfig.database.securitykey, async (err, decoded) => {
            if (err) {
                // logger.error('Error jwt token verification data isss:', err);
                message = err && err.message ? err.message : 'Error while verifying the jwt token';
                throw new Error(message);
            } else {
                logger.info('decoded data isss:', decoded);

                await userSP.selectDataSP(spConfig.GET_ADMIN_LOGIN, [decoded.adminname], null).then(async resData => {
                    // logger.info('Get admin login resData isss', resData);
                    adminLoginData = resData && resData.length ? resData[0][0][0] : {};

                    if (adminLoginData && Object.keys(adminLoginData).length == 0) {
                        message = message || 'Admin Login data is invalid or not found';
                        throw new Error(message);
                    } else if (decoded.adminname == adminLoginData.adminname) {
                        next();
                    } else {
                        message = message || 'Token is invalid';
                        throw new Error(message);
                    }
                }).catch(errData => {
                    message = message || 'Error while getting admin login data';
                    throw errData;
                });
            }
        });
    } catch (error) {
        logger.error('Error at try catch API result', error);

        return response.status(200).json({
            success: false,
            error: true,
            statusCode: 500,
            message: message || 'Error at try catch API result',
            data: error
        });
    }
}

module.exports = {
    adminLogin,
    validateToken
}