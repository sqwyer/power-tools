function get (req, res) {
    res.render(`${__dirname}/../../views/dashboard`)
}

module.exports.mod = app => {
    app.get('/dashboard', require('../ensureAuth'), get)
}