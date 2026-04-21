const fs = require('fs');
const h = fs.readFileSync('index.html', 'utf8');

// Find importCupSchedule to see how q property is set
const idx = h.indexOf('function importCupSchedule');
console.log(h.substring(idx, idx + 3000));
