(function () {
  const blockedHosts = /(?:instagram\.com|upwork\.com|x\.com|twitter\.com|github\.com)/i;

  function toast(message) {
    if (window.portfolioDemoToast) window.portfolioDemoToast(message);
  }

  function clean(root) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const value = String(node.nodeValue || "");
      if (/projects@kreavityworks\.com/i.test(value)) node.nodeValue = value.replace(/projects@kreavityworks\.com/gi, "");
    }
    root.querySelectorAll?.('a[href]').forEach((link) => {
      if (!blockedHosts.test(link.href) || link.dataset.localGimmick) return;
      link.dataset.localGimmick = "true";
      link.removeAttribute("target");
      link.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        toast("Social profile preview selected.");
      }, true);
    });
    root.querySelectorAll?.("div").forEach((group) => {
      if (!group.classList.contains("gap-4") || !group.classList.contains("mt-8")) return;
      const directButtons = Array.from(group.children).filter((child) => child.tagName === "BUTTON");
      if (directButtons.length === 2) directButtons[1].style.display = "none";
    });
  }

  window.addEventListener("DOMContentLoaded", () => {
    clean(document.body);
    const observer = new MutationObserver((records) => records.forEach((record) =>
      record.addedNodes.forEach((node) => node.nodeType === Node.ELEMENT_NODE && clean(node))
    ));
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });

    document.addEventListener("submit", (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      toast("Your proposal was sent successfully. Check your email for the next step.");
    }, true);
  });
})();
