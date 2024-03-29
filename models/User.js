const mongoose = require('mongoose')
const conn = mongoose.createConnection(process.env.MONGO_URI, {useNewUrlParser: true});

const UserSchema = mongoose.Schema({
    name: String,
    email: String,
    graduates: Number,
    projects: {
        type: Array,
        default: []
    },
    invites: {
        type: Array,
        default: []
    },
    admin: {
        type: Boolean,
        default: false
    },
    password: String,
    school: {
        type: String,
        default: 'Unselected',
        required: false
    }
});

const UserModel = conn.model('user', UserSchema, 'users')

module.exports = {UserSchema, UserModel}