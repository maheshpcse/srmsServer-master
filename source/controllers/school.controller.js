// Add school API's
const _ = require('underscore');
const moment = require('moment');
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

// Add or Update School Info - POST Method
const addOrUpdateSchoolInfo = async (request, response, next) => {
    logger.info('In adminLogin(), request body isss', request.body);
    let result = {};
    let message = '';
    try {
        const {
            school_id
        } = request.body;

        await userSP.insertOrUpdateDataSP(spConfig.ADD_OR_UPDATE_SCHOOL_INFO, Object.values(request.body), null).then(async resData => {
            // logger.info('Get add or update school info resData isss', resData);
            result = resData;

        }).catch(error => {
            message = message || school_id ? 'Error while updating school info' : 'Error while adding school info';
            throw error;
        });

        return response.status(200).json({
            success: true,
            error: false,
            statusCode: 200,
            message: school_id ? 'School info updated successful' : 'New school info added successful',
            data: result
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
    addOrUpdateSchoolInfo
}