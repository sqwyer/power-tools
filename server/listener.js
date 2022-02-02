const {app} = require('../server')
const fs = require('fs')

let f = fs.readdirSync(`${__dirname}/routes`, function (err, files) {
    if(err) throw err
    else return files
})

for(let i = 0; i < f.length; i++) {
    let m = require(`./routes/${f[i]}`)
    if (typeof m.mod == 'function' && !m.disabled) m.mod(app)
}

app.listen(process.env.PORT || 3000, err => {
    if(err) throw err
    else console.log(`Server running on PORT ${process.env.PORT || 3000}.`)
})