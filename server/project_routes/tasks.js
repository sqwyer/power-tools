const debug = require('../debug')
const { can } = require('../helpers/can')

function get (req, res) {
    let path = `${__dirname}/../../views/project/tasks`
    can(req.user.email, req.params.id, (data) => {
        if(data.error) debug(data.error, res.redirect('/'))
        else if(!data.project) res.redirect('/')
        else if(!data.user) res.redirect('/api/auth/login')
        else {
            let { project, user, member, role } = data;
            res.render(path, {project, user, member, role});
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

    app.get('/project/:id/1', auth, get)
    app.post('/project/:id/1/create', auth, create)
    app.post('/project/:id/1/remove', auth, remove)
    app.post('/project/:id/1/update', auth, update)
}