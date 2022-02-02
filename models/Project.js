const mongoose = require('mongoose')
const conn = mongoose.createConnection(process.env.MONGO_URI);

const ProjectSchema = mongoose.Schema({
    name: String,
    email: String,
    graduates: Number,
    roles: {
        type: Array,
        default: [{
            name: 'Manager',
            permissions: {}
        }, {
            name: 'Member',
            permissions: {}
        }]
    },
    members: {
        type: Array,
        default: []
    },
    invites: {
        type: Array,
        default: []
    }
})
const ProjectModel = conn.model('project', ProjectSchema, 'projects')

module.exports = {ProjectSchema, ProjectModel}