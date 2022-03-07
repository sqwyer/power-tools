const { can } = require("../helpers/can");
const debug = require('../debug');

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

module.exports.mod = app => {
    app.get('/project/:id/4', require('../ensureAuth'), get);
}