(function () {
  const params = new URLSearchParams(location.search);
  const oldPath = (params.get("p") || location.pathname).replace(/\/index\.html$/, "").replace(/\/+$/, "");
  const supported = /^\/(popup|frontpage|requestpage|p4series|catalog|content-marketing|office-inventory|reports-lab)(?:\/|$)/;
  let route = supported.test(oldPath) ? oldPath : "/popup";
  if (oldPath === "/dashboard") route = "/requestpage/projectcalendar";
  location.replace(`/demos/systemadf/index.html?portfolioDemo=1#${route}`);
})();
