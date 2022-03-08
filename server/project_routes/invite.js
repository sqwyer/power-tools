const { can } = require("../helpers/can");
const findUser = require('../routes/user').find;
const findProject = require('../routes/project').find;
const debug = require('../debug')

function findAll (email, id, next) {
    findUser(email, data => {
        if(!data.data || data.error) next({error: 'No user.'});
        else findProject(id, data2 => {
            if(!data2.data || data2.error) next({error: 'No project.'});
            else next({project: data2.data.project, user: data.data.user});
        })
    })
}

function acceptInvite (req, res) {
    findAll(req.user.email, req.params.id, data => {
        if(data.error) debug(data.error, () => res.redirect('/'));
        else {
            let { project, user } = data;
            if(project.state == 0) {
                if(!project.invites.includes(user._id.toString()) || project.members.find(self => self.id === user._id.toString())) res.redirect(`/dashboard`);
                else {
                    let pI = user.invites.indexOf(project._id.toString());
                    let uI = project.invites.indexOf(req.body.member);
                    user.invites.splice(pI,1);
                    user.markModified('invites');
                    project.invites.splice(uI,1);
                    project.markModified('invites');
                    project.members.push({
                        id: user._id.toString(),
                        role: 'Member'
                    });
                    project.markModified('members');
                    user.projects.push(project._id.toString());
                    user.markModified('projects')
                    user.save(err2 => {
                        if(err2) debug(err2, () => {});
                        project.save(err3 => {
                            if(err3) debug(err3, () => {});
                            res.redirect(`/project/${data.project._id.toString()}`);
                        })
                    })
                }
            } else require('../helpers/redirect')(req, res, '/dashboard?err=Project is archived.');
        }
    });
}

function denyInvite (req, res) {
    can(req.user.email, req.params.id, data => {
        if(data.error) debug(data.error, () => res.redirect('/'));
        else {
            let { project, user } = data;
            if(project.state == 0) {
                if(!project.invites.includes(req.body.member) || project.members.find(self => self.id === user._id.toString())) res.redirect(`/dashboard`);
                else {
                    UserModel.findById(req.body.member, (err, user) => {
                        if(err) debug(err, () => res.redirect(`/dashboard`));
                        else if(!user) res.redirect(`/dashboard`);
                        else {
                            let pI = user.invites.indexOf(project._id.toString());
                            let uI = project.invites.indexOf(req.body.member);
                            user.invites.splice(pI,1);
                            user.markModified('invites');
                            project.invites.splice(uI,1);
                            project.markModified('invites');
                            user.save(err2 => {
                                if(err2) debug(err2, () => {});
                                project.save(err3 => {
                                    if(err3) debug(err3, () => {});
                                    res.redirect(`/dashboard`);
                                })
                            })
                        }
                    })
                }
            } else require('../helpers/redirect')(req, res, '/dashboard');
        }
    });
}

module.exports.mod = app => {
    app.post('/project/:id/2/invite/accept', require('../ensureAuth'), acceptInvite)
    app.post('/project/:id/2/invite/deny', require('../ensureAuth'), denyInvite)
}