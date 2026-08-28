(() => {
  const services = {
    "service-makan-nanti": { label: "Pesan Makanan", href: "/demos/gaknyampe/makan-nanti.html?portfolioDemo=1" },
    "service-nebeng-dulu": { label: "GakNyampe", href: "/demos/gaknyampe/games/nebeng-dulu.html?portfolioDemo=1" },
    "service-paket-nyasar": { label: "Blok Nebeng", href: "/demos/gaknyampe/games/blok-nebeng.html?portfolioDemo=1" },
    "service-warung-gaib": { label: "Capit Tanding", href: "/demos/gaknyampe/games/capit-tanding.html?portfolioDemo=1" },
    "service-kopi-turu": { label: "Oyen Nebeng", href: "/demos/gaknyampe/games/oyen-nebeng.html?portfolioDemo=1" },
    "service-traktir": { label: "Traktir", href: "/demos/gaknyampe/traktir.html?portfolioDemo=1" },
    "service-isi-saldo": { label: "Isi Saldo", href: "/demos/gaknyampe/isi-saldo.html?portfolioDemo=1" },
    "service-semua-aja": { label: "SemuaAja", href: "/demos/gaknyampe/semua-aja.html?portfolioDemo=1" },
  };

  const go = (href) => {
    if (window.parent !== window) window.parent.postMessage({ type: "portfolio-route", href }, "*");
    window.location.href = href;
  };

  const wireServices = () => {
    Object.entries(services).forEach(([testId, service]) => {
      const card = document.querySelector(`[data-testid="${testId}"]`);
      if (!card || card.dataset.portfolioWired === "true") return;

      const label = Array.from(card.querySelectorAll("div")).find((node) =>
        node.childElementCount === 0 && node.textContent.trim()
      );
      if (label) label.textContent = service.label;

      card.dataset.portfolioWired = "true";
      card.classList.add("gn-service-card");
      card.setAttribute("role", "link");
      card.setAttribute("aria-label", `Open ${service.label}`);
      card.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        go(service.href);
      }, true);
      card.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        go(service.href);
      }, true);
    });
  };

  const copyMap = new Map([
    ["Semua ini simulasi", "Semua aktivitas dalam satu tempat"],
    ["Riwayat, saldo, pembayaran, traktiran, dan rasa kecewanya tidak memproses uang asli.", "Pantau pesanan, saldo, pembayaran, dan traktiran dari satu riwayat."],
    ["Tidak ada uang, voucher, makanan, atau hubungan perbankan asli yang diproses.", "Saldo, voucher, makanan, dan pembayaran tercatat otomatis di aktivitasmu."],
    ["SIMULASI", "READY"],
    ["Saldo boongan berkurang. Pertemanan semoga bertambah.", "Saldo diperbarui. Traktiran siap dibagikan."],
    ["BAYAR PAKAI SALDO BOONGAN", "BAYAR PAKAI SALDO IVI"],
    ["Semua pintu diuji. Beberapa pintu masih menunggu game kirimanmu.", "Pilih layanan, lanjutkan pesanan, atau masuk ke permainan favoritmu."],
    ["Simulasi dulu. Belum ada pembayaran asli yang diproses.", "Pembayaran belum tersedia untuk akun ini."],
    ["Tidak meminta kamera atau GPS. Hasilnya random dan bisa dijadikan alamat simulasi.", "Tidak memerlukan kamera atau GPS. Hasilnya acak dan dapat dipakai sebagai alamat tujuan."],
  ]);

  const polishCopy = (root = document.body) => {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      let value = node.nodeValue || "";
      copyMap.forEach((next, current) => { if (value.includes(current)) value = value.split(current).join(next); });
      value = value.replace(/saldo (boongan|halu)/gi, "saldo IVI").replace(/\bsimulasi\b/gi, "proses");
      if (value !== node.nodeValue) node.nodeValue = value;
    }
  };

  let appShell;
  let requestedDevice = null;
  const findAppShell = () => {
    if (appShell?.isConnected && appShell.querySelector('[data-testid^="service-"]')) return appShell;
    const firstService = document.querySelector('[data-testid^="service-"]');
    if (!firstService) return null;
    let current = firstService;
    let serviceShell = null;

    // The exported React Native markup does not expose a stable class for its
    // 500px application container. Resolve the outermost phone-width ancestor
    // from a stable service card instead, then keep the reference when desktop
    // mode expands it.
    while (current && current !== document.body) {
      const rect = current.getBoundingClientRect();
      if (rect.width >= 350 && rect.width <= 620 && rect.height >= 520) {
        serviceShell = current;
      }
      current = current.parentElement;
    }

    appShell = serviceShell;
    if (appShell) appShell.classList.add("gn-app-shell");
    return appShell;
  };
  const applyDevice = (device = requestedDevice) => {
    requestedDevice = device;
    document.body.classList.remove("portfolio-desktop");
    document.body.classList.add("portfolio-mobile");
    const shell = findAppShell();
    if (!shell) return;
    shell.style.setProperty("width", "100%", "important");
    shell.style.setProperty("max-width", "500px", "important");
    shell.style.setProperty("margin-inline", "auto", "important");
  };

  const style = document.createElement("style");
  style.textContent = `
    html,body,#root{width:100%;min-height:100%;overflow-x:hidden}
    body{margin:0;background:#e8efeb}
    .gn-app-shell{width:100%!important;max-width:500px!important;margin-inline:auto!important;transition:box-shadow .28s ease;box-shadow:0 0 48px rgba(15,35,29,.11)!important}
    .gn-service-card{overflow:visible!important;border-radius:28px!important;isolation:isolate;transition:transform .2s ease,box-shadow .2s ease}
    .gn-service-card:hover{transform:translateY(-3px);box-shadow:0 14px 30px rgba(16,32,27,.12)}
    .gn-service-card>div:first-child{width:88px!important;height:88px!important;aspect-ratio:1!important;flex:none!important;padding:8px!important;border-radius:50%!important;background:linear-gradient(145deg,#fff,#eef6f1)!important;box-shadow:inset 0 0 0 1px rgba(24,61,48,.08),0 10px 24px rgba(26,61,48,.08)!important;overflow:hidden!important}
    .gn-service-card>div:first-child>div,.gn-service-card>div:first-child>div>div,.gn-service-card img,.gn-service-card [style*="background-image"]{width:100%!important;height:100%!important;aspect-ratio:1!important;border-radius:50%!important;overflow:hidden!important;background-size:contain!important;background-position:center!important}
    @media(max-width:520px){.gn-service-card{border-radius:22px!important}.gn-service-card>div:first-child{width:74px!important;height:74px!important;padding:6px!important}}
    @media(prefers-reduced-motion:reduce){.gn-app-shell,.gn-service-card{transition:none}.gn-service-card:hover{transform:none}}
  `;
  document.head.appendChild(style);
  const ensureStyle = () => {
    if (!style.isConnected) document.head.appendChild(style);
  };

  let queued=false;
  const observer = new MutationObserver((records) => {
    records.forEach((record) => record.addedNodes.forEach((node) => node.nodeType === Node.ELEMENT_NODE && polishCopy(node)));
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{queued=false;ensureStyle();wireServices();applyDevice();});
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener("message", (event) => event.data?.type === "portfolio-device" && applyDevice(event.data.device));
  window.addEventListener("DOMContentLoaded", () => {
    ensureStyle();
    wireServices();
    polishCopy();
    applyDevice();
    if (window.parent !== window) window.parent.postMessage({ type: "portfolio-route", href: `${location.pathname}${location.search}${location.hash}` }, "*");
  }, { once: true });
  window.setTimeout(() => { ensureStyle(); wireServices(); polishCopy(); applyDevice(); }, 400);
  window.setTimeout(() => { ensureStyle(); wireServices(); applyDevice(); }, 1200);
  let stabilityPass = 0;
  const stabilityTimer = window.setInterval(() => {
    ensureStyle();
    wireServices();
    applyDevice();
    stabilityPass += 1;
    if (stabilityPass >= 24) window.clearInterval(stabilityTimer);
  }, 250);
})();
