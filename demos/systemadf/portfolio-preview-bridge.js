(function () {
  // ADF uses its own local data adapter. This bridge only reports navigation.
  const report = () => {
    if (window.parent === window) return;
    window.parent.postMessage({
      type: "portfolio-route",
      href: `${location.pathname}${location.search}${location.hash}`,
    }, location.origin);
  };
  for (const name of ["pushState", "replaceState"]) {
    const original = history[name].bind(history);
    history[name] = function (...args) {
      const result = original(...args);
      report();
      return result;
    };
  }
  window.addEventListener("popstate", report);
  window.addEventListener("hashchange", report);
  window.addEventListener("adf-route-change", report);
  window.addEventListener("DOMContentLoaded", report, { once: true });
})();
