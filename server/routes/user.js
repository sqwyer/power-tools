const { UserModel } = require('../../models/User')
const debug = require('../debug')

function find (email, next) {
    UserModel.findOne({email}).exec(function (err, user) {
        if(err) debug(err, function () {return next({error: 'Internal error.'})})
        else if(!user) return next({error: 'Invalid user email.'})
        else if(user) {
            user.password = undefined;
            return next({data: {user}})
        }
    })
}

function get (req, res) {
    let email = req.query.email
    find(email, data => {
        if(data) res.json(data)
        else res.json({error: 'Internal error.'})
    })
}

module.exports.mod = app => {
    app.get('/api/user', get)
}

module.exports.find = find;