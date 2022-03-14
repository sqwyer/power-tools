
const mongoose = require('mongoose');

module.exports.ProjectModel = require('./model').model({
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
        }],
        required: false
    },
    members: {
        type: Array,
        default: [],
        required: false
    },
    invites: {
        type: Array,
        default: [],
        required: false
    },
    state: {
        type: Number,
        default: 0,
        required: false
    },
    tasks: {
        type: Array,
        required: false,
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
}, 'projects');