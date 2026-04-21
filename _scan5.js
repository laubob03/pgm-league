const fs = require('fs');
const h = fs.readFileSync('index.html', 'utf8');

// Find btnCupManagement click handler
const idx = h.indexOf('btnCupManagement');
let positions = [];
let p = 0;
while ((p = h.indexOf('btnCupManagement', p)) !== -1) {
  positions.push(p);
  p += 5;
}
console.log('btnCupManagement positions:', positions);

// Check around the button handler
positions.forEach(pos => {
  console.log('\n--- at', pos, '---');
  console.log(h.substring(pos - 20, pos + 300));
});
