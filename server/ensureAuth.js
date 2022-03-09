module.exports = (req, res, next) => {
    if(req.user != undefined) next()
    else res.redirect(`/api/auth/signup?err=You must be logged in to view that page.`)
}