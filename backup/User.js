module.exports.UserModel = require('./model').model({
    name: String,
    email: String,
    graduates: Number,
    projects: {
        type: Array,
        default: [],
        required: false
    },
    invites: {
        type: Array,
        default: [],
        required: false
    },
    admin: {
        type: Boolean,
        default: false,
        required: false
    },
    password: String,
    school: {
        type: String,
        default: 'Unselected',
        required: false
    }
}, 'users');