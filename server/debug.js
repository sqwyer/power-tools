if(process.env.NODE_ENV != 'production') require('dotenv').config()

module.exports = (err, action) => {
    if(process.env.DEBUG != undefined && process.env.DEBUG == "true") {
        console.error(err)
        action(true)
    } else action(false)
}