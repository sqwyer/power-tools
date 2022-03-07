const { can } = require("../helpers/can");
const debug = require('../debug');
const redirect = require('../helpers/redirect');

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
            project.state = 1;
            project.save(err => {
                if(err) debug(err, () => redirect(req, res, '/'));
                else redirect(req, res, '/project/' + req.params.id + '/4');
            });
        }
    }, 'admin');
}

module.exports.mod = app => {
    app.get('/project/:id/4', require('../ensureAuth'), get);
    app.post('/project/:id/action/archive', require('../ensureAuth'), archive);
}