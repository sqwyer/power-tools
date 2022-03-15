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
let f = 0;
for (const filePath of walkSync(__dirname)) {
    if(!filePath.includes('/node_modules/')
        && !filePath.includes('\\node_modules\\')
        && !filePath.includes('.env')
        && !filePath.includes('.gitignore')
        && !filePath.includes('.json')
        && !filePath.includes('.png')
        && !filePath.includes('.git/')
        && !filePath.includes('.git\\')
        && !filePath.includes('.json')
    ) {
      l+=fs.readFileSync(filePath).toString().split('\n').length;
      f++;
    }
}
console.log(`${l} lines accross ${f} files.`);