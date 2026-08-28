(function () {
  if (new URLSearchParams(location.search).get("portfolioDemo") !== "1") return;
  window.__ADF_PORTFOLIO_DEMO__ = true;

  const now = new Date();
  const iso = (offset) => new Date(now.getTime() + offset * 86400000).toISOString();
  const date = (offset) => iso(offset).slice(0, 10);

  window.ADF_PORTFOLIO_REQUESTS = [
    { id: "rq-01", category: "realme", requester: "Maya Pradana", requester_name: "Maya Pradana", title: "Launch visual for Aurora Buds", type: "Marketplace banner", platform: "Tokopedia", due_date: date(2), priority: "High", status: "In Progress", created_at: iso(-4), sort_order: 1 },
    { id: "rq-02", category: "akaso", requester: "Dimas Arta", requester_name: "Dimas Arta", title: "Action camera summer bundle", type: "Landing page", platform: "Web", due_date: date(4), priority: "Medium", status: "Review", created_at: iso(-3), sort_order: 2 },
    { id: "rq-03", category: "adf", requester: "Sasha Rahma", requester_name: "Sasha Rahma", title: "Monthly creative recap", type: "Internal deck", platform: "Internal", due_date: date(6), priority: "Normal", status: "New", created_at: iso(-2), sort_order: 3 },
    { id: "rq-04", category: "akg", requester: "Reno Wijaya", requester_name: "Reno Wijaya", title: "Product education carousel", type: "Social carousel", platform: "Instagram", due_date: date(8), priority: "Medium", status: "Scheduled", created_at: iso(-1), sort_order: 4 },
    { id: "rq-05", category: "gmi", requester: "Nadia Putri", requester_name: "Nadia Putri", title: "Retail display refresh", type: "Point of sale", platform: "Retail", due_date: date(10), priority: "Normal", status: "Done", created_at: iso(-8), sort_order: 5 }
  ];

  window.ADF_PORTFOLIO_NOTES = [
    { id: "note-01", date_key: date(1), title: "Review Aurora visual", note: "Check product hierarchy and CTA contrast.", created_at: iso(-1) },
    { id: "note-02", date_key: date(3), title: "Team checkpoint", note: "Confirm final assets before scheduling.", created_at: iso(-1) },
    { id: "note-03", date_key: date(6), title: "Delivery window", note: "Bundle approved files in the campaign catalogue.", created_at: iso(0) }
  ];

  window.ADF_PORTFOLIO_CATALOGS = [
    {
      id: "catalog-launch", slug: "launch-library", title: "Launch Library", subtitle: "Reusable launch materials and references.", badge: "READY TO USE", note: "Creative asset catalogue", is_pinned: true, pinned_at: iso(-1), created_at: iso(-8), updated_at: iso(-1), cover_url: "",
      sections: [
        { id: "section-key-visual", title: "Key Visual", subtitle: "Master compositions and crops", sort_order: 1, items: [
          { id: "asset-kv-01", name: "Aurora Buds — Master KV", type: "PSD", url: "", sort_order: 1 },
          { id: "asset-kv-02", name: "Aurora Buds — Marketplace 1:1", type: "PNG", url: "", sort_order: 2 },
          { id: "asset-kv-03", name: "Aurora Buds — Story 9:16", type: "PNG", url: "", sort_order: 3 }
        ]},
        { id: "section-copy", title: "Copy & Guidelines", subtitle: "Approved lines and usage notes", sort_order: 2, items: [
          { id: "asset-copy-01", name: "Launch copy deck", type: "PDF", url: "", sort_order: 1 },
          { id: "asset-copy-02", name: "Visual usage notes", type: "DOC", url: "", sort_order: 2 }
        ]}
      ]
    },
    {
      id: "catalog-retail", slug: "retail-toolkit", title: "Retail Toolkit", subtitle: "Point-of-sale and store display collection.", badge: "FIELD KIT", note: "Retail production files", is_pinned: false, pinned_at: null, created_at: iso(-14), updated_at: iso(-2), cover_url: "",
      sections: [
        { id: "section-pos", title: "Point of Sale", subtitle: "Print-ready examples", sort_order: 1, items: [
          { id: "asset-pos-01", name: "Counter display A4", type: "PDF", url: "", sort_order: 1 },
          { id: "asset-pos-02", name: "Shelf talker set", type: "AI", url: "", sort_order: 2 },
          { id: "asset-pos-03", name: "Price card templates", type: "FIG", url: "", sort_order: 3 }
        ]},
        { id: "section-photo", title: "Product Photos", subtitle: "Studio image pack", sort_order: 2, items: [
          { id: "asset-photo-01", name: "Studio pack — light", type: "JPG", url: "", sort_order: 1 },
          { id: "asset-photo-02", name: "Lifestyle crop set", type: "JPG", url: "", sort_order: 2 }
        ]}
      ]
    }
  ];

  const cleanCopy = new Map([
    ["Local preview session for template/demo.", "Authorized workspace session."],
    ["Developer Mode", "Workspace"],
    ["Demo Login", "Log In"],
    ["New Account Preview", "Create Account"],
    ["Portfolio preview", "Workspace preview"],
    ["Demo action simulated — no external account was opened.", "Successfully connected. Check your email for the next step."],
    ["Portfolio demo", "Workspace"],
    ["Local demo", "Workspace"]
  ]);

  const cleanVisibleCopy = (root) => {
    if (!root) return;
    if (root.nodeType === Node.TEXT_NODE) {
      let value = root.nodeValue || "";
      cleanCopy.forEach((replacement, original) => {
        value = value.split(original).join(replacement);
      });
      if (value !== root.nodeValue) root.nodeValue = value;
      return;
    }
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      let value = node.nodeValue || "";
      cleanCopy.forEach((replacement, original) => {
        value = value.split(original).join(replacement);
      });
      if (value !== node.nodeValue) node.nodeValue = value;
    }
  };

  const style = document.createElement("style");
  style.textContent = `
    html, body, #root { min-height:100%; }
    body { overscroll-behavior:contain; }
    .request-scroll, .catalog-scroll { overflow-y:scroll !important; overscroll-behavior:contain; scrollbar-width:auto !important; }
    .request-scroll::-webkit-scrollbar, .catalog-scroll::-webkit-scrollbar { width:12px !important; }
    .request-scroll::-webkit-scrollbar-thumb, .catalog-scroll::-webkit-scrollbar-thumb { background:rgba(20,32,53,.28) !important; border:3px solid transparent; background-clip:padding-box !important; border-radius:99px; }
  `;
  document.head.appendChild(style);

  window.addEventListener("DOMContentLoaded", function () {
    const simplifyPortfolioLogin = (root) => {
      if (!root) return;
      const candidates = [];
      if (root.matches && root.matches("button,div,p,span")) candidates.push(root);
      if (root.querySelectorAll) candidates.push(...root.querySelectorAll("button,div,p,span"));
      candidates.forEach((node) => {
        const copy = (node.textContent || "").trim();
        if (copy !== "Demo Login" && copy !== "New Account Preview") return;
        const card = node.closest("button") || node.parentElement?.parentElement;
        if (card) card.style.display = "none";
      });
      cleanVisibleCopy(root);
    };
    simplifyPortfolioLogin(document.body);

    const pendingRoots = new Set();
    let cleanupFrame = 0;
    const observer = new MutationObserver((records) => {
      records.forEach((record) => record.addedNodes.forEach((node) => pendingRoots.add(node)));
      if (cleanupFrame) return;
      cleanupFrame = window.requestAnimationFrame(() => {
        cleanupFrame = 0;
        pendingRoots.forEach((root) => simplifyPortfolioLogin(root));
        pendingRoots.clear();
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    window.setTimeout(() => {
      observer.disconnect();
      if (cleanupFrame) window.cancelAnimationFrame(cleanupFrame);
      pendingRoots.clear();
    }, 4000);

    document.addEventListener("click", function (event) {
      const button = event.target.closest && event.target.closest("button");
      const label = (button && button.textContent || "").trim().toLowerCase();
      if (label === "sign up" || label.includes("create account")) {
        window.setTimeout(function () {
          if (window.portfolioDemoToast) window.portfolioDemoToast("Welcome. Your workspace is ready.");
        }, 120);
      }
      const link = event.target.closest && event.target.closest('a[href=""],a[href="#"]');
      if (!link) return;
      event.preventDefault();
      if (window.portfolioDemoToast) window.portfolioDemoToast("File selected successfully.");
    }, true);

  });
})();
