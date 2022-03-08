const { can } = require('../helpers/can');
let { UserModel } = require('../../models/User');
const debug = require('../debug');

function get (req, res) {
    can(req.user.email, req.params.id, data => {
        if(data.error) debug(data.error, () => res.redirect('/'));
        else {
            let { project, member, user, role } = data;
            let members = [];
            for(let i = 0; i < project.members.length; i++) {
                UserModel.findById(project.members[i].id).exec((err, data) => {
                    if(err) debug(err, ()=>{});
                    else if(!data) debug(err, () => {});
                    else {
                        members.push({...project.members[i], name: data.name, id: data._id.toString(), email: data.email});
                        if(i+1==project.members.length) {
                            let invites = [];
                            if(project.invites.length >= 1) {
                                for(let k = 0; k < project.invites.length; k++) {
                                    UserModel.findById(project.invites[k], (err2, user) => {
                                        if(err2) debug(err2, () => {})
                                        else {
                                            invites.push({id: project.invites[k], name: user.name, email: user.email})
                                            if(k+1==project.invites.length) res.render(`${__dirname}/../../views/project/members`, {project, member, user, role, members, invites});
                                        }
                                    })
                                }
                            } else res.render(`${__dirname}/../../views/project/members`, {project, member, user, role, members, invites});
                        }
                    }
                })
            }
        }
    })
}

function updateRole (req, res) {
    can(req.user.email, req.params.id, data => {
        if(data.error) {
            if(data.error != 'No permission.') debug(data.error, () => res.redirect('/'));
            else res.redirect(`/project/${req.params.id}/2`);
        }
        else {
            let { project } = data;
            if(project.state == 0) {
                let { role } = req.body;
                if(!role) res.redirect(`/project/${data.project._id.toString()}/2`);
                else {
                    let pRole = project.roles.find(self => self.name === role);
                    if(!pRole) res.redirect(`/project/${data.project._id.toString()}/2`);
                    else {
                        let member = project.members.find(self => self.id.toString() == req.params.user);
                        if(!member) res.redirect(`/project/${data.project._id.toString()}/2`);
                        else {
                            if(member.role == 'Manager' && project.members.filter(self => self.role === 'Manager').length <= 1) res.redirect(`/project/${data.project._id.toString()}/2`);
                            else {
                                project.members[project.members.indexOf(member)].role = pRole.name;
                                project.markModified('members');
                                project.save(err => {
                                    if(err) debug(data.error, ()=>{});
                                    res.redirect(`/project/${data.project._id.toString()}/2`);
                                });
                            }
                        }
                    }
                }
            } else require('../helpers/redirect')(req, res, '/project/' + project.id + '/2?err=Project is archived.');
        }
    }, 'manageMembers');
}

function inviteMember (req, res) {
    can(req.user.email, req.params.id, data => {
        if(data.error) debug(data.error, () => res.redirect('/'));
        else {
            let { project } = data;
            if(project.state == 0) {
                let { invites } = project;
                UserModel.findOne({email: req.body.member}).exec((err, user) => {
                    if(err) debug(err, () => res.redirect(`/project/${data.project._id.toString()}/2`));
                    else if(!user) res.redirect(`/project/${data.project._id.toString()}/2`);
                    else if(invites.includes(user._id.toString())) res.redirect(`/project/${data.project._id.toString()}/2`);
                    else if(project.members.find(s=>s.id===user._id.toString())) res.redirect(`/project/${data.project._id.toString()}/2`);
                    else {
                        user.invites.push(project._id.toString());
                        user.markModified('invites');
                        project.invites.push(user._id.toString());
                        project.markModified('invites');
                        project.save(err => {
                            if(err) debug(err, () => {});
                            user.save(err2 => {
                                if(err2) debug(err2, () => {});
                                res.redirect(`/project/${data.project._id.toString()}/2`);
                            });
                        });
                    }
                });
            } else require('../helpers/redirect')(req, res, '/project/' + project.id + '/2?err=Project is archived.');
        }
    }, 'manageMembers');
}

function cancelInvite (req, res) {
    // can(req.user.email, req.params.id, data => {
    //     if(data.error) {
    //         if(data.error == 'No permission.') res.redirect(`/project/${data.project._id.toString()}/2`);
    //         else debug(data.error, () => {res.redirect('/')});
    //     } else {
    //         let { project } = data;
    //         if(!project.invites.includes(req.body.member)) res.redirect(`/project/${data.project._id.toString()}/2`);
    //         else {
    //             UserModel.findById(req.body.member, (err, user) => {
    //                 if(err) debug(err, () => res.redirect(`/project/${data.project._id.toString()}/2`));
    //                 else if(!user) res.redirect(`/project/${data.project._id.toString()}/2`);
    //                 else {
    //                     let pI = user.invites.indexOf(project._id.toString());
    //                     let uI = project.invites.indexOf(req.body.member);
    //                     user.invites.splice(pI,1);
    //                     user.markModified('invites');
    //                     project.invites.splice(uI,1);
    //                     project.markModified('invites');
    //                     user.save(err2 => {
    //                         if(err2) debug(err2, () => {});
    //                         project.save(err3 => {
    //                             if(err3) debug(err3, () => {});
    //                             res.redirect(`/project/${data.project._id.toString()}/2`);
    //                         })
    //                     })
    //                 }
    //             })
    //         }
    //     }
    // }, 'manageMembers')

    can(req.user.email, req.params.id, data => {
        if(data.error) debug(data.error, () => res.redirect('/'));
        else {
            let { project } = data;
            if(project.state == 0) {
                let { invites } = project;
                UserModel.findById(req.body.member).exec((err, user) => {
                    if(err) debug(err, () => res.redirect(`/project/${data.project._id.toString()}/2`));
                    else if(!user) res.redirect(`/project/${data.project._id.toString()}/2`);
                    else if(!invites.includes(user._id.toString())) res.redirect(`/project/${data.project._id.toString()}/2`);
                    else {
                        let pI = user.invites.indexOf(project._id.toString());
                        let uI = project.invites.indexOf(user._id.toString());
                        user.invites.splice(pI,1);
                        user.markModified('invites');
                        project.invites.splice(uI,1);
                        project.markModified('invites');
                        user.save(err2 => {
                            if(err2) debug(err2, () => {});
                            project.save(err3 => {
                                if(err3) debug(err3, () => {});
                                res.redirect(`/project/${data.project._id.toString()}/2`);
                            })
                        })
                    }
                });
            } else require('../helpers/redirect')(req, res, '/project/' + project.id + '/2?err=Project is archived.');
        }
    }, 'manageMembers');
}

function kick (req, res) {
    can(req.user.email, req.params.id, data => {
        if(data.error) {
            if(data.error == 'No permission.') require('../helpers/redirect')(req, res, '/project/' + project.id + '/2?err=No permission.');
            else require('../helpers/redirect')(req, res, '/');
        } else {
            let { project } = data;
            if(project.state == 0) {
                let { id } = req.body;
                let member = project.members.find(self => self.id === id);
                if(member) {
                    if(project.members.length != 1) {
                        project.members.splice(project.members.indexOf(id), 1);
                        UserModel.findById(id).exec((err, user) => {
                            if(err) debug(err, () => require('../helpers/redirect')(req, res, '/project/' + project.id + '/2?err=Internal error.'))
                            else {
                                user.projects.splice(user.projects.indexOf(project.id), 1);
                                user.markModified('projects');
                                project.markModified('members');
                                user.save(err2 => {
                                    if(err2) debug(err2, () => require('../helpers/redirect')(req, res, '/project/' + project.id + '/2?err=Internal error.'));
                                    else project.save(err3 => {
                                        if(err3) debug(err3, () => require('../helpers/redirect')(req, res, '/project/' + project.id + '/2?err=Internal error.'));
                                        else require('../helpers/redirect')(req, res, '/project/' + project.id + '/2');
                                    });
                                });
                            }
                        });
                    } else require('../helpers/redirect')(req, res, '/project/' + project.id + '/2?err=Cannot leave with only 1 project member.');
                }  else require('../helpers/redirect')(req, res, '/project/' + project.id + '/2?err=Member not in project.');
            } else require('../helpers/redirect')(req, res, '/project/' + project.id + '/2?err=Project is archived.');
        }
    }, 'manageMembers');
}

module.exports.mod = app => {
    app.get('/project/:id/2', require('../ensureAuth'), get)
    app.post('/project/:id/2/updateRole/:user', require('../ensureAuth'), updateRole)
    app.post('/project/:id/2/invite/send', require('../ensureAuth'), inviteMember)
    app.post('/project/:id/2/invite/cancel', require('../ensureAuth'), cancelInvite)
    app.post('/project/:id/2/kick', require('../ensureAuth'), kick)
}