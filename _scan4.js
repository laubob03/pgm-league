const fs = require('fs');
const h = fs.readFileSync('index.html', 'utf8');

// Find showCupManagement or cup management modal
const idx = h.indexOf('showCupManagement');
if (idx > 0) {
  console.log('showCupManagement at:', idx);
  console.log(h.substring(idx, idx + 2000));
}

// Also find how matches get their q property
const qIdx = h.indexOf('m.q');
console.log('\nm.q first at:', qIdx);
if (qIdx > 0) console.log(h.substring(qIdx - 100, qIdx + 200));
