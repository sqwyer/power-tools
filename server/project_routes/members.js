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
                UserModel.findOne({email: project.members[i].email}).exec((err, data) => {
                    if(err) debug(err, ()=>{});
                    else {
                        members.push({...project.members[i], name: data.name, id: data._id.toString()});
                        if(i+1==project.members.length) {
                            res.render(`${__dirname}/../../views/project/members`, {project, member, user, role, members});
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
            else res.redirect(`/project/${data.project._id.toString()}/2`);
        }
        else {
            let { project } = data;
            let { role } = req.body.role;
            if(!role) res.redirect(`/project/${data.project._id.toString()}/2`);
            else {
                let pRole = project.roles.find(self => self.name === role);
                if(!pRole) res.redirect(`/project/${data.project._id.toString()}/2`);
                else {
                    let member = project.members.find(self => self._id.toString() == req.params.user);
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
        }
    }, 'manageMembers');
}

function inviteMember (req, res) {
    can(req.user.email, req.params.id, data => {
        if(data.error) debug(data.error, () => res.redirect('/'));
        else {
            let { project } = data;
            let invites = { project };

            if(invites.includes(req.body.member)) res.redirect(`/project/${data.project._id.toString()}/2`);
            else {
                let member = project.members.find(self => self.id.toString() === req.body.member);
                if(member) res.redirect(`/project/${data.project._id.toString()}/2`);
                else {
                    UserModel.findOne({id: req.body.member}).exec((err, user) => {
                        if(err) debug(err, () => res.redirect(`/project/${data.project._id.toString()}/2`));
                        else if(!user) res.redirect(`/project/${data.project._id.toString()}/2`);
                        else {
                            user.invites.push(project._id.toString());
                            user.markModified('invites');
                            project.invites.push(req.body.member);
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
                }
            }
        }
    }, 'manageMembers');
}

function cancelInvite (req, res) {}

function acceptInvite (req, res) {}

function denyInvite (req, res) {}

module.exports.mod = app => {
    app.get('/project/:id/2', require('../ensureAuth'), get)
    app.post('/project/:id/2/updateRole/:user', require('../ensureAuth'), updateRole)
}