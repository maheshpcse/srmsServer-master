// Add user API's
const _ = require('underscore');
const moment = require('moment');
const JWT = require('jsonwebtoken');
const Joi = require('joi');
const validator = require('express-joi-validation');
const config = require('../configs/env.config.js');
const UserInfo = require('../models/user_info.model.js');
const AdminLogin = require('../models/admin_login.model.js');

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
    console.log('In adminLogin(), request body isss', request.body);
    let adminData = {};
    let message = '';
    try {
        const {
            nameOrEmail,
            password
        } = request.body;

        await Admins.query(request.knex)
            .select('a.*')
            .alias('a')
            .whereRaw(`a.displayName = '${nameOrEmail}' OR a.email = '${nameOrEmail}'`)
            .then(async result => {
                console.log('Get admin login result isss', result);

                if (result && result.length) {
                    const match = await bcrypt.compare(password, result[0].password);
                    console.log('match password isss', match);

                    if (match) {
                        adminData = Object.assign({}, result[0]);
                        const token = JWT.sign({
                            adminId: adminData.adminId,
                            displayName: adminData.displayName,
                            email: adminData.email
                        }, config.database.securitykey, {
                            algorithm: 'HS256',
                            expiresIn: '1hr'
                        });
                        adminData['token'] = token;
                        adminData['refreshToken'] = token;
                        const minutes = 1440;
                        const expTimeInMS = new Date().getTime() + (minutes * 60 * 1000);
                        var cookieData = cookie.serialize('elmstoken', token);
                        cookieData = cookieData.concat(';Expires=' + new Date(expTimeInMS).toUTCString() + `;HttpOnly;Secure;Path=/`);
                        var prev = response.getHeader('set-cookie') || [];
                        var header = Array.isArray(prev) ? prev.concat(cookieData)
                            : Array.isArray(cookieData) ? [prev].concat(cookieData)
                                : [prev, cookieData];
                        console.log('final header isss:', header);
                        response.setHeader('set-cookie', header);
                    } else {
                        message = 'Password is invalid';
                        throw new Error(message);
                    }
                } else if (result && result.length == 0) {
                    message = 'Username or Email ID is invalid'
                    throw new Error(message);
                } else {
                    message = 'Error while generating token'
                    throw new Error(message);
                }

            }).catch(getErr => {
                message = message || 'Error while finding username or email id';
                throw getErr;
            });

        return response.status(200).json({
            success: true,
            error: false,
            statusCode: 200,
            message: 'Admin login successful',
            data: adminData
        });
    } catch (error) {
        console.log('Error at try catch API result', error);
        return response.status(200).json({
            success: false,
            error: true,
            statusCode: 500,
            message: message || 'Error at try catch API result',
            data: []
        });
    }
}

module.exports = {
    adminLogin
}