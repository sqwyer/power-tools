function get (req, res) {
    res.render(`${__dirname}/../../views/help`, { user: req.user });
}

module.exports.mod = app => app.get('/help', get);