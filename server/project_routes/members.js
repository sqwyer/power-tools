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
                        members.push({...project.members[i], name: data.name});
                        if(i+1==project.members.length) {
                            res.render(`${__dirname}/../../views/project/members`, {project, member, user, role, members});
                        }
                    }
                })
            }
        }
    })
}

module.exports.mod = app => {
    app.get('/project/:id/2', require('../ensureAuth'), get)
}