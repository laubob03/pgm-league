
  !function(){
    var _fc = sessionStorage.getItem('pgm_force_clean');
    var _curVer = '1.0.455';
    if (!_fc || _fc !== _curVer) {
      sessionStorage.setItem('pgm_force_clean', _curVer);
      var tasks = [];
      if('serviceWorker' in navigator){tasks.push(navigator.serviceWorker.getRegistrations().then(function(rs){return Promise.all(rs.map(function(r){return r.unregister()}))}))}
      if('caches' in window){tasks.push(caches.keys().then(function(ns){return Promise.all(ns.map(function(n){return caches.delete(n)}))}))}
      Promise.all(tasks).then(function(){
        location.replace(location.href.split('?')[0].split('#')[0] + '?_fc=' + Date.now() + location.hash);
      });
      return; // 阻止后续脚本执行，等 reload
    } else {
      // 标记已清理，保持标记避免循环刷新
    }
  }();
  