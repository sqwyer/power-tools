// https://stackoverflow.com/questions/41462606/get-all-files-recursively-in-directories-nodejs

const fs = require('fs');
const path = require('path');

function *walkSync(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    if (file.isDirectory()) {
      yield* walkSync(path.join(dir, file.name));
    } else {
      yield path.join(dir, file.name);
    }
  }
}

let l = 0;
for (const filePath of walkSync(__dirname)) {
    if(!filePath.includes('/node_modules/')
        && !filePath.includes('getlines.js')
        && !filePath.includes('.env')
        && !filePath.includes('.gitignore')
        && !filePath.includes('.md')
        && !filePath.includes('.json')
        && !filePath.includes('.png')
    ) l+=fs.readFileSync(filePath).toString().split('\n').length;
}
console.log(l);