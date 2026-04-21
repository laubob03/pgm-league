const fs = require('fs');
const h = fs.readFileSync('index.html', 'utf8');
const start = h.indexOf('// ========== 足总杯对阵图渲染');
const end = h.indexOf('}', h.indexOf('saveToUrlHash();', start)) + 1;
console.log('Start:', start, 'End:', end);
console.log('Length:', end - start);
// Find the next function after
console.log('After:', h.substring(end, end + 80));
