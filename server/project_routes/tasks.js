const mongoose = require('mongoose')
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
                else res.render(path, { project, user, member, role, task, list })
            }
        }
    })
}

function create (req, res) {
    can(req.user.email, req.params.id, data => {
        if(data.error) {
            if(data.error == 'No permission.') res.redirect(`/project/${req.params.id}/1`);
            else debug(data.error, () => res.redirect('/'));
        } else if(!data.project) res.redirect('/');
        else if(!data.user) res.redirect('/api/auth/login')
        else {
            let { project } = data;
            let list = project.tasks.find(self => self.id.toString() === req.params.list)
            if(!list) res.redirect('/project/' + project.id + '/1')
            else {
                let i = 0; project.tasks.indexOf(list);
                let { body, note, due } = req.body;
                if(!body || !note) {
                    res.redirect('/project/' + project.id + '/1');
                } else {
                    if(!due) due = '';
                    project.tasks[i].tasks.push({
                        id: new mongoose.Types.ObjectId(),
                        body,
                        note,
                        due
                    });
                    project.markModified('tasks');
                    project.save(err => {
                        if(err) debug(err, () => {});
                        res.redirect('/project/' + project.id + '/1');
                    });
                }
            }

        }
    }, 'manageTasks');
}

function remove (req, res) {
    can(req.user.email, req.params.id, data => {
        if(data.error) {

        } else if(!data.project) res.redirect('/');
        else if(!data.user) res.redirect('/api/auth/login')
        else {
            
        }
    }, 'manageTasks');
}

function update (req, res) {
    can(req.user.email, req.params.id, data => {
        if(data.error) {

        } else if(!data.project) res.redirect('/');
        else if(!data.user) res.redirect('/api/auth/login')
        else {
            
        }
    }, 'manageTasks');
}

module.exports.mod = app => {
    const auth = require('../ensureAuth')

    app.get('/project/:id/1', auth, getAll)
    app.get('/project/:id/1/:list/:task', auth, getOne)
    app.post('/project/:id/1/create', auth, create)
    app.post('/project/:id/1/remove', auth, remove)
    app.post('/project/:id/1/update', auth, update)
}