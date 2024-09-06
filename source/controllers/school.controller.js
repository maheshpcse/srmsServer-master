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

// Common Get error message based on error type
const getErrorMessage = (error) => {
    let message = '';
    if (error && error['sqlMessage']) {
        message = error['sqlMessage'];
    } else if (error && error['errMessage']) {
        message = error['errMessage'];
    }
    return message;
}

// Add or Update School Info - POST Method
const addOrUpdateSchoolInfo = async (request, response, next) => {
    logger.info('In addOrUpdateSchoolInfo(), request body isss', request.body);
    let result = {};
    let message = '';
    try {
        const {
            school_id
        } = request.body;

        await userSP.insertOrUpdateDataSP(spConfig.ADD_OR_UPDATE_SCHOOL_INFO, Object.values(request.body), null).then(async resData => {
            // logger.info('Get add or update school info resData isss', resData);
            result = resData;

        }).catch(errData => {
            message = getErrorMessage(errData) || school_id ? 'Error while updating school info' : 'Error while adding school info';
            throw errData;
        });

        sendResponse(response, true, false, 200, school_id ? 'School info updated successful' : 'New school info added successful', result);
    } catch (error) {
        logger.error('Error at try catch API result', error);
        
        sendResponse(response, false, true, 500, message || 'Error at try catch API result', error);
    }
}

// Bulk upload School Info - POST Method
const bulkUploadSchoolInfo = async (request, response, next) => {
    logger.info('In bulkUploadSchoolInfo(), request body isss', request.body);
    let result = {};
    let schoolInfo = [];
    let message = '';
    try {
        // STEP - 0:
        // --> Need to validate the duplicate school names found in request.body
        // --> Need to validate the duplicate school emails found in request.body
        // --> Need to validate the duplicate school phone numbers found in request.body

        // STEP - 1:
        let schoolNames = Object.keys(_.groupBy(request.body, 'schoolname')) || [];

        let rawQuery = `SELECT school_id,schoolname FROM school_info WHERE schoolname IN('${schoolNames.join("','")}') ORDER BY school_id ASC;`;

        logger.info('rawQuery isss:', rawQuery);

        await userSP.selectDataQuery(rawQuery).then(async resData => {
            logger.info('Get rawQuery resData isss', resData);
            result = resData;

            /* await userSP.insertOrUpdateDataSP(spConfig.BULK_UPLOAD_SCHOOL_INFO, Object.values(request.body), null).then(async resData => {
                // logger.info('Get bulk upload school info resData isss', resData);
                result = resData;

            }).catch(errData => {
                message = getErrorMessage(errData) || 'Error while saving bulk upload school info';
                throw errData;
            }); */

        }).catch(errData => {
            message = getErrorMessage(errData) || 'Error while fetching data';
            throw errData;
        });

        sendResponse(response, true, false, 200, 'School info saved successful', result);
    } catch (error) {
        logger.error('Error at try catch API result', error);
        
        sendResponse(response, false, true, 500, message || 'Error at try catch API result', error);
    }
}

// Get School Info By Id - GET Method
const getSchoolInfoById = async (request, response, next) => {
    logger.info('In getSchoolInfoById(), request params isss', request.params);
    let result = {};
    let message = '';
    try {
        const {
            school_id
        } = request.params;

        await userSP.selectDataSP(spConfig.GET_SCHOOL_INFO_BY_ID, [school_id], null).then(async resData => {
            // logger.info('Get school info by id resData isss', resData);
            result = resData && resData.length ? Object.assign({}, resData[0][0][0]) : {};

        }).catch(errData => {
            message = getErrorMessage(errData) || 'Error while fetching school info by id';
            throw errData;
        });

        sendResponse(response, true, false, 200, 'Get school info by id successful', result);
    } catch (error) {
        logger.error('Error at try catch API result', error);
        
        sendResponse(response, false, true, 500, message || 'Error at try catch API result', error);
    }
}

module.exports = {
    addOrUpdateSchoolInfo,
    bulkUploadSchoolInfo,
    getSchoolInfoById
}