module.exports = (req, res, instead) => {
    if(req.query.redirect != undefined) {
        res.redirect(req.query.redirect);
        return true;
    } else if(instead != undefined) {
        res.redirect(instead);
        return true;
    } else return false;
}