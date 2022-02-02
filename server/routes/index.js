const { find } = require('./user')

function get(req, res) {
    if(req.user) find(req.user.email, data => {
        if(data.data) res.render(`${__dirname}/../../views/index`, { user: data.data.user })
        else res.render(`${__dirname}/../../views/index`)
    })
    else res.render(`${__dirname}/../../views/index`)
}

module.exports.mod = app => {
    app.get('/', get)
}