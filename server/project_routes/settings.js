const { can } = require("../helpers/can");
const debug = require('../debug');
const redirect = require('../helpers/redirect');
const { UserModel } = require("../../models/User");

function get (req, res) {
    can(req.user.email, req.params.id, data => {
        if(data.error) debug(data.error, () => res.redirect('/'));
        else {
            let { project, role, member, user } = data;
            res.render(`${__dirname}/../../views/project/settings.hbs`, {
                project, role, member, user
            });
        }
    });
}

function archive (req, res) {
    can(req.user.email, req.params.id, data => {
        if(data.error) debug(data.error, () => redirect(req, res, '/'));
        else {
            let { project } = data;
            if(project.state == 0) {
                project.state = 1;
                for(let i = 0; i < project.invites.length; i++) {
                    UserModel.findById(project.invites[i]).exec((err, user ) => {
                        if(err) debug(err, () => {});
                        else {
                            user.invites.splice(user.invites.indexOf(project._id.toString()), 1);
                            project.invites.splice(project.invites.indexOf(user._id.toString()), 1);
                            user.markModified('invites');
                            project.markModified('invites');
                        }
                    });
                }
                project.save(err => {
                    if(err) debug(err, () => redirect(req, res, '/'));
                    else redirect(req, res, '/project/' + req.params.id + '/4');
                });
            } else require('../helpers/redirect')(req, res, '/project/' + project.id + '/4?err=Project is already archived.');
        }
    }, 'admin');
}


function unarchive (req, res) {
    can(req.user.email, req.params.id, data => {
        if(data.error) debug(data.error, () => redirect(req, res, '/'));
        else {
            let { project } = data;
            if(project.state == 1) {
                project.state = 0;
                project.save(err => {
                    if(err) debug(err, () => redirect(req, res, '/'));
                    else redirect(req, res, '/project/' + req.params.id + '/4');
                });
            } else {
                redirect(req, res, '/project/' + req.params.id + '/4?err=Project is not archived.');
            }
        }
    }, 'admin');
}

module.exports.mod = app => {
    app.get('/project/:id/4', require('../ensureAuth'), get);
    app.post('/project/:id/action/archive', require('../ensureAuth'), archive);
    app.post('/project/:id/action/unarchive', require('../ensureAuth'), unarchive);
}