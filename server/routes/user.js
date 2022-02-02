const { UserModel } = require('../../models/User')
const debug = require('../debug')

function get (req, res) {
    let email = req.query.email

    UserModel.findOne({email}).exec((err, user) => {
        if(err) debug(err, () => res.json({error: 'Internal error.'}))
        else if(!user) res.json({error: 'Invalid user email.'})
        else if(user) res.json({data: {user}})
    })
}

module.exports.mod = app => {
    app.get('/api/user', get)
}