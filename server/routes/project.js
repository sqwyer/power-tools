const { ProjectModel } = require('../../models/Project')
const { can } = require('../helpers/can')
const debug = require('../debug')

function find (id, next) {
    ProjectModel.findById(id).exec((err, project) => {
        if(err) debug(err, function () {return next({error: 'Internal error.'})})
        else if(!project) return next({error: 'Invalid user email.'})
        else if(project) {
            return next({data: {project}})
        }
    })
}

function get (req, res) {
    let id = req.query.id;
    find(id, data => {
        if(data) res.json(data)
        else res.json({error: 'Internal error.'})
    })
}

function getProjectPage (req, res) {
    can(req.user.email, req.params.id, info => {
        if(info.error) debug(info.error, () => res.redirect('/dashboard'));
        else {
            let { user, project, member, role } = info;
            res.render(`${__dirname}/../../views/project`, {user, project, member, role});
        }
    });
}

module.exports.mod = app => {
    app.get('/api/project', get)
    app.get('/project/:id', require('../ensureAuth'), getProjectPage)
}

module.exports.find = find;