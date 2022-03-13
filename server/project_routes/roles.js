const { can } = require('../helpers/can');
const debug = require('../debug');

function getRoles (req, res) {
    can(req.user.email, req.params.id, data => {
        if(data.error) debug(data.error, () => res.redirect('/'));
        else {
            let { project, user, role } = data;
            res.render(`${__dirname}/../../views/project/roles`, { project, user, role });
        }
    });
}

module.exports.mod = app => {
    app.get('/project/:id/3', require('../ensureAuth'), getRoles);
}