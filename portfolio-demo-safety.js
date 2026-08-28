(function () {
  const showToast = (message) => {
    let toast = document.getElementById("portfolio-demo-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "portfolio-demo-toast";
      Object.assign(toast.style, {
        position: "fixed", right: "18px", bottom: "18px", zIndex: "2147483647",
        maxWidth: "min(360px,calc(100vw - 36px))", padding: "13px 16px",
        borderRadius: "12px", background: "#142035", color: "#fff",
        font: "700 13px/1.4 system-ui,sans-serif", boxShadow: "0 16px 45px rgba(0,0,0,.28)",
        opacity: "0", transform: "translateY(8px)", transition: ".2s ease"
      });
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    requestAnimationFrame(() => { toast.style.opacity = "1"; toast.style.transform = "none"; });
    clearTimeout(window.__portfolioDemoToastTimer);
    window.__portfolioDemoToastTimer = setTimeout(() => {
      toast.style.opacity = "0"; toast.style.transform = "translateY(8px)";
    }, 2200);
  };

  const isSensitiveAction = (value) => {
    if (!value) return false;
    const href = String(value).trim();
    if (/^(mailto:|tel:|sms:|whatsapp:)/i.test(href)) return true;
    if (/wa\.me|api\.whatsapp|accounts\.google|oauth|supabase/i.test(href)) return true;
    return false;
  };

  document.addEventListener("click", (event) => {
    const link = event.target.closest && event.target.closest("a[href]");
    if (!link || !isSensitiveAction(link.getAttribute("href"))) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    showToast("Successfully sent. Please check your email for the next step.");
  }, true);

  const nativeOpen = window.open.bind(window);
  window.open = function (url, target, features) {
    if (!url) return null;
    let next;
    try { next = new URL(String(url), location.href); } catch { next = null; }
    if (!next || isSensitiveAction(url)) {
      showToast("Successfully sent. Please check your email for the next step.");
      return null;
    }
    return nativeOpen(next.href, target, features);
  };

  window.portfolioDemoToast = showToast;

  const isPortfolioDemo = new URLSearchParams(location.search).get("portfolioDemo") === "1"
    || location.pathname.startsWith("/demos/");

  if (isPortfolioDemo) {
    const shouldPatchHistory = new URLSearchParams(location.search).get("portfolioDemo") === "1"
      && !location.pathname.startsWith("/demos/gaknyampe");
    const keepDemoQuery = (value) => {
      if (!value || new URLSearchParams(location.search).get("portfolioDemo") !== "1") return value;
      try {
        const next = new URL(String(value), location.href);
        if (next.origin !== location.origin) return value;
        next.searchParams.set("portfolioDemo", "1");
        return `${next.pathname}${next.search}${next.hash}`;
      } catch {
        return value;
      }
    };
    const reportRoute = () => {
      if (window.parent === window) return;
      window.parent.postMessage({
        type: "portfolio-route",
        href: `${location.pathname}${location.search}${location.hash}`
      }, "*");
    };

    if (shouldPatchHistory) {
      const nativePushState = history.pushState.bind(history);
      const nativeReplaceState = history.replaceState.bind(history);
      history.pushState = function (state, title, url) {
        const result = nativePushState(state, title, keepDemoQuery(url));
        reportRoute();
        return result;
      };
      history.replaceState = function (state, title, url) {
        const result = nativeReplaceState(state, title, keepDemoQuery(url));
        reportRoute();
        return result;
      };
    }
    window.addEventListener("popstate", reportRoute);
    window.addEventListener("hashchange", reportRoute);
    window.addEventListener("DOMContentLoaded", reportRoute, { once: true });

    const adfPaths = ["/systemadf.html", "/popup", "/frontpage", "/requestpage", "/p4series", "/catalog", "/content-marketing", "/dashboard"];
    if (adfPaths.some((path) => location.pathname === path || location.pathname.startsWith(`${path}/`)) && !window.ADFNavigate) {
      window.ADFNavigate = function (path) {
        const nextPath = keepDemoQuery(path);
        history.pushState({ adf: true, path }, "", nextPath);
        window.dispatchEvent(new CustomEvent("adf-route-change", { detail: { path } }));
      };
    }

    window.alert = function (message) {
      const copy = String(message || "").toLowerCase();
      showToast(copy.includes("maintenance") || copy.includes("submission")
        ? "Proposal sent successfully. We will contact you with the next step."
        : String(message || "Successfully completed."));
    };

    document.addEventListener("submit", (event) => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement)) return;
      const copy = (form.textContent || "").toLowerCase();
      if (!copy.includes("ktp") && !copy.includes("whatsapp") && !copy.includes("proposal") && !copy.includes("request")) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      showToast(copy.includes("proposal")
        ? "Proposal sent successfully. We will contact you with the next step."
        : "Successfully sent. Please check your email for the next step.");
    }, true);

    document.addEventListener("click", (event) => {
      const button = event.target.closest && event.target.closest("button");
      if (!button) return;
      const copy = (button.textContent || "").trim().toLowerCase();
      if (!copy.includes("kirim & lanjut") && !copy.includes("submit proposal")) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      showToast(copy.includes("proposal")
        ? "Proposal sent successfully. We will contact you with the next step."
        : "Successfully sent. Please check your email for the next step.");
    }, true);
  }
})();
