const vm=require('vm');
const fs=require('fs');
const path=process.argv[1];
const code=fs.readFileSync(path,'utf8');
try{ new vm.Script(code,{filename:path}); console.log('PARSE_OK'); }
catch(e){ console.log('PARSE_ERR: '+e.message); }
