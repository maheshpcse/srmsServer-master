require('dotenv').config();
const Promise = require('bluebird');
const { objection } = require('objection');
const Knexx = require('../configs/knex.js');
// const dbConfig = require('../configs/db.config.js');
const logger = require('../configs/logger.config.js');

// SELECT/READ data Query
const selectDataQuery = function (rawQuery) {
    return new Promise((resolve, reject) => {
        logger.info(`${rawQuery}`);
        let mod = Knexx.knex.transaction(trx => {
            return Knexx.knex.raw(rawQuery);
        });
        mod.then(result => {
            // console.log('selectDataQuery result isss:', result);
            // console.log('selectDataQuery result[0] isss:', result[0]);
            if (result && result.length && result[0].length) {
                if (result[0].length > 0) {
                    resolve(result[0]);
                } else {
                    resolve(result[0]);
                }
            } else {
                resolve([]);
            }
        }).catch(error => {
            reject(error);
        });

        // with mysql connection
        // dbConfig.connection.query(finalSP, inputParams, (error, results, fields) => {
        //     if (error) {
        //         reject(error);
        //     }
        //     results = results && results.length && results[0] ? results[0] : [];
        //     resolve(results);
        // });
    });
}

// SELECT/READ data Stored Procedure
const selectDataSP = function (spName, inputParams, outputParams) {
    return new Promise((resolve, reject) => {
        let finalSP = `CALL ${spName}(${generateInputs(inputParams.length)})`;
        logger.info(`CALL ${spName}(${inputParams.join('","')})`);
        let mod = Knexx.knex.transaction(trx => {
            return Knexx.knex.raw(finalSP, inputParams);
        });
        mod.then(result => {
            if (result && result.length && result[0].length && result[0][0].length) {
                if (result[0][0].length > 0) {
                    resolve(result);
                } else {
                    resolve(result[0][0]);
                }
            } else {
                resolve([]);
            }
        }).catch(error => {
            reject(error);
        });

        // with mysql connection
        // dbConfig.connection.query(finalSP, inputParams, (error, results, fields) => {
        //     if (error) {
        //         reject(error);
        //     }
        //     results = results && results.length && results[0] ? results[0] : [];
        //     resolve(results);
        // });
    });
}

// INSERT/UPDATE data Stored Procedure
const insertOrUpdateDataSP = function (spName, inputParams, outputParams) {
    return new Promise((resolve, reject) => {
        let finalSP = `CALL ${spName}(${generateInputs(inputParams.length)})`;
        logger.info(`CALL ${spName}(${inputParams.join('","')})`);
        let mod = Knexx.knex.transaction(trx => {
            Knexx.knex.commit;
            return Knexx.knex.raw(finalSP, inputParams);
        });
        mod.then(result => {
            mod.commit;
            result = result && result.length && result[0].length ? result[0][0] : [];
            resolve(result);
        }).catch(error => {
            mod.rollback;
            reject(error);
        });

        // with mysql connection
        // dbConfig.connection.query(finalSP, inputParams, (error, results, fields) => {
        //     if (error) {
        //         reject(error);
        //     }
        //     results = results && results.length && results[0] ? results[0] : [];
        //     resolve(results);
        // });
    });
}

// generate Inputs
function generateInputs(num) {
    let array = [];
    for (let i = 0; i < num; i++) {
        array.push('?');
    }
    return array.join();
}

module.exports = {
    selectDataQuery,
    selectDataSP,
    insertOrUpdateDataSP
}