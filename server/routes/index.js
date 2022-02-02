function get(req, res) {
    res.render(`${__dirname}/../../views/index`)
}

module.exports.mod = app => {
    app.get('/', get)
}