const fs = require('fs');
const h = fs.readFileSync('index.html', 'utf8');

// Find the cup management section - how faCup matches are created
const idx = h.indexOf('state.cups.faCup = { teams: [], matches: [] }');
const idx2 = h.indexOf('state.cups.faCup');
// Find the faCup match import/setup function
let p = idx2;
// Find createCupMatches or similar for faCup
const importIdx = h.indexOf('导入足总杯');
if (importIdx > 0) {
  console.log('=== 导入足总杯 context ===');
  console.log(h.substring(importIdx - 100, importIdx + 1500));
}

// Also search for faCup match structure - look for q: or round: patterns near faCup
const setupIdx = h.indexOf('setupFaCup');
if (setupIdx > 0) {
  console.log('=== setupFaCup ===');
  console.log(h.substring(setupIdx, setupIdx + 2000));
} else {
  console.log('setupFaCup NOT FOUND');
}

// Search for where faCup matches are populated
const populateIdx = h.indexOf('importFaCup');
if (populateIdx > 0) {
  console.log('=== importFaCup ===');
  console.log(h.substring(populateIdx, populateIdx + 2000));
} else {
  console.log('importFaCup NOT FOUND');
}
