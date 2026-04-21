const fs = require('fs');
const h = fs.readFileSync('index.html', 'utf8');

// Find how faCup matches get their q and round properties
// Search for where cup matches are parsed during import
const importIdx = h.indexOf('showImportCupModal');
console.log('=== showImportCupModal full ===');
console.log(h.substring(importIdx, importIdx + 4000));
