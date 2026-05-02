(function () {
  var AUTH_KEY = 'globe_auth_token';
  var SESSION_DURATION = 24 * 60 * 60 * 1000;

  async function sha256(message) {
    var msgBuffer = new TextEncoder().encode(message);
    var hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    var hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
  }

  var DEFAULT_PASSWORD_HASH = null;
  var passwordHashPromise = sha256('globe2024').then(function (h) {
    DEFAULT_PASSWORD_HASH = h;
    return h;
  });

  window.GlobeAuth = {
    init: function () {
      return passwordHashPromise;
    },

    checkAuth: function () {
      var token = sessionStorage.getItem(AUTH_KEY);
      if (!token) return false;
      try {
        var data = JSON.parse(atob(token));
        if (Date.now() - data.t > SESSION_DURATION) {
          sessionStorage.removeItem(AUTH_KEY);
          return false;
        }
        return true;
      } catch (e) {
        sessionStorage.removeItem(AUTH_KEY);
        return false;
      }
    },

    login: async function (password) {
      await passwordHashPromise;
      var inputHash = await sha256(password);
      if (inputHash === DEFAULT_PASSWORD_HASH) {
        var token = btoa(JSON.stringify({ t: Date.now() }));
        sessionStorage.setItem(AUTH_KEY, token);
        return true;
      }
      return false;
    },

    logout: function () {
      sessionStorage.removeItem(AUTH_KEY);
    },

    requireAuth: function () {
      if (!this.checkAuth()) {
        window.location.href = 'login.html';
        return false;
      }
      return true;
    }
  };
})();
