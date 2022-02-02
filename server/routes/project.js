const { ProjectModel } = require('../../models/Project')
const debug = require('../debug')

function get (req, res) {
    let id = req.query.id
    
    ProjectModel.findOne({id}).exec((err, project) => {
        if(err) debug(() => res.json({error: 'Internal error.'}))
        else if(!project) res.json({error: 'Invalid project id.'})
        else if(project) res.json({data: {project}})
    })
}

module.exports.mod = app => {
    app.get('/api/project', get)
}