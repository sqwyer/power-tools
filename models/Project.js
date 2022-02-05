const mongoose = require('mongoose')
const conn = mongoose.createConnection(process.env.MONGO_URI);

const ProjectSchema = mongoose.Schema({
    name: String,
    description: String,
    problem: String,
    solution: String,
    roles: {
        type: Array,
        default: [{
            name: 'Manager',
            permissions: ['admin']
        }, {
            name: 'Member',
            permissions: ['tasks', 'general']
        }]
    },
    members: {
        type: Array,
        default: []
    },
    invites: {
        type: Array,
        default: []
    },
    state: {
        type: Number,
        default: 0
    }
})
const ProjectModel = conn.model('project', ProjectSchema, 'projects')

module.exports = {ProjectSchema, ProjectModel}