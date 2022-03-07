const mongoose = require('mongoose')
const debug = require('../debug')
const { can } = require('../helpers/can')

function isValidDate(dateString)
{
    if(!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString)) return false;
    let parts = dateString.split("/");
    let day = parseInt(parts[1], 10);
    let month = parseInt(parts[0], 10);
    let year = parseInt(parts[2], 10);
    if(year < 1000 || year > 3000 || month == 0 || month > 12) return false;
    let monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
    if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) monthLength[1] = 29;
    return day > 0 && day <= monthLength[month - 1];
};

function getAll (req, res) {
    let path = `${__dirname}/../../views/project/tasks`
    can(req.user.email, req.params.id, (data) => {
        if(data.error) debug(data.error, () => res.redirect('/'))
        else if(!data.project) res.redirect('/')
        else if(!data.user) res.redirect('/api/auth/login')
        else {
            let { project, user, member, role } = data;
            project.tasks.map(self => self.tasks.map(s => s.sDue = {
                m: s.due.split('/')[0] || null,
                d: s.due.split('/')[1] || null,
                y: s.due.split('/')[2] || null,
            }))
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
            let list = project.tasks.find(self => self.id.toString() === req.params.list);
            if(!list) res.redirect('/project/' + project.id + '/1')
            else {
                let i = project.tasks.indexOf(list);
                let { name, note, due } = req.body;
                if(!name || !note) {
                    res.redirect('/project/' + project.id + '/1');
                } else {
                    if(!due) due = '';
                    project.tasks[i].tasks.push({
                        id: new mongoose.Types.ObjectId(),
                        name,
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
            if(data.error == 'No permission.') res.redirect(`/project/${req.params.id}/1`);
            else debug(data.error, () => res.redirect('/'));
        } else if(!data.project) res.redirect('/');
        else if(!data.user) res.redirect('/api/auth/login')
        else {
            let { project } = data;
            let list = project.tasks.find(s=>s.id==req.params.list);
            if(!list) res.redirect('/project/' + project.id + '/1');
            else {
                let task = list.tasks.find(s=>s.id==req.params.tid);
                if(!task) res.redirect('/project/' + project.id + '/1');
                else {
                    project.tasks[project.tasks.indexOf(list)].tasks.splice(list.tasks.indexOf(task),1);
                    project.markModified('tasks');
                    project.save(err => {
                        if(err) debug(err, () => {});
                        res.redirect('/project/' + project.id + '/1')
                    })
                }
            }
        }
    }, 'manageTasks');
}

function update (req, res) {
    can(req.user.email, req.params.id, data => {
        if(data.error) {
            if(data.error == 'No permission.') res.redirect(`/project/${req.params.id}/1`);
            else debug(data.error, () => res.redirect('/'));
        } else if(!data.project) res.redirect('/');
        else if(!data.user) res.redirect('/api/auth/login')
        else {
            let { project } = data;
            let list = project.tasks.find(s=>s.id==req.params.list);
            if(!list) res.redirect('/project/' + project.id + '/1');
            else {
                let task = list.tasks.find(s=>s.id==req.params.tid);
                if(!task) res.redirect('/project/' + project.id + '/1');
                else {
                    let er = "";
                    if(Object.keys(req.body).length > 0) {
                        for(let k in req.body) {
                            if(k == 'due') {
                                if(isValidDate(req.body[k])) project.tasks[project.tasks.indexOf(list)].tasks[list.tasks.indexOf(task)][k] = req.body[k];
                                else er = "?err=Invalid date.";
                            }
                            else if(req.body[k] != '') project.tasks[project.tasks.indexOf(list)].tasks[list.tasks.indexOf(task)][k] = req.body[k];
                        }
                        project.markModified('tasks');
                        project.save(err => {
                            if(err) debug(err, () => {});
                            res.redirect('/project/' + project.id + '/1/' + req.params.list + '/' + req.params.tid + er);
                        })
                    } else res.redirect('/project/' + project.id + '/1/' + req.params.list + '/' + req.params.tid + er);
                }
            }
        }
    }, 'manageTasks');
}

module.exports.mod = app => {
    const auth = require('../ensureAuth')

    app.get('/project/:id/1', auth, getAll)
    app.get('/project/:id/1/:list/:task', auth, getOne)
    app.post('/project/:id/1/create/:list', auth, create)
    app.post('/project/:id/1/remove/:list/:tid', auth, remove)
    app.post('/project/:id/1/update/:list/:tid', auth, update)
}

module.exports.isValidDate = isValidDate;