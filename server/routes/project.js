const { ProjectModel } = require('../../models/Project')
const debug = require('../debug')

function find (email, next) {
    ProjectModel.findOne({email}).exec(function (err, project) {
        if(err) debug(err, function () {return next({error: 'Internal error.'})})
        else if(!project) return next({error: 'Invalid user email.'})
        else if(project) {
            return next({data: {project}})
        }
    })
}

function get (req, res) {
    let email = req.query.email
    find(email, data => {
        if(data) res.json(data)
        else res.json({error: 'Internal error.'})
    })
}

module.exports.mod = app => {
    app.get('/api/project', get)
}

module.exports.find = find;