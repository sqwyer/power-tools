const { find } = require('./user');
const { ProjectModel } = require('../getModels')();
const debug = require('../debug');

function get (req, res) {
    find(req.user.email, r => {
        if(r != undefined && r.data) res.render(`${__dirname}/../../views/create`, { user: r.data.user });
        else res.redirect('/?error=Must be logged in.');
    });
}

function post (req, res) {
    find(req.user.email, r => {
        if(r != undefined && r.data) {
            let { user } = r.data;
            let project = {};

            for(let key in req.body) {
                if(typeof req.body[key] == 'string' && req.body[key].replace(' ','')!='') {
                    project[key] = req.body[key]
                } else if (typeof req.body[key] != 'string') project[key] = req.body.key;
                else {
                    res.redirect('/project/new?error=Fields cannot be empty.');
                    return;
                }
            }
            let newProject = new ProjectModel({
                ...project,
                members: [{id: user._id.toString(), role: 'Manager'}]
            });
            newProject.save(err => {
                if(err) debug(err, () => res.redirect('/'));
                else {
                    if(require('../getModels').backup == true) user.projects.push(newProject.doc._id.toString());
                    else user.projects.push(newProject._id.toString());
                    user.save(err2 => {
                        if(err2) debug(err2, () => res.redirect('/'))
                        else {
                            console.log(newProject);
                            if(require('../getModels').backup == true) res.redirect('/project/' + newProject.doc._id.toString());
                            else res.redirect('/project/' + newProject._id.toString())
                        }
                    })
                }
            })
        } else res.redirect('/?error=Must be logged in.');
    })
}

module.exports.mod = app => {
    app.get('/project/new', require('../ensureAuth'), require('../ensureAuth'), get)
    app.post('/project/new', require('../ensureAuth'), require('../ensureAuth'), post)
}