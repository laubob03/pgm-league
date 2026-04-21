const fs = require('fs');
const h = fs.readFileSync('index.html', 'utf8');

// Get the showCupManageModal and import logic
const idx = h.indexOf('showCupManageModal()');
console.log(h.substring(idx, idx + 3000));
