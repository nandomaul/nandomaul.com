(function () {
  var suffix = "/index.html";
  if (!window.location.pathname.endsWith(suffix)) return;
  var cleanPath = window.location.pathname.slice(0, -"index.html".length);
  window.history.replaceState(
    window.history.state,
    "",
    cleanPath + window.location.search + window.location.hash,
  );
})();
