const debug = require('../debug')
const { can } = require('../helpers/can')

function getAll (req, res) {
    let path = `${__dirname}/../../views/project/tasks`
    can(req.user.email, req.params.id, (data) => {
        if(data.error) debug(data.error, () => res.redirect('/'))
        else if(!data.project) res.redirect('/')
        else if(!data.user) res.redirect('/api/auth/login')
        else {
            let { project, user, member, role } = data;
            res.render(path, {project, user, member, role});
        }
    })
}

function getOne (req, res) {
    let path = `${__dirname}/../../views/project/task`
    can(req.user.email, req.params.id, (data) => {
        if(data.error) debug(data.error, () => res.redirect('/'))
        else if(!data.project) res.redirect('/');
        else if(!data.user) res.redirect('/api/auth/login')
        else {
            let { project, user, member, role } = data
            let list = project.tasks.find(self => self.id.toString() === req.params.list)
            if(!list) res.redirect('/project/' + project.id)
            else {
                let task = list.tasks.find(self => self.id.toString() === req.params.task)
                if(!task) res.redirect('/project/' + project.id)
                else res.render(path, { project, user, member, role, task })
            }
        }
    })
}

function create (req, res) {

}

function remove (req, res) {

}

function update (req, res) {

}

module.exports.mod = app => {
    const auth = require('../ensureAuth')

    app.get('/project/:id/1', auth, getAll)
    app.get('/project/:id/1/:list/:task', auth, getOne)
    app.post('/project/:id/1/create', auth, create)
    app.post('/project/:id/1/remove', auth, remove)
    app.post('/project/:id/1/update', auth, update)
}