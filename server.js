if(process.env.NODE_ENV != 'production') require('dotenv').config()

const express = require('express')
const session = require('express-session');
const passport = require('passport');
const app = express()

const hbs = require('hbs');
const { can } = require('./server/helpers/can');

hbs.registerPartials(__dirname + '/views/partials/');

hbs.registerHelper("hasPerm", function(role, perm, options) {
    if(role.permissions.includes(perm) || role.permissions.includes('admin')) return options.fn(this);
    else return options.inverse(this);
});

hbs.registerHelper("hasntPerm", function(role, perm, options) {
    if(!role.permissions.includes(perm) && !role.permissions.includes('admin')) return options.fn(this);
    else return options.inverse(this);
});

hbs.registerHelper("math", function(lvalue, operator, rvalue, options) {
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);

    return {
        "+": lvalue + rvalue,
        ">": (lvalue > rvalue),
        "=": (lvalue == rvalue)
    }[operator];
});

// hbs.registerHelper("console", function(v, options) {
//     console.log('-----');
//     console.log(v);
//     console.log('-----');
//     return options.fn(this);
// });

hbs.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

hbs.registerHelper('notEquals', function(arg1, arg2, options) {
    return (arg1 != arg2) ? options.fn(this) : options.inverse(this);
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