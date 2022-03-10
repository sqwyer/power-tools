function get (req, res) {
    res.render(`${__dirname}/../../views/info`, { user: req.user });
}

function team (req, res) {
    res.render(`${__dirname}/../../views/team`, { user: req.user });
}

module.exports.mod = app => {
    app.get('/info', get);
    app.get('/info/team', team);
}