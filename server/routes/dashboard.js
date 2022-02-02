const { find } = require('./user');

function get (req, res) {
    find(req.user.email, r => {
        if(r != undefined && r.data) res.render(`${__dirname}/../../views/dashboard`, { user: r.data.user });
        else res.redirect('/');
    });
}

module.exports.mod = app => {
    app.get('/dashboard', require('../ensureAuth'), get)
}