const fs = require('fs');
const h = fs.readFileSync('index.html', 'utf8');

// Find all unique function names that mention faCup
const funcRegex = /function\s+(\w*[Ff]a[Cc]up\w*)/g;
let m;
while ((m = funcRegex.exec(h)) !== null) {
  console.log('Function:', m[1], 'at', m.index);
}

// Search for "足总杯" in function context
const funcRegex2 = /function\s+(\w+)[^{]*\{[^}]*足总杯/g;
while ((m = funcRegex2.exec(h)) !== null) {
  console.log('Function with 足总杯:', m[1], 'at', m.index);
}

// Find the cup management modal - where matches are created
const modalIdx = h.indexOf('杯赛管理');
console.log('\n杯赛管理 at:', modalIdx);
if (modalIdx > 0) {
  console.log(h.substring(modalIdx - 50, modalIdx + 500));
}
