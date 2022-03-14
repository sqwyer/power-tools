const { UserModel, ProjectModel } = require('../getModels')();
const debug = require('../debug');

function get (req, res) {
    if(req.user && req.user.admin == true) {
        res.render(`${__dirname}/../../views/admin/index`, {user: req.user});
    } else res.redirect('/?err=No permission.');
}

function getSchool (req, res) {
    if(req.user && req.user.admin == true) {
        if(req.query.q) {
            UserModel.find({school: req.query.q}).exec((err, users) => {
                if(err) debug(err, () => res.redirect('/?err=Internal error.'));
                else {
                    ProjectModel.find({school: req.query.q}).exec((err2, projects) => {
                        if(err2) debug(err2, () => res.redirect('/?err=Internal error.'));
                        else {
                            res.render(`${__dirname}/../../views/admin/schools`, {user: req.user, projects, users, school: req.query.q});
                        }
                    })
                }
            })
        }
        else res.render(`${__dirname}/../../views/admin/schools`, {user: req.user});
    } else res.redirect('/?err=No permission.');
}

module.exports.mod = app => {
    app.get('/admin', get);
    app.get('/admin/schools', getSchool);
}