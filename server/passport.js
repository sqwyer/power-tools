const { Strategy } = require('passport-local')
const { compareSync } = require('bcrypt')
const { UserModel } = require('./getModels')();

module.exports = passport => {

    passport.serializeUser((user, cb) => {
        cb(null, user._id)
    })

    passport.deserializeUser((id, cb) => {
        UserModel.findById(id).exec((err, user) => {
            if(err) cb(err)
            else cb(null, user)})
        })
      
        passport.use(new Strategy(
            {passReqToCallback: true, usernameField: 'email'},
            (...args) => {
                const [req,,, done] = args
      
                const {email, password} = req.body
      
                UserModel.findOne({email}).exec((err, user) => {
                    if(err) return done(err);
                    if (!user) return done(null, false, { message: "Invalid email or password." })
                    if (!compareSync(password, user.password)) return done(null, false, { message: "Invalid email or password." })
        
                    done(null, user)
                })
            }
      ))
}