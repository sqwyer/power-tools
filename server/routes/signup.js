if(process.env.NODE_ENV != 'production') require('dotenv').config()

const { UserModel } = require("../../models/User")
const { genSaltSync, hashSync } = require('bcrypt')
const bcryptSalt = (process.env.SALT != undefined) ? Number(process.env.SALT) : 10
const debug = require('../debug')

function post (req, res) {
    let template = `${__dirname}/../../views/signup`
    let fields = {}

    for(let k in req.body) {

        if(req.body[k] === '') {
            res.render(template, {errorMessage: "Must fill all fields."})
            return
        }

        fields[k] = req.body[k]
    }

    if(fields.email != undefined && !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(fields.email)) {
        res.render(template, { errorMessage: "Must enter a valid email." })
        return
    }

    if (fields.password.split('').length < 8) {
        res.render(template, { errorMessage: "Password must be at least 8 characters." })
        return
    }

    UserModel.findOne({email: fields.email})
        .then(user => {
            if(user) {
                res.render(template, { errorMessage: "Email is already registered." })
                return
            }

            let salt = genSaltSync(bcryptSalt)
            let hash = hashSync(fields.password, salt)

            fields.password = undefined

            let newUser = new UserModel({
                ...fields,
                password: hash
            })

            newUser.save()
                .then(() => {
                    req.logIn(newUser, err => {
                        if(err) debug(err, () => res.render(template, {errorMessage: "Internal error."}))
                        else res.redirect('/dashboard')
                    })
                })
                .catch(err => debug(err, () => res.render(template, {errorMessage: "Internal error."})))
        }).catch(err => debug(err, res.render(template, {errorMessage: "Internal error."})))
}

module.exports.mod = app => {
    app.get('/api/auth/signup', (req, res) => res.render(`${__dirname}/../../views/signup`))
    app.post('/api/auth/signup', post)
}