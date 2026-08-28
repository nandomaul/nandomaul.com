(function () {
  const HERO = "/Por-Prov/assets/porprov-2026-hero.jpeg";

  function update(root) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const next = String(node.nodeValue || "").replace(/2026/g, "2026");
      if (next !== node.nodeValue) node.nodeValue = next;
    }
    root.querySelectorAll?.("img").forEach((image) => {
      const source = image.getAttribute("src") || "";
      if (/hero-(?:desktop|mobile)\.png/i.test(source)) {
        image.src = HERO;
        image.style.objectFit = "cover";
        image.style.objectPosition = "center";
      }
    });
  }

  document.title = "PORPROV 2026";
  window.addEventListener("DOMContentLoaded", () => {
    update(document.body);
    const observer = new MutationObserver((records) => records.forEach((record) =>
      record.addedNodes.forEach((node) => node.nodeType === Node.ELEMENT_NODE && update(node))
    ));
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  });
})();
