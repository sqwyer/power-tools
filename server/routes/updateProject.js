const { find } = require('./project');

function post (req, res) {
    let body = req.body;
    find(req.params.id, _res => {
        if(_res.error) res.redirect('/dashboard');
        else {
            let {project} = _res.data;
            for(let [index, [key, value]] of Object.entries(Object.entries(body))) {
                project[key]=value;
                project.markModified(key);
                if((Number(index)+1) == Object.keys(body).length) {
                    project.save(err => {
                        if(err) console.error(err);
                        require('../helpers/redirect')(req, res, `/project/${project._id.toString()}`);
                    });
                }
            }
        }
    })
}

module.exports.mod = app => {
    app.post('/project/:id/action/update', require('../ensureAuth'), post)
}