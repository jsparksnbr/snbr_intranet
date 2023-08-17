const express = require('express');
const app = express();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
    }, (email, passowrd, done) => {
        
        console.log(email);
}))

module.exports = passport;