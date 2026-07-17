const http=require('http'),fs=require('fs'),path=require('path');
const root='C:\\Users\\J.K\\WorkBuddy\\20260424000824\\pgm-league-deploy';
const types={'.html':'text/html','.js':'application/javascript','.json':'application/json','.css':'text/css'};
http.createServer((req,res)=>{
  let p=path.join(root,req.url==='/'?'index.html':req.url.split('?')[0]);
  fs.readFile(p,(e,d)=>{
    if(e){res.writeHead(404);res.end('404');return;}
    res.writeHead(200,{'Content-Type':types[path.extname(p)]||'text/plain'});
    res.end(d);
  });
}).listen(8088,'127.0.0.1',()=>console.log('SERVER_UP_8088'));
