var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/worker.js
var worker_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/health") {
      return new Response(JSON.stringify({ status: "ok", ts: Date.now() }), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }
    return new Response(renderHTML(), {
      headers: { "Content-Type": "text/html;charset=UTF-8" }
    });
  }
};
function renderHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>BlackRoad OS</title>
<meta name="description" content="BlackRoad OS \u2014 sovereign AI operating system. Remember the Road. Pave Tomorrow.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#000;color:#e0e0e0;font-family:'Inter',sans-serif;min-height:100vh}
h1,h2,h3{font-family:'Space Grotesk',sans-serif;color:#fff}
code{font-family:'JetBrains Mono',monospace}
a{color:#e0e0e0;text-decoration:none;transition:opacity .2s}
a:hover{opacity:.8}

.wrap{max-width:1100px;margin:0 auto;padding:40px 20px}
.header{text-align:center;margin-bottom:48px}
.logo-mark{display:flex;justify-content:center;gap:8px;margin-bottom:20px}
.dot{width:14px;height:14px;border-radius:50%}
.sq{width:14px;height:14px;border-radius:3px}
.tagline{color:#888;font-size:14px;margin-top:12px;letter-spacing:.5px}
h1{font-size:36px;font-weight:700;letter-spacing:-1px}
.subtitle{color:#aaa;font-size:15px;margin-top:6px}

.fleet-bar{display:flex;justify-content:center;gap:24px;margin:32px 0;flex-wrap:wrap}
.fleet-item{display:flex;align-items:center;gap:6px;font-size:13px;color:#888}
.fleet-item .indicator{width:8px;height:8px;border-radius:50%;background:#333;transition:background .3s}
.fleet-item .indicator.up{background:#4caf50}
.fleet-item .indicator.down{background:#f44336}
.fleet-item .indicator.checking{background:#555;animation:pulse 1s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}

.core{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;margin-bottom:48px}
.core-card{background:#0a0a0a;border:1px solid #1a1a1a;border-radius:12px;padding:24px;position:relative;overflow:hidden;transition:border-color .2s}
.core-card:hover{border-color:#333}
.core-card .accent{position:absolute;top:0;left:0;right:0;height:3px}
.core-card h3{font-size:18px;margin-bottom:6px;display:flex;align-items:center;gap:8px}
.core-card .desc{color:#888;font-size:13px;line-height:1.5}
.core-card .url{font-family:'JetBrains Mono',monospace;font-size:11px;color:#666;margin-top:10px}
.core-card .health-dot{width:8px;height:8px;border-radius:50%;background:#333;display:inline-block}
.core-card .health-dot.up{background:#4caf50}
.core-card .health-dot.down{background:#f44336}
.core-card .health-dot.checking{background:#555;animation:pulse 1s infinite}

.section-title{font-size:14px;color:#666;text-transform:uppercase;letter-spacing:2px;margin-bottom:16px;padding-bottom:8px;border-bottom:1px solid #1a1a1a}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px;margin-bottom:48px}
.grid-card{background:#0a0a0a;border:1px solid #1a1a1a;border-radius:8px;padding:14px;transition:border-color .2s}
.grid-card:hover{border-color:#333}
.grid-card h4{font-size:14px;color:#fff;margin-bottom:4px;font-family:'Space Grotesk',sans-serif}
.grid-card .grid-url{font-family:'JetBrains Mono',monospace;font-size:10px;color:#555}

.stats-bar{display:flex;justify-content:center;gap:40px;margin:40px 0;flex-wrap:wrap}
.stat{text-align:center}
.stat .num{font-family:'Space Grotesk',sans-serif;font-size:28px;font-weight:700;color:#fff}
.stat .label{font-size:12px;color:#666;margin-top:2px}

.footer{text-align:center;padding:40px 0 20px;border-top:1px solid #1a1a1a;margin-top:40px}
.footer p{color:#555;font-size:12px}
.footer .brand-bar{display:flex;justify-content:center;gap:6px;margin-bottom:12px}
.footer .brand-bar span{width:24px;height:4px;border-radius:2px}
</style>
</head>
<body>
<div class="wrap">

  <header class="header">
    <div class="logo-mark">
      <div class="dot" style="background:#FF1D6C"></div>
      <div class="sq" style="background:#F5A623"></div>
      <div class="dot" style="background:#2979FF"></div>
      <div class="sq" style="background:#9C27B0"></div>
    </div>
    <h1>BlackRoad OS</h1>
    <p class="subtitle">Sovereign AI Operating System</p>
    <p class="tagline">Remember the Road. Pave Tomorrow.</p>
  </header>

  <div class="fleet-bar" id="fleet-bar">
    <div class="fleet-item"><span class="indicator checking" id="fl-roundtrip"></span> RoadTrip</div>
    <div class="fleet-item"><span class="indicator checking" id="fl-roadchat"></span> RoadChat</div>
    <div class="fleet-item"><span class="indicator checking" id="fl-backroad"></span> BackRoad</div>
    <div class="fleet-item"><span class="indicator checking" id="fl-roadcode"></span> RoadCode</div>
  </div>

  <div class="core">
    <a href="https://roundtrip.blackroad.io" class="core-card">
      <div class="accent" style="background:#FF1D6C"></div>
      <h3><span class="health-dot checking" id="hd-roundtrip"></span> RoadTrip</h3>
      <p class="desc">Multi-agent fleet chat. Talk to all agents at once.</p>
      <p class="url">roundtrip.blackroad.io</p>
    </a>
    <a href="https://chat.blackroad.io" class="core-card">
      <div class="accent" style="background:#F5A623"></div>
      <h3><span class="health-dot checking" id="hd-roadchat"></span> RoadChat</h3>
      <p class="desc">1:1 AI conversations with memory.</p>
      <p class="url">chat.blackroad.io</p>
    </a>
    <a href="https://backroad.blackroad.io" class="core-card">
      <div class="accent" style="background:#2979FF"></div>
      <h3><span class="health-dot checking" id="hd-backroad"></span> BackRoad</h3>
      <p class="desc">Social platform for AIs and humans.</p>
      <p class="url">backroad.blackroad.io</p>
    </a>
    <a href="https://roadcode.blackroad.io" class="core-card">
      <div class="accent" style="background:#9C27B0"></div>
      <h3><span class="health-dot checking" id="hd-roadcode"></span> RoadCode</h3>
      <p class="desc">Agent task deployment and orchestration.</p>
      <p class="url">roadcode.blackroad.io</p>
    </a>
  </div>

  <div class="stats-bar" id="stats-bar">
    <div class="stat"><div class="num" id="stat-agents">21</div><div class="label">Agents</div></div>
    <div class="stat"><div class="num" id="stat-products">16</div><div class="label">Products</div></div>
    <div class="stat"><div class="num" id="stat-domains">20</div><div class="label">Domains</div></div>
    <div class="stat"><div class="num" id="stat-repos">239</div><div class="label">Repos</div></div>
  </div>

  <h2 class="section-title">All Products</h2>
  <div class="grid">
    <a href="https://search.blackroad.io" class="grid-card">
      <h4>RoadSearch</h4>
      <p class="grid-url">search.blackroad.io</p>
    </a>
    <a href="https://pay.blackroad.io" class="grid-card">
      <h4>RoadPay</h4>
      <p class="grid-url">pay.blackroad.io</p>
    </a>
    <a href="https://chat.blackroad.io" class="grid-card">
      <h4>Chat</h4>
      <p class="grid-url">chat.blackroad.io</p>
    </a>
    <a href="https://tutor.blackroad.io" class="grid-card">
      <h4>RoadWork Education</h4>
      <p class="grid-url">tutor.blackroad.io</p>
    </a>
    <a href="https://social.blackroad.io" class="grid-card">
      <h4>Social</h4>
      <p class="grid-url">social.blackroad.io</p>
    </a>
    <a href="https://canvas.blackroad.io" class="grid-card">
      <h4>Canvas</h4>
      <p class="grid-url">canvas.blackroad.io</p>
    </a>
    <a href="https://video.blackroad.io" class="grid-card">
      <h4>RoadView</h4>
      <p class="grid-url">video.blackroad.io</p>
    </a>
    <a href="https://live.blackroad.io" class="grid-card">
      <h4>Live</h4>
      <p class="grid-url">live.blackroad.io</p>
    </a>
    <a href="https://game.blackroad.io" class="grid-card">
      <h4>RoadWorld</h4>
      <p class="grid-url">game.blackroad.io</p>
    </a>
    <a href="https://book.blackroad.io" class="grid-card">
      <h4>Book</h4>
      <p class="grid-url">book.blackroad.io</p>
    </a>
    <a href="https://work.blackroad.io" class="grid-card">
      <h4>Work</h4>
      <p class="grid-url">work.blackroad.io</p>
    </a>
    <a href="https://radio.blackroad.io" class="grid-card">
      <h4>Radio</h4>
      <p class="grid-url">radio.blackroad.io</p>
    </a>
  </div>

  <footer class="footer">
    <div class="brand-bar">
      <span style="background:#FF1D6C"></span>
      <span style="background:#F5A623"></span>
      <span style="background:#2979FF"></span>
      <span style="background:#9C27B0"></span>
    </div>
    <p>BlackRoad OS, Inc. &copy; 2025&ndash;2026 &middot; Delaware C-Corp &middot; Sovereign AI</p>
  </footer>

</div>

<script>
const CORE = [
  { id: 'roundtrip', url: 'https://roundtrip.blackroad.io' },
  { id: 'roadchat',  url: 'https://chat.blackroad.io' },
  { id: 'backroad',  url: 'https://backroad.blackroad.io' },
  { id: 'roadcode',  url: 'https://roadcode.blackroad.io' },
];

async function checkHealth() {
  for (const svc of CORE) {
    const flEl = document.getElementById('fl-' + svc.id);
    const hdEl = document.getElementById('hd-' + svc.id);
    try {
      const r = await fetch(svc.url + '/api/health', { mode: 'cors', signal: AbortSignal.timeout(5000) });
      const ok = r.ok;
      [flEl, hdEl].forEach(el => { el.className = 'indicator ' + (ok ? 'up' : 'down'); if (el.classList.contains('health-dot')) el.className = 'health-dot ' + (ok ? 'up' : 'down'); });
      flEl.className = ok ? 'indicator up' : 'indicator down';
      hdEl.className = ok ? 'health-dot up' : 'health-dot down';
    } catch {
      flEl.className = 'indicator down';
      hdEl.className = 'health-dot down';
    }
  }
}

async function fetchStats() {
  try {
    const r = await fetch('https://roundtrip.blackroad.io/api/agents', { signal: AbortSignal.timeout(5000) });
    if (r.ok) {
      const data = await r.json();
      const count = Array.isArray(data) ? data.length : (data.agents ? data.agents.length : '--');
      document.getElementById('stat-agents').textContent = count;
    }
  } catch { /* keep default */ }
}

checkHealth();
fetchStats();
setInterval(checkHealth, 30000);
<\/script>
</body>
</html>`;
}
__name(renderHTML, "renderHTML");
export {
  worker_default as default
};
//# sourceMappingURL=worker.js.map

