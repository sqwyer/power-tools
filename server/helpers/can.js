const { ProjectModel } = require("../../models/Project")
const { UserModel } = require("../../models/User")

module.exports.can = (email, project, next, perm) => {
    UserModel.findOne({email}).exec((err, user) => {
        if(err) next({error: 'Internal error.'});
        else if(!user) next({error: 'Member doess not exist.'});
        else {
            ProjectModel.findById(project).exec((err2, project) => {
                if(err2) next({error: 'Internal error.'});
                else if(!user) next({error: 'Project does not exist.'});
                else {
                    let member = project.members.find(s=>s.id===user._id.toString());
                    if(!member) next({error: 'User is not in project.'});
                    else {
                        let role = project.roles.find(s=>s.name===member.role);
                        if(!role) next({error: 'User\'s role does not exist.'});
                        else {
                            if(perm != undefined) role.permissions.includes(perm) || role.permissions.includes('admin') ? next({project, user, role}) : next({error: 'No permission.'});
                            else next({project, user, role, member});
                        }
                    }
                }
            });
        }
    });
}