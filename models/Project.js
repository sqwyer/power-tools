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
    },
    tasks: {
        type: Array,
        default: [
            {
                name: 'To-dos',
                id: new mongoose.Types.ObjectId(),
                tasks: []
            },
            {
                name: 'In Progress',
                id: new mongoose.Types.ObjectId(),
                tasks: []
            },
            {
                name: 'Completed',
                id: new mongoose.Types.ObjectId(),
                tasks: []
            }
        ]
    }
})
const ProjectModel = conn.model('project', ProjectSchema, 'projects')

module.exports = {ProjectSchema, ProjectModel}