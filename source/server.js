'use strict';

// require modules
const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const https = require('https');
const mysql = require('mysql');
const cookieParser = require('cookie-parser');
const { Model } = require('objection');
var envConfig = require('./configs/env.config.js');
const logger = require('./configs/logger.config');
var adminRoutes = require('./routes/admin.routes.js');
var Knexx = require('./configs/knex.js');
Model.knex(Knexx.knex);

const app = express();

// require middleware functions
app.use(express.static(path.join(__dirname, '../public')));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(function (request, response, next) {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE,PATCH, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "Origin, Authorization, x-access-token, Content-Length, X-Requested-With,Content-Type,Accept");
    response.setHeader("Access-Control-Allow-Credentials", "true");
    next();
});

// checking database connection
app.get('/connect', async (request, response) => {
    var connection = mysql.createConnection({
        host: envConfig.database.host,
        port: envConfig.database.port,
        user: envConfig.database.username,
        password: envConfig.database.password,
        database: envConfig.database.db
    });
    connection.connect((err) => {
        if (err) {
            logger.error('Error while db connection', err);
            response.status(200).json({
                success: false,
                error: true,
                message: 'Error while db connection',
                data: err
            });
        } else {
            logger.info('Database connection success');
            response.status(200).json({
                success: true,
                error: false,
                message: 'Database connection success',
                data: null
            });
        }
    });
});

// Routes
app.use('/api', adminRoutes);

app.listen(envConfig.server.port, () => {
    logger.info(`SRMS server is listening on http://localhost:${envConfig.server.port}`);
});

module.exports = app;