const fs = require('fs');
const h = fs.readFileSync('index.html', 'utf8');

// Find "杯赛管理" button handler
const idx = h.indexOf('杯赛管理');
let positions = [];
let p = 0;
while ((p = h.indexOf('杯赛管理', p)) !== -1) {
  positions.push(p);
  p += 5;
}
console.log('杯赛管理 positions:', positions.length, positions.slice(0,5));

// Look at the button ID
positions.slice(0,3).forEach(pos => {
  console.log('\n--- at', pos, '---');
  console.log(h.substring(pos - 80, pos + 30));
});

// Find the handler for this button
const btnId = 'btnCupMgmt';
const btnIdx = h.indexOf(btnId);
if (btnIdx > 0) {
  console.log('\nbtnCupMgmt at:', btnIdx);
  console.log(h.substring(btnIdx, btnIdx + 200));
}

// Search for showCup or openCup
['showCup', 'openCup', 'manageCup', 'CupModal'].forEach(term => {
  let p2 = h.indexOf(term);
  if (p2 > 0) {
    console.log('\n' + term + ' at:', p2);
    console.log(h.substring(p2, p2 + 200));
  }
});
