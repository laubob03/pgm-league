const fs = require('fs');
const h = fs.readFileSync('index.html', 'utf8');
let p = 0, i = 0;
while ((p = h.indexOf('faCup', p)) !== -1 && i < 15) {
  console.log(p, h.substring(p - 30, p + 80));
  p += 5; i++;
}
