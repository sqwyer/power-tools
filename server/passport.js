const { Strategy } = require('passport-local')
const { compareSync } = require('bcrypt')
const { UserModel } = require('../models/User')

module.exports = passport => {

    passport.serializeUser((user, cb) => {
        cb(null, user._id)
    })

    passport.deserializeUser((id, cb) => {
        UserModel.findById(id)
            .then(user => cb(null, user))
            .catch(err => cb(err))
        })
      
        passport.use(new Strategy(
            {passReqToCallback: true, usernameField: 'email'},
            (...args) => {
                const [req,,, done] = args
      
                const {email, password} = req.body
      
                UserModel.findOne({email})
                    .then(user => {
                        if (!user) return done(null, false, { message: "Invalid email or password." })
                        if (!compareSync(password, user.password)) return done(null, false, { message: "Invalid email or password." })
          
                        done(null, user)
                    })
                    .catch(err => done(err))
            }
      ))
}