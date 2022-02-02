if(process.env.NODE_ENV != 'production') require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session');
const passport = require('passport');
const app = express()

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