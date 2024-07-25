const { Model } = require('objection');

class Employee_login extends Model {
    static get tableName() {
        return 'employee_login';
    }

    static get idColumn() {
        return 'employee_id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                employee_id: { type: ['integer', null] },
                user_id: { type: ['integer'] },
                employeename: { type: ['string'] },
                password: { type: ['string', 'text'] },
                lastLogin: { type: ['string', null] },
                status: { type: ['integer', 'number'] }, // 0 – Inactive, 1 – Active, 2 – Blocked, default : 1
                created_at: { type: ['datetime'] },
                updated_at: { type: ['timestamp', null] }
            }
        }
    }
}

module.exports = Employee_login;