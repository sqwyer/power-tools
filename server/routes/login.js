const debug = require('../debug')

function post (req, res, passport) {
    let template = `${__dirname}/../../views/login`
    
    passport.authenticate('local', (err, user) => {
        if(err) debug(err, () => res.render(template, {error: 'Internal error.'}))
        else if(!user) res.render(template, {errorMessage: 'Invalid email or password.'})
        else req.logIn(user, (err) => {
            if (err) debug(err, () => res.render(template, {errorMessage: 'Internal error.'}))
            else res.redirect('/dashboard')
        })
    })(req, res)
}

module.exports.mod = app => {
    app.post('/api/auth/login', require('../ensureNotAuth'), (req, res) => post(req, res, require('../../server').passport))
    app.get('/api/auth/login', require('../ensureNotAuth'), (req, res) => res.render(`${__dirname}/../../views/login`))
}