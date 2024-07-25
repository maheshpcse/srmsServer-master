const { Model } = require('objection');

class User_info extends Model {
    static get tableName() {
        return 'user_info';
    }

    static get idColumn() {
        return 'user_id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                user_id: { type: ['integer', null] },
                fullname: { type: ['string'] },
                username: { type: ['string'] },
                email: { type: ['string'] },
                mobile: { type: ['string', null] },
                address: { type: ['string', 'text', null] },
                city: { type: ['string', null] },
                state: { type: ['string', null] },
                designation: { type: ['string', null] },
                department: { type: ['string', null] },
                role: { type: ['string'] },              // admin, employee, student, default : student
                status: { type: ['integer', 'number'] }, // 0 – Inactive, 1 – Active, 2 – Blocked, default : 1
                created_at: { type: ['datetime'] },
                updated_at: { type: ['timestamp', null] }
            }
        }
    }
}

module.exports = User_info;