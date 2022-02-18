const { find } = require('./user');
const findProject = require('./project').find;

function get (req, res) {
    find(req.user.email, r => {
        if(r == undefined) return res.redirect('/');
        else if(r.data.user.projects.length == 0) res.render(`${__dirname}/../../views/dashboard`, { user: r.data.user, projects: []});
        else {
            let projects = [];
            for(let i = 0; i < r.data.user.projects.length; i++) {
                findProject(r.data.user.projects[i], info => {
                    if(info.data) projects.push(info.data.project);
                    if((i+1)==r.data.user.projects.length) {
                        let invites = [];
                        if(r.data.user.invites.length != 0) for(let k = 0; k < r.data.user.invites.length; k++) {
                            findProject(r.data.user.invites[k], info2 => {
                                if(info2.data) invites.push(info2.data)
                                if(i+1==r.data.user.invites.length) res.render(`${__dirname}/../../views/dashboard`, { user: r.data.user, projects, invites });
                            })
                        }
                        else res.render(`${__dirname}/../../views/dashboard`, { user: r.data.user, projects, invites });
                    }
                });
            }
        }
    });
}

module.exports.mod = app => {
    app.get('/dashboard', require('../ensureAuth'), get)
}