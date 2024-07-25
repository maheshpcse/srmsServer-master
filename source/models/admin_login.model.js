const { Model } = require('objection');

class Admin_login extends Model {
    static get tableName() {
        return 'admin_login';
    }

    static get idColumn() {
        return 'admin_id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                admin_id: { type: ['integer', null] },
                user_id: { type: ['integer'] },
                adminname: { type: ['string'] },
                password: { type: ['string', 'text'] },
                lastLogin: { type: ['string', null] },
                status: { type: ['integer', 'number'] }, // 0 – Inactive, 1 – Active, 2 – Blocked, default : 1
                created_at: { type: ['datetime'] },
                updated_at: { type: ['timestamp', null] }
            }
        }
    }
}

module.exports = Admin_login;