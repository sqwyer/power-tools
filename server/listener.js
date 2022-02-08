const {app} = require('../server')
const fs = require('fs')

let a = fs.readdirSync(`${__dirname}/routes`, function (err, files) {
    if(err) throw err
    else return files
})

let b = fs.readdirSync(`${__dirname}/project_routes`, function (err, files) {
    if(err) throw err
    else return files
})

for(let i = 0; i < a.length; i++) {
    let m = require(`./routes/${a[i]}`)
    if (typeof m.mod == 'function' && !m.disabled) m.mod(app)
}

for(let i = 0; i < b.length; i++) {
    let m = require(`./project_routes/${b[i]}`)
    if (typeof m.mod == 'function' && !m.disabled) m.mod(app)
}

app.listen(process.env.PORT || 3000, err => {
    if(err) throw err
    else console.log(`Server running on PORT ${process.env.PORT || 3000}.`)
})