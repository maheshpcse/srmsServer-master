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
                fullname: { type: ['string', null] },
                fullname: { type: ['string', null] },
                fullname: { type: ['string', null] },
                fullname: { type: ['string', null] },
                password: { type: ['string', 'text', null] },
                status: { type: ['integer', 'number', null] },      // 0-Inactive, 1-Active, 2-Blocked. Default: 1-Active
                lastLogin: { type: ['string', null] },
                created_at: { type: 'datetime' },
                updated_at: { type: 'timestamp' }
            }
        }
    }
}

module.exports = User_info;