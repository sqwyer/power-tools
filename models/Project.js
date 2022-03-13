const mongoose = require('mongoose')
const conn = mongoose.createConnection(process.env.MONGO_URI, {useNewUrlParser: true});

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
                tasks: [{
                    name: 'Create Tasks',
                    note: 'Create and assign the tasks needed to complete your project to help figure out the next steps at any given time!',
                    due: '',
                    assigned: [],
                    id: new mongoose.Types.ObjectId()
                }]
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
    },
    school: {
        type: String,
        default: 'Unselected',
        required: false
    }
});

const ProjectModel = conn.model('project', ProjectSchema, 'projects')

module.exports = {ProjectSchema, ProjectModel}