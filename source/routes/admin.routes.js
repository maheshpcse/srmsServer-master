// Add Admin routes
const express = require('express');
const router = express.Router();
const authAdminCtrl = require('../controllers/authadmin.controller.js');
const schoolCtrl = require('../controllers/school.controller.js');

// Server routes
router.get('/', (request, response, next) => {
    return response.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Basic server route works!'
    });
});

// Admin authentication routes
router.post('/admin_login', authAdminCtrl.adminLogin);

// School routes
router.post('/add_or_update_school_info', schoolCtrl.addOrUpdateSchoolInfo);
router.post('/bulk_upload_school_info', schoolCtrl.bulkUploadSchoolInfo);
router.get('/get_school_info_by_id/:school_id', schoolCtrl.getSchoolInfoById);

module.exports = router;