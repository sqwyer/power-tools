if(process.env.NODE_ENV != 'production') require('dotenv').config()

const express = require('express')
const session = require('express-session');
const passport = require('passport');
const app = express()

const hbs = require('hbs')

hbs.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

hbs.registerHelper('ifEmpty', function(arg1, options) {
    return (arg1 == [] || arg1 == {} || arg1 == undefined || arg1 == '') ? options.fn(this) : options.inverse(this);
});

hbs.registerHelper('isntEmpty', function(arg1, options) {
    return (arg1 != [] && arg1 != {} && arg1 != undefined && arg1 != '') ? options.fn(this) : options.inverse(this);
});

app.set('view engine', 'hbs')
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(express.urlencoded({ extended: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use('/public', express.static('public'))

require('./server/passport')(passport)

module.exports = {app, passport}