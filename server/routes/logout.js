function logout (req, res) {
    req.logOut();
    res.redirect('/');
}

module.exports.mod = app => {
    app.get('/api/auth/logout', logout);
}