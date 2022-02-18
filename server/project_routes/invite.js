const { can } = require("../helpers/can");

function acceptInvite (req, res) {
    can(req.user.email, req.params.id, data => {
        if(data.error) debug(data.error, () => res.redirect('/'));
        else {
            let { project, user } = data;
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
                })
            }
        }
    });
}

function denyInvite (req, res) {}

module.exports.mod = app => {
    app.post('/project/:id/2/invite/accept', require('../ensureAuth'), acceptInvite)
    app.post('/project/:id/2/invite/deny', require('../ensureAuth'), denyInvite)
}