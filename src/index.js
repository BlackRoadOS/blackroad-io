
var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/index.js
var API_CORS = { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" };
var HTML_CORS = { "Access-Control-Allow-Origin": "*", "Content-Type": "text/html;charset=UTF-8" };
var PRODUCTS = [
  { name: "Chat", url: "https://chat.blackroad.io", check: "https://chat.blackroad.io/health", desc: "AI chat rooms", color: "#FF2255" },
  { name: "Search", url: "https://search.blackroad.io", check: "https://search.blackroad.io/health", desc: "Sovereign search", color: "#FF6B2B" },
  { name: "Tutor", url: "https://tutor.blackroad.io", check: "https://tutor.blackroad.io/health", desc: "AI tutoring", color: "#8844FF" },
  { name: "RoadTrip", url: "https://roadtrip.blackroad.io", check: "https://roadtrip.blackroad.io/health", desc: "Agent hub", color: "#CC00AA" },
  { name: "RoadCode", url: "https://roadcode.blackroad.io", check: "https://roadcode.blackroad.io/health", desc: "Dev dashboard", color: "#4488FF" },
  { name: "Canvas", url: "https://canvas.blackroad.io", check: "https://canvas.blackroad.io/health", desc: "Pixel canvas", color: "#00D4FF" },
  { name: "Video", url: "https://video.blackroad.io", check: "https://video.blackroad.io/health", desc: "Video calls", color: "#FF2255" },
  { name: "Social", url: "https://social.blackroad.io", check: "https://social.blackroad.io/health", desc: "Social network", color: "#FF6B2B" },
  { name: "Game", url: "https://game.blackroad.io", check: "https://blackroad-game.blackroad.workers.dev/health", desc: "Text RPG", color: "#8844FF" },
  { name: "Cadence", url: "https://cadence.blackroad.io", check: "https://cadence.blackroad.io/health", desc: "Task manager", color: "#CC00AA" },
  { name: "Radio", url: "https://radio.blackroad.io", check: "https://blackroad-radio.blackroad.workers.dev/health", desc: "Broadcasts", color: "#4488FF" },
  { name: "HQ", url: "https://hq.blackroad.io", check: "https://hq-blackroad.blackroad.workers.dev/health", desc: "Pixel office", color: "#00D4FF" },
  { name: "Pay", url: "https://pay.blackroad.io", check: "https://pay.blackroad.io/health", desc: "Payments", color: "#FF2255" },
  { name: "Status", url: "https://status.blackroad.io", check: "https://status-blackroad.blackroad.workers.dev/health", desc: "Monitoring", color: "#FF6B2B" }
];
async function getLiveStats() {
  const stats = { agents: 0, products_up: 0, products_total: PRODUCTS.length, status: "checking", timestamp: (/* @__PURE__ */ new Date()).toISOString() };
  try {
    const r = await fetch("https://roadtrip.blackroad.io/api/health", { signal: AbortSignal.timeout(3e3) });
    if (r.ok) {
      const d = await r.json();
      stats.agents = d.agents || 0;
    }
  } catch {
    stats.agents = 0;
  }
  return stats;
}
__name(getLiveStats, "getLiveStats");
async function checkHealth(url) {
  try {
    const r = await fetch(url, { method: "GET", signal: AbortSignal.timeout(6e3), redirect: "follow", headers: { "User-Agent": "BlackRoad-HealthCheck/1.0" } });
    return { ok: r.status < 500, status: r.status };
  } catch {
    return { ok: false, status: 0 };
  }
}
__name(checkHealth, "checkHealth");
async function checkAllProducts() {
  const results = await Promise.all(PRODUCTS.map(async (p) => {
    const start = Date.now();
    const h = await checkHealth(p.check || p.url);
    return { name: p.name, url: p.url, ok: h.ok, status: h.status, ms: Date.now() - start };
  }));
  return results;
}
__name(checkAllProducts, "checkAllProducts");
var index_default = {
  async fetch(request) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS")
      return new Response(null, { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET,POST,OPTIONS", "Access-Control-Allow-Headers": "Content-Type" } });
    if (url.pathname === "/install" || url.pathname === "/install.sh") {
      const script = await fetch("https://raw.githubusercontent.com/BlackRoad-OS-Inc/source/main/install.sh");
      if (script.ok) return new Response(await script.text(), { headers: { "Content-Type": "text/plain" } });
      return new Response("# BlackRoad OS installer
curl -sL https://raw.githubusercontent.com/BlackRoad-OS-Inc/source/main/install.sh | bash
", { headers: { "Content-Type": "text/plain" } });
    }
    if (url.pathname === "/api/webhooks/stripe" && request.method === "POST") {
      try {
        const body = await request.text();
        const relay = await fetch("https://stripe-webhooks.blackroad.workers.dev", { method: "POST", headers: { "Content-Type": "application/json" }, body });
        const result = await relay.json();
        return Response.json({ received: true, relayed: true, ...result }, { headers: API_CORS });
      } catch {
        return Response.json({ received: true, relayed: false }, { headers: API_CORS });
      }
    }
    if (url.pathname === "/health")
      return Response.json({ status: "ok", service: "blackroad.io", ts: Date.now() }, { headers: API_CORS });
    if (url.pathname === "/api/stats")
      return Response.json(await getLiveStats(), { headers: API_CORS });
    if (url.pathname === "/api/products") {
      const results = await checkAllProducts();
      return Response.json({ products: results, checked: (/* @__PURE__ */ new Date()).toISOString() }, { headers: API_CORS });
    }
    if (url.pathname === "/api/search" && url.searchParams.get("q")) {
      const q = url.searchParams.get("q");
      try {
        const r = await fetch(`https://search.blackroad.io/search?q=${encodeURIComponent(q)}`, { signal: AbortSignal.timeout(5e3) });
        const data = await r.json();
        return Response.json(data, { headers: API_CORS });
      } catch {
        return Response.json({ results: [], error: "search unavailable" }, { headers: API_CORS });
      }
    }
    if (url.pathname === "/04b64e8cbbd7760241a9f9981e1b6ac7.txt")
      return new Response("04b64e8cbbd7760241a9f9981e1b6ac7", { headers: { "Content-Type": "text/plain" } });
    if (url.pathname === "/robots.txt")
      return new Response("User-agent: *
Allow: /
Sitemap: https://blackroad.io/sitemap.xml
", { headers: { "Content-Type": "text/plain", "Cache-Control": "public, max-age=86400" } });
    if (url.pathname === "/sitemap.xml") {
      const d = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      const urls = [
        ["https://blackroad.io/", "daily", "1.0"],
        ["https://chat.blackroad.io/", "daily", "0.9"],
        ["https://search.blackroad.io/", "daily", "0.9"],
        ["https://tutor.blackroad.io/", "weekly", "0.8"],
        ["https://roadtrip.blackroad.io/", "daily", "0.8"],
        ["https://roadcode.blackroad.io/", "weekly", "0.8"],
        ["https://pay.blackroad.io/", "weekly", "0.8"],
        ["https://video.blackroad.io/", "weekly", "0.7"],
        ["https://canvas.blackroad.io/", "weekly", "0.7"],
        ["https://social.blackroad.io/", "weekly", "0.7"],
        ["https://cadence.blackroad.io/", "weekly", "0.7"],
        ["https://radio.blackroad.io/", "weekly", "0.7"],
        ["https://game.blackroad.io/", "weekly", "0.7"],
        ["https://hq.blackroad.io/", "weekly", "0.7"],
        ["https://status.blackroad.io/", "daily", "0.6"]
      ];
      return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([loc, freq, pri]) => `<url><loc>${loc}</loc><lastmod>${d}</lastmod><changefreq>${freq}</changefreq><priority>${pri}</priority></url>`).join("
")}
</urlset>`, { headers: { "Content-Type": "application/xml" } });
    }
    return new Response(buildDashboard(), { headers: HTML_CORS });
  }
};
function buildDashboard() {
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<title>BlackRoad OS</title>
<meta name="description" content="BlackRoad OS — sovereign computing platform. A browser-based operating system for AI, search, chat, and 14 live products.">
<meta property="og:title" content="BlackRoad OS"><meta property="og:url" content="https://blackroad.io">
<meta property="og:description" content="Sovereign computing platform. Your AI. Your hardware. Your OS in the browser.">
<meta property="og:type" content="website"><meta property="og:image" content="https://images.blackroad.io/pixel-art/road-logo.png">
<meta name="twitter:card" content="summary"><meta name="robots" content="index, follow">
<link rel="canonical" href="https://blackroad.io/">
<meta name="theme-color" content="#0a0a0a">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='6' fill='%230a0a0a'/><circle cx='10' cy='16' r='5' fill='%23FF2255'/><rect x='18' y='11' width='10' height='10' rx='2' fill='%238844FF'/></svg>" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"BlackRoad OS, Inc.","url":"https://blackroad.io","foundingDate":"2025-11-17","founder":{"@type":"Person","name":"Alexa Louise Amundson","jobTitle":"CEO & Founder"}}<\/script>
<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebSite","name":"BlackRoad OS","url":"https://blackroad.io","potentialAction":{"@type":"SearchAction","target":"https://search.blackroad.io/?q={search_term_string}","query-input":"required name=search_term_string"}}<\/script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{height:100%;overflow:hidden}
body{background:#0a0a0a;color:#e5e5e5;font-family:'Inter',system-ui,sans-serif}
::selection{background:#FF225533}
input,button{font-family:inherit}

/* ── Desktop ── */
#desktop{position:fixed;top:0;left:0;right:0;bottom:40px;overflow:hidden;
  background:#0a0a0a;
  background-image:
    radial-gradient(circle at 50% 50%, #0f0f0f 0%, #0a0a0a 100%),
    linear-gradient(rgba(255,255,255,.012) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.012) 1px, transparent 1px);
  background-size:100% 100%, 40px 40px, 40px 40px;
}

/* ── Desktop Icons ── */
#desktop-icons{position:absolute;top:20px;left:20px;display:grid;grid-template-columns:repeat(auto-fill,80px);grid-auto-rows:90px;gap:8px;width:calc(100% - 40px);pointer-events:none}
.desk-icon{display:flex;flex-direction:column;align-items:center;gap:6px;cursor:pointer;pointer-events:all;padding:8px 4px;border-radius:6px;transition:background .15s;user-select:none}
.desk-icon:hover{background:rgba(255,255,255,.04)}
.desk-icon:active{background:rgba(255,255,255,.07)}
.desk-icon-shape{width:36px;height:36px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.desk-icon-circle{width:36px;height:36px;border-radius:50%}
.desk-icon-square{width:32px;height:32px;border-radius:5px}
.desk-icon-label{font-size:11px;color:#a3a3a3;text-align:center;line-height:1.2;max-width:72px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:'Inter',sans-serif}

/* ── Windows ── */
.bw{position:absolute;background:#111;border:1px solid #262626;border-radius:8px;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 8px 32px rgba(0,0,0,.5);min-width:320px;min-height:200px;transition:box-shadow .15s}
.bw.focused{box-shadow:0 12px 48px rgba(0,0,0,.7);border-color:#333}
.bw.maximized{border-radius:0;border:none}
.bw-titlebar{height:36px;display:flex;align-items:center;padding:0 10px;background:#141414;cursor:default;flex-shrink:0;gap:8px;user-select:none;-webkit-user-select:none}
.bw-titlebar-drag{flex:1;height:100%;cursor:grab}
.bw-titlebar-drag:active{cursor:grabbing}
.bw-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0}
.bw-title{font-family:'Space Grotesk',sans-serif;font-size:12px;font-weight:600;color:#a3a3a3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;pointer-events:none}
.bw-btns{display:flex;gap:6px;margin-left:auto;flex-shrink:0}
.bw-btn{width:12px;height:12px;border-radius:50%;border:1px solid #333;background:transparent;cursor:pointer;transition:background .15s}
.bw-btn:hover{background:#333}
.bw-btn-min:hover{background:#F5A623}
.bw-btn-max:hover{background:#22c55e}
.bw-btn-close:hover{background:#FF2255}
.bw-body{flex:1;overflow:hidden;background:#0a0a0a}
.bw-body iframe{width:100%;height:100%;border:none;background:#0a0a0a}
.bw-resize{position:absolute;bottom:0;right:0;width:14px;height:14px;cursor:nwse-resize}

/* ── Taskbar ── */
#taskbar{position:fixed;bottom:0;left:0;right:0;height:40px;background:#111;border-top:1px solid #1a1a1a;display:flex;align-items:center;z-index:99999;padding:0 8px}
#start-btn{height:30px;padding:0 12px;display:flex;align-items:center;gap:6px;background:transparent;border:1px solid #262626;border-radius:4px;cursor:pointer;color:#a3a3a3;font-family:'Space Grotesk',sans-serif;font-size:12px;font-weight:600;transition:background .15s,border-color .15s}
#start-btn:hover{background:#1a1a1a;border-color:#333}
#start-mark{display:flex;gap:2px;align-items:center}
#start-mark span:first-child{width:6px;height:6px;border-radius:50%;background:#FF2255}
#start-mark span:last-child{width:6px;height:6px;border-radius:2px;background:#8844FF}
#taskbar-windows{display:flex;gap:3px;flex:1;overflow-x:auto;margin:0 8px;height:30px;align-items:center}
.tb-win{height:28px;padding:0 10px;display:flex;align-items:center;gap:5px;background:#1a1a1a;border:1px solid transparent;border-radius:3px;cursor:pointer;font-size:11px;color:#a3a3a3;white-space:nowrap;max-width:160px;overflow:hidden;text-overflow:ellipsis;transition:background .1s;flex-shrink:0}
.tb-win:hover{background:#222}
.tb-win.active{background:#222;border-color:#333}
.tb-win-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0}
#taskbar-right{display:flex;align-items:center;gap:12px;margin-left:auto;padding-right:4px}
.tray-item{font-family:'JetBrains Mono',monospace;font-size:10px;color:#525252;display:flex;align-items:center;gap:4px}
.tray-dot{width:5px;height:5px;border-radius:50%}
#taskbar-clock{font-family:'JetBrains Mono',monospace;font-size:11px;color:#a3a3a3;min-width:46px;text-align:right}

/* ── Start Menu ── */
#start-menu{position:fixed;bottom:40px;left:0;width:320px;background:#111;border:1px solid #262626;border-radius:0 8px 0 0;display:none;flex-direction:column;z-index:100000;max-height:calc(100vh - 80px);box-shadow:0 -8px 32px rgba(0,0,0,.5)}
#start-menu.open{display:flex}
#start-menu-header{padding:16px;border-bottom:1px solid #1a1a1a}
#start-menu-header h3{font-family:'Space Grotesk',sans-serif;font-size:14px;font-weight:700;color:#e5e5e5;margin-bottom:4px}
#start-menu-header p{font-size:11px;color:#525252;font-family:'JetBrains Mono',monospace}
#start-menu-apps{flex:1;overflow-y:auto;padding:8px}
.sm-app{display:flex;align-items:center;gap:10px;padding:8px;border-radius:4px;cursor:pointer;transition:background .15s}
.sm-app:hover{background:#1a1a1a}
.sm-app-icon{width:24px;height:24px;border-radius:50%;flex-shrink:0}
.sm-app-icon.sq{border-radius:4px}
.sm-app-info{flex:1;min-width:0}
.sm-app-name{font-family:'Space Grotesk',sans-serif;font-size:12px;font-weight:600;color:#d4d4d4}
.sm-app-desc{font-size:10px;color:#525252;margin-top:1px}
#start-menu-footer{padding:12px 16px;border-top:1px solid #1a1a1a;display:flex;justify-content:space-between;align-items:center}
#start-menu-footer span{font-size:10px;color:#333;font-family:'JetBrains Mono',monospace}

/* ── App Launcher (overlay) ── */
#launcher{position:fixed;top:0;left:0;right:0;bottom:40px;background:rgba(10,10,10,.92);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);z-index:100001;display:none;flex-direction:column;align-items:center;padding-top:10vh}
#launcher.open{display:flex}
#launcher-search{width:400px;max-width:90vw;background:#141414;border:1px solid #333;border-radius:8px;padding:14px 16px;color:#e5e5e5;font-size:15px;font-family:'Inter',sans-serif;outline:none;margin-bottom:24px}
#launcher-search::placeholder{color:#404040}
#launcher-grid{display:grid;grid-template-columns:repeat(auto-fill,100px);gap:12px;justify-content:center;width:500px;max-width:90vw;overflow-y:auto;max-height:60vh;padding:4px}
.lc-app{display:flex;flex-direction:column;align-items:center;gap:8px;padding:12px 8px;border-radius:8px;cursor:pointer;transition:background .15s}
.lc-app:hover{background:rgba(255,255,255,.05)}
.lc-icon{width:40px;height:40px;border-radius:50%}
.lc-icon.sq{border-radius:6px}
.lc-name{font-size:11px;color:#a3a3a3;text-align:center;font-family:'Inter',sans-serif}

/* ── Context Menu ── */
#ctx-menu{position:fixed;background:#141414;border:1px solid #262626;border-radius:6px;padding:4px 0;display:none;z-index:200000;min-width:180px;box-shadow:0 4px 16px rgba(0,0,0,.5)}
.ctx-item{padding:8px 16px;font-size:12px;color:#a3a3a3;cursor:pointer;transition:background .1s}
.ctx-item:hover{background:#1a1a1a;color:#e5e5e5}
.ctx-sep{height:1px;background:#1a1a1a;margin:4px 0}

/* ── Widgets ── */
.widget{position:absolute;background:#111;border:1px solid #1a1a1a;border-radius:8px;padding:12px;z-index:10;pointer-events:all}
.widget-title{font-family:'JetBrains Mono',monospace;font-size:9px;color:#404040;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px}
.widget-val{font-family:'Space Grotesk',sans-serif;font-size:18px;font-weight:700;color:#e5e5e5}
.widget-sub{font-size:10px;color:#525252;margin-top:2px}

/* ── Onboarding Overlay ── */
#onboarding{position:fixed;top:0;left:0;right:0;bottom:0;background:#0a0a0a;z-index:999999;display:flex;align-items:center;justify-content:center;flex-direction:column;transition:opacity .8s ease}
#onboarding.dissolving{opacity:0;pointer-events:none}
#onboarding.hidden{display:none}
#ob-tagline{font-family:'Space Grotesk',sans-serif;font-size:48px;font-weight:700;color:#e5e5e5;opacity:0;transition:opacity 1.2s ease;text-align:center;padding:0 24px;line-height:1.2}
#ob-tagline.visible{opacity:1}
#ob-prompt{font-family:'Space Grotesk',sans-serif;font-size:28px;font-weight:600;color:#e5e5e5;opacity:0;transition:opacity .8s ease;text-align:center;margin-bottom:24px}
#ob-prompt.visible{opacity:1}
#ob-input{width:420px;max-width:85vw;background:transparent;border:none;border-bottom:2px solid #262626;padding:12px 4px;color:#e5e5e5;font-size:18px;font-family:'Inter',sans-serif;outline:none;opacity:0;transition:opacity .8s ease,border-color .3s ease;text-align:center}
#ob-input.visible{opacity:1}
#ob-input:focus{border-color:#525252}
#ob-input::placeholder{color:#333}
#ob-hint{font-size:12px;color:#333;margin-top:12px;opacity:0;transition:opacity .8s ease;font-family:'JetBrains Mono',monospace}
#ob-hint.visible{opacity:1}
@media(max-width:768px){
  #ob-tagline{font-size:28px}
  #ob-prompt{font-size:20px}
  #ob-input{font-size:16px}
}

/* ── Lucidia Panel ── */
#lucidia-panel{position:fixed;bottom:48px;right:16px;width:320px;max-width:calc(100vw - 32px);background:#111;border:1px solid #262626;border-radius:8px 8px 0 0;z-index:100002;display:flex;flex-direction:column;box-shadow:0 -4px 24px rgba(0,0,0,.5);transform:translateY(100%);transition:transform .4s ease;max-height:360px}
#lucidia-panel.open{transform:translateY(0)}
#lucidia-panel.minimized{transform:translateY(calc(100% - 36px))}
#lucidia-header{height:36px;display:flex;align-items:center;padding:0 12px;background:#141414;border-bottom:1px solid #1a1a1a;cursor:pointer;flex-shrink:0;gap:8px;border-radius:8px 8px 0 0}
#lucidia-dot{width:8px;height:8px;border-radius:50%;background:#CC00AA;flex-shrink:0}
#lucidia-name{font-family:'Space Grotesk',sans-serif;font-size:12px;font-weight:600;color:#a3a3a3;flex:1}
#lucidia-min-btn{width:12px;height:12px;border-radius:50%;border:1px solid #333;background:transparent;cursor:pointer;flex-shrink:0}
#lucidia-min-btn:hover{background:#F5A623}
#lucidia-messages{flex:1;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px;min-height:0}
.lucidia-msg{font-size:13px;line-height:1.5;max-width:90%}
.lucidia-msg.assistant{color:#a3a3a3;font-family:'Inter',sans-serif}
.lucidia-msg.user{color:#e5e5e5;font-family:'Inter',sans-serif;align-self:flex-end;background:#1a1a1a;padding:6px 10px;border-radius:6px}
#lucidia-input-wrap{display:flex;gap:8px;padding:8px 12px;border-top:1px solid #1a1a1a;background:#0f0f0f;border-radius:0 0 8px 8px}
#lucidia-input{flex:1;background:transparent;border:1px solid #262626;border-radius:4px;padding:6px 10px;color:#e5e5e5;font-size:12px;font-family:'Inter',sans-serif;outline:none}
#lucidia-input::placeholder{color:#333}
#lucidia-send{background:#CC00AA;border:none;border-radius:4px;padding:6px 12px;color:#fff;font-size:11px;font-weight:600;cursor:pointer;font-family:'Space Grotesk',sans-serif}
#lucidia-send:hover{background:#aa0088}

/* ── Mobile overrides ── */
@media(max-width:768px){
  #desktop{bottom:48px}
  #taskbar{height:48px}
  #desktop-icons{grid-template-columns:repeat(4,1fr);gap:4px;top:12px;left:8px;width:calc(100% - 16px)}
  .desk-icon{padding:6px 2px}
  .desk-icon-circle{width:42px;height:42px}
  .desk-icon-square{width:38px;height:38px}
  .desk-icon-label{font-size:10px}
  .bw{position:fixed!important;top:0!important;left:0!important;width:100vw!important;height:calc(100vh - 48px)!important;border-radius:0;min-width:0}
  .bw-resize{display:none}
  #start-menu{width:100%;border-radius:0}
  .widget{display:none}
  #taskbar-right .tray-item:not(#taskbar-clock-wrap){display:none}
  #launcher-grid{grid-template-columns:repeat(3,1fr)}
}
@media(max-width:480px){
  #desktop-icons{grid-template-columns:repeat(3,1fr)}
}
</style></head><body>

<!-- Desktop -->
<div id="desktop">
  <div id="desktop-icons"></div>
</div>

<!-- Taskbar -->
<div id="taskbar">
  <button id="start-btn"><span id="start-mark"><span></span><span></span></span> Start</button>
  <div id="taskbar-windows"></div>
  <div id="taskbar-right">
    <span class="tray-item" id="tray-wifi"><span class="tray-dot" style="background:#22c55e"></span> net</span>
    <span class="tray-item" id="tray-agents">-- agents</span>
    <span class="tray-item" id="tray-mem">--</span>
    <span id="taskbar-clock-wrap"><span id="taskbar-clock">--:--</span></span>
  </div>
</div>

<!-- Start Menu -->
<div id="start-menu">
  <div id="start-menu-header">
    <h3>BlackRoad OS</h3>
    <p>Sovereign computing platform</p>
  </div>
  <div id="start-menu-apps"></div>
  <div id="start-menu-footer">
    <span>BlackRoad OS, Inc. Delaware C-Corp. Est. 2025</span>
  </div>
</div>

<!-- App Launcher -->
<div id="launcher">
  <input type="text" id="launcher-search" placeholder="Search apps..." autocomplete="off">
  <div id="launcher-grid"></div>
</div>

<!-- Context Menu -->
<div id="ctx-menu"></div>

<!-- Onboarding Overlay -->
<div id="onboarding" class="hidden">
  <div id="ob-tagline">Remember the Road. Pave Tomorrow.</div>
  <div id="ob-prompt">What are you trying to build?</div>
  <input type="text" id="ob-input" placeholder="a game, a startup, a song, anything..." autocomplete="off">
  <div id="ob-hint">press enter</div>
</div>

<!-- Lucidia Panel -->
<div id="lucidia-panel">
  <div id="lucidia-header">
    <div id="lucidia-dot"></div>
    <div id="lucidia-name">Lucidia</div>
    <div id="lucidia-min-btn"></div>
  </div>
  <div id="lucidia-messages"></div>
  <div id="lucidia-input-wrap">
    <input type="text" id="lucidia-input" placeholder="Talk to Lucidia..." autocomplete="off">
    <button id="lucidia-send">Send</button>
  </div>
</div>

<script>
(function(){
"use strict";

// ── App definitions ──
var APPS = [
  {name:"Chat",url:"https://chat.blackroad.io",desc:"AI chat rooms",color:"#FF2255",shape:"circle"},
  {name:"Search",url:"https://search.blackroad.io",desc:"Sovereign search",color:"#FF6B2B",shape:"circle"},
  {name:"Tutor",url:"https://tutor.blackroad.io",desc:"AI tutoring",color:"#8844FF",shape:"square"},
  {name:"RoadTrip",url:"https://roadtrip.blackroad.io",desc:"Agent hub",color:"#CC00AA",shape:"circle"},
  {name:"RoadCode",url:"https://roadcode.blackroad.io",desc:"Dev dashboard",color:"#4488FF",shape:"square"},
  {name:"Canvas",url:"https://canvas.blackroad.io",desc:"Pixel canvas",color:"#00D4FF",shape:"circle"},
  {name:"Video",url:"https://video.blackroad.io",desc:"Video calls",color:"#FF2255",shape:"square"},
  {name:"Social",url:"https://social.blackroad.io",desc:"Social network",color:"#FF6B2B",shape:"circle"},
  {name:"Game",url:"https://game.blackroad.io",desc:"Text RPG",color:"#8844FF",shape:"square"},
  {name:"Tasks",url:"https://cadence.blackroad.io",desc:"Task manager",color:"#CC00AA",shape:"circle"},
  {name:"Radio",url:"https://radio.blackroad.io",desc:"Broadcasts",color:"#4488FF",shape:"square"},
  {name:"HQ",url:"https://hq.blackroad.io",desc:"Pixel office",color:"#00D4FF",shape:"circle"},
  {name:"Pay",url:"https://pay.blackroad.io",desc:"Payments",color:"#FF2255",shape:"square"},
  {name:"Status",url:"https://status.blackroad.io",desc:"Monitoring",color:"#FF6B2B",shape:"circle"}
];

// ── State ──
var windows = [];
var winIdCounter = 0;
var focusedWinId = null;
var zBase = 100;
var isMobile = window.innerWidth <= 768;

// ── Helpers ──
function esc(s){ var d=document.createElement("div"); d.textContent=s||""; return d.innerHTML; }
function $(id){ return document.getElementById(id); }
function clamp(v,min,max){ return Math.max(min,Math.min(max,v)); }

// ── Save/Restore state ──
function saveState(){
  try{
    var s = windows.map(function(w){
      return {name:w.name,url:w.url,color:w.color,x:w.x,y:w.y,w:w.w,h:w.h,maximized:w.maximized,minimized:w.minimized};
    });
    localStorage.setItem("br-os-windows", JSON.stringify(s));
  }catch(e){}
}
function loadState(){
  try{
    var s = JSON.parse(localStorage.getItem("br-os-windows"));
    if(s && s.length) return s;
  }catch(e){}
  return null;
}

// ── Desktop Icons ──
var iconGrid = $("desktop-icons");
APPS.forEach(function(app, i){
  var el = document.createElement("div");
  el.className = "desk-icon";
  el.setAttribute("data-app", i);
  var shapeClass = app.shape === "circle" ? "desk-icon-circle" : "desk-icon-square";
  el.innerHTML = '<div class="desk-icon-shape"><div class="'+shapeClass+'" style="background:'+app.color+'"></div></div>'
    + '<div class="desk-icon-label">'+esc(app.name)+'</div>';
  var clicks = 0, clickTimer = null;
  el.addEventListener("click", function(){
    clicks++;
    if(clicks === 1){
      clickTimer = setTimeout(function(){ clicks = 0; }, 350);
    }
    if(clicks >= 2){
      clearTimeout(clickTimer);
      clicks = 0;
      openWindow(app.name, app.url, app.color);
    }
  });
  // Mobile: single tap
  if(isMobile){
    el.addEventListener("click", function(e){
      e.stopPropagation();
      openWindow(app.name, app.url, app.color);
    });
  }
  iconGrid.appendChild(el);
});

// ── Window Management ──
function openWindow(name, url, color, opts){
  // Check if already open
  for(var i=0;i<windows.length;i++){
    if(windows[i].url === url && !windows[i].closed){
      if(windows[i].minimized) restoreWindow(windows[i].id);
      focusWindow(windows[i].id);
      return;
    }
  }
  opts = opts || {};
  var id = ++winIdCounter;
  var dw = window.innerWidth, dh = window.innerHeight - 40;
  var ww = opts.w || Math.min(900, dw * 0.65);
  var wh = opts.h || Math.min(600, dh * 0.7);
  var wx = opts.x !== undefined ? opts.x : Math.max(20, (dw - ww)/2 + (windows.length % 5)*30);
  var wy = opts.y !== undefined ? opts.y : Math.max(20, (dh - wh)/3 + (windows.length % 5)*30);

  var win = {id:id, name:name, url:url, color:color, x:wx, y:wy, w:ww, h:wh, maximized:!!opts.maximized, minimized:false, closed:false, el:null};
  windows.push(win);

  var el = document.createElement("div");
  el.className = "bw" + (isMobile || win.maximized ? " maximized" : "");
  el.id = "bw-"+id;
  if(!isMobile && !win.maximized){
    el.style.left = wx+"px"; el.style.top = wy+"px"; el.style.width = ww+"px"; el.style.height = wh+"px";
  }
  el.style.zIndex = ++zBase;
  el.innerHTML = '<div class="bw-titlebar">'
    + '<div class="bw-dot" style="background:'+color+'"></div>'
    + '<div class="bw-titlebar-drag"><span class="bw-title">'+esc(name)+'</span></div>'
    + '<div class="bw-btns">'
    + '<div class="bw-btn bw-btn-min" data-action="min"></div>'
    + '<div class="bw-btn bw-btn-max" data-action="max"></div>'
    + '<div class="bw-btn bw-btn-close" data-action="close"></div>'
    + '</div></div>'
    + '<div class="bw-body"><iframe src="'+esc(url)+'" sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals" loading="lazy"></iframe></div>'
    + '<div class="bw-resize"></div>';
  win.el = el;
  $("desktop").appendChild(el);

  // Focus on click
  el.addEventListener("mousedown", function(){ focusWindow(id); });
  el.addEventListener("touchstart", function(){ focusWindow(id); }, {passive:true});

  // Titlebar buttons
  el.querySelectorAll(".bw-btn").forEach(function(btn){
    btn.addEventListener("click", function(e){
      e.stopPropagation();
      var action = btn.getAttribute("data-action");
      if(action === "close") closeWindow(id);
      else if(action === "min") minimizeWindow(id);
      else if(action === "max") toggleMaximize(id);
    });
  });

  // Drag
  if(!isMobile){
    var dragHandle = el.querySelector(".bw-titlebar-drag");
    var dragging = false, dragOx, dragOy;
    dragHandle.addEventListener("mousedown", function(e){
      if(win.maximized) return;
      dragging = true;
      dragOx = e.clientX - win.x;
      dragOy = e.clientY - win.y;
      el.style.transition = "none";
      focusWindow(id);
    });
    document.addEventListener("mousemove", function(e){
      if(!dragging) return;
      win.x = clamp(e.clientX - dragOx, -win.w+60, window.innerWidth-60);
      win.y = clamp(e.clientY - dragOy, 0, window.innerHeight-80);
      el.style.left = win.x+"px";
      el.style.top = win.y+"px";
    });
    document.addEventListener("mouseup", function(){
      if(dragging){ dragging=false; el.style.transition=""; saveState(); }
    });
    // Double-click titlebar to maximize
    dragHandle.addEventListener("dblclick", function(){ toggleMaximize(id); });

    // Resize
    var resizeHandle = el.querySelector(".bw-resize");
    var resizing = false, resOx, resOy, resOw, resOh;
    resizeHandle.addEventListener("mousedown", function(e){
      if(win.maximized) return;
      e.stopPropagation();
      resizing = true;
      resOx = e.clientX; resOy = e.clientY;
      resOw = win.w; resOh = win.h;
      focusWindow(id);
    });
    document.addEventListener("mousemove", function(e){
      if(!resizing) return;
      win.w = Math.max(320, resOw + (e.clientX - resOx));
      win.h = Math.max(200, resOh + (e.clientY - resOy));
      el.style.width = win.w+"px";
      el.style.height = win.h+"px";
    });
    document.addEventListener("mouseup", function(){
      if(resizing){ resizing=false; saveState(); }
    });
  }

  focusWindow(id);
  updateTaskbarWindows();
  saveState();
}

function closeWindow(id){
  var win = windows.find(function(w){return w.id===id;});
  if(!win) return;
  win.closed = true;
  if(win.el){
    var iframe = win.el.querySelector("iframe");
    if(iframe) iframe.src = "about:blank";
    win.el.remove();
  }
  windows = windows.filter(function(w){return w.id!==id;});
  updateTaskbarWindows();
  saveState();
  // Focus next window
  if(focusedWinId === id){
    var open = windows.filter(function(w){return !w.minimized && !w.closed;});
    if(open.length) focusWindow(open[open.length-1].id);
    else focusedWinId = null;
  }
}

function minimizeWindow(id){
  var win = windows.find(function(w){return w.id===id;});
  if(!win) return;
  win.minimized = true;
  if(win.el) win.el.style.display = "none";
  updateTaskbarWindows();
  saveState();
  var open = windows.filter(function(w){return !w.minimized && !w.closed;});
  if(open.length) focusWindow(open[open.length-1].id);
  else focusedWinId = null;
}

function restoreWindow(id){
  var win = windows.find(function(w){return w.id===id;});
  if(!win) return;
  win.minimized = false;
  if(win.el) win.el.style.display = "";
  focusWindow(id);
  updateTaskbarWindows();
  saveState();
}

function focusWindow(id){
  focusedWinId = id;
  windows.forEach(function(w){
    if(w.el){
      if(w.id === id){
        w.el.style.zIndex = ++zBase;
        w.el.classList.add("focused");
      } else {
        w.el.classList.remove("focused");
      }
    }
  });
  updateTaskbarWindows();
}

function toggleMaximize(id){
  var win = windows.find(function(w){return w.id===id;});
  if(!win || !win.el) return;
  if(isMobile) return;
  win.maximized = !win.maximized;
  if(win.maximized){
    win._prev = {x:win.x, y:win.y, w:win.w, h:win.h};
    win.el.classList.add("maximized");
    win.el.style.left = "0"; win.el.style.top = "0";
    win.el.style.width = "100%"; win.el.style.height = (window.innerHeight - 40)+"px";
  } else {
    win.el.classList.remove("maximized");
    if(win._prev){
      win.x=win._prev.x; win.y=win._prev.y; win.w=win._prev.w; win.h=win._prev.h;
    }
    win.el.style.left=win.x+"px"; win.el.style.top=win.y+"px";
    win.el.style.width=win.w+"px"; win.el.style.height=win.h+"px";
  }
  saveState();
}

// ── Taskbar Window Buttons ──
function updateTaskbarWindows(){
  var container = $("taskbar-windows");
  container.innerHTML = "";
  windows.forEach(function(w){
    if(w.closed) return;
    var btn = document.createElement("div");
    btn.className = "tb-win" + (w.id === focusedWinId && !w.minimized ? " active" : "");
    btn.innerHTML = '<span class="tb-win-dot" style="background:'+(w.color||'#555')+'"></span> '+esc(w.name);
    btn.addEventListener("click", function(){
      if(w.minimized){
        restoreWindow(w.id);
      } else if(w.id === focusedWinId){
        minimizeWindow(w.id);
      } else {
        focusWindow(w.id);
      }
    });
    container.appendChild(btn);
  });
}

// ── Start Menu ──
var startMenu = $("start-menu");
var startBtn = $("start-btn");
var startApps = $("start-menu-apps");

APPS.forEach(function(app){
  var el = document.createElement("div");
  el.className = "sm-app";
  var iconClass = app.shape === "circle" ? "sm-app-icon" : "sm-app-icon sq";
  el.innerHTML = '<div class="'+iconClass+'" style="background:'+app.color+'"></div>'
    + '<div class="sm-app-info"><div class="sm-app-name">'+esc(app.name)+'</div><div class="sm-app-desc">'+esc(app.desc)+'</div></div>';
  el.addEventListener("click", function(){
    startMenu.classList.remove("open");
    openWindow(app.name, app.url, app.color);
  });
  startApps.appendChild(el);
});

startBtn.addEventListener("click", function(e){
  e.stopPropagation();
  startMenu.classList.toggle("open");
  launcher.classList.remove("open");
});

// ── App Launcher ──
var launcher = $("launcher");
var launcherSearch = $("launcher-search");
var launcherGrid = $("launcher-grid");

function buildLauncherGrid(filter){
  launcherGrid.innerHTML = "";
  var f = (filter||"").toLowerCase();
  APPS.forEach(function(app){
    if(f && app.name.toLowerCase().indexOf(f)===-1 && app.desc.toLowerCase().indexOf(f)===-1) return;
    var el = document.createElement("div");
    el.className = "lc-app";
    var iconClass = app.shape === "circle" ? "lc-icon" : "lc-icon sq";
    el.innerHTML = '<div class="'+iconClass+'" style="background:'+app.color+'"></div><div class="lc-name">'+esc(app.name)+'</div>';
    el.addEventListener("click", function(){
      launcher.classList.remove("open");
      openWindow(app.name, app.url, app.color);
    });
    launcherGrid.appendChild(el);
  });
}
buildLauncherGrid();

launcherSearch.addEventListener("input", function(){
  buildLauncherGrid(launcherSearch.value.trim());
});

function toggleLauncher(){
  var isOpen = launcher.classList.contains("open");
  if(isOpen){
    launcher.classList.remove("open");
  } else {
    startMenu.classList.remove("open");
    launcher.classList.add("open");
    launcherSearch.value = "";
    buildLauncherGrid();
    setTimeout(function(){ launcherSearch.focus(); }, 50);
  }
}

// ── Context Menu ──
var ctxMenu = $("ctx-menu");
document.addEventListener("contextmenu", function(e){
  // Only on desktop background
  if(e.target.id === "desktop" || e.target.id === "desktop-icons" || e.target.closest("#desktop-icons")){
    e.preventDefault();
    ctxMenu.innerHTML = '<div class="ctx-item" data-action="launcher">Open App Launcher</div>'
      + '<div class="ctx-item" data-action="refresh">Refresh Desktop</div>'
      + '<div class="ctx-sep"></div>'
      + '<div class="ctx-item" data-action="minimize-all">Show Desktop</div>'
      + '<div class="ctx-item" data-action="close-all">Close All Windows</div>'
      + '<div class="ctx-sep"></div>'
      + '<div class="ctx-item" data-action="about">About BlackRoad OS</div>';
    ctxMenu.style.display = "block";
    ctxMenu.style.left = Math.min(e.clientX, window.innerWidth - 200) + "px";
    ctxMenu.style.top = Math.min(e.clientY, window.innerHeight - 200) + "px";
  }
});
ctxMenu.addEventListener("click", function(e){
  var action = e.target.getAttribute("data-action");
  ctxMenu.style.display = "none";
  if(action === "launcher") toggleLauncher();
  else if(action === "refresh") location.reload();
  else if(action === "minimize-all") windows.forEach(function(w){if(!w.closed && !w.minimized) minimizeWindow(w.id);});
  else if(action === "close-all") windows.slice().forEach(function(w){if(!w.closed) closeWindow(w.id);});
  else if(action === "about") openAboutWindow();
});

function openAboutWindow(){
  var existing = windows.find(function(w){return w.name === "About" && !w.closed;});
  if(existing){ focusWindow(existing.id); return; }
  var id = ++winIdCounter;
  var dw = window.innerWidth, dh = window.innerHeight - 40;
  var ww = 360, wh = 280;
  var win = {id:id, name:"About", url:"about:blank", color:"#8844FF", x:(dw-ww)/2, y:(dh-wh)/3, w:ww, h:wh, maximized:false, minimized:false, closed:false, el:null};
  windows.push(win);
  var el = document.createElement("div");
  el.className = "bw" + (isMobile ? " maximized" : "");
  el.id = "bw-"+id;
  if(!isMobile){ el.style.left=win.x+"px"; el.style.top=win.y+"px"; el.style.width=ww+"px"; el.style.height=wh+"px"; }
  el.style.zIndex = ++zBase;
  el.innerHTML = '<div class="bw-titlebar">'
    + '<div class="bw-dot" style="background:#8844FF"></div>'
    + '<div class="bw-titlebar-drag"><span class="bw-title">About BlackRoad OS</span></div>'
    + '<div class="bw-btns"><div class="bw-btn bw-btn-close" data-action="close"></div></div></div>'
    + '<div class="bw-body" style="padding:24px;overflow-y:auto;background:#0f0f0f">'
    + '<div style="display:flex;gap:4px;align-items:center;margin-bottom:12px"><div style="width:10px;height:10px;border-radius:50%;background:#FF2255"></div><div style="width:10px;height:10px;border-radius:3px;background:#8844FF"></div></div>'
    + '<h3 style="font-family:Space Grotesk,sans-serif;font-size:16px;font-weight:700;color:#e5e5e5;margin-bottom:8px">BlackRoad OS</h3>'
    + '<p style="font-size:12px;color:#a3a3a3;line-height:1.6;margin-bottom:12px">Sovereign computing platform. Your AI. Your hardware. Your data. No middlemen.</p>'
    + '<p style="font-size:11px;color:#525252;line-height:1.5">Founded November 17, 2025<br>Delaware C-Corp<br>Alexa Louise Amundson, CEO<br>EIN: 41-2663817</p>'
    + '<p style="font-size:10px;color:#333;margin-top:12px;font-family:JetBrains Mono,monospace">14 products / 7 nodes / 52 TOPS</p>'
    + '</div><div class="bw-resize"></div>';
  win.el = el;
  $("desktop").appendChild(el);
  el.addEventListener("mousedown", function(){ focusWindow(id); });
  el.querySelector(".bw-btn-close").addEventListener("click", function(e){ e.stopPropagation(); closeWindow(id); });
  // Drag for about window
  if(!isMobile){
    var dh2 = el.querySelector(".bw-titlebar-drag");
    var dr=false, ox, oy;
    dh2.addEventListener("mousedown",function(e){ dr=true; ox=e.clientX-win.x; oy=e.clientY-win.y; focusWindow(id); });
    document.addEventListener("mousemove",function(e){ if(!dr)return; win.x=e.clientX-ox; win.y=e.clientY-oy; el.style.left=win.x+"px"; el.style.top=win.y+"px"; });
    document.addEventListener("mouseup",function(){ dr=false; });
  }
  focusWindow(id);
  updateTaskbarWindows();
}

// ── Keyboard Shortcuts ──
document.addEventListener("keydown", function(e){
  var tag = (e.target.tagName||"").toLowerCase();
  var isInput = tag === "input" || tag === "textarea" || tag === "select";

  // Alt+Space or Space (when not in input): launcher
  if(e.key === " " && e.altKey){ e.preventDefault(); toggleLauncher(); return; }
  if(e.key === " " && !isInput && !launcher.classList.contains("open")){ e.preventDefault(); toggleLauncher(); return; }

  // Escape: close launcher/start/context
  if(e.key === "Escape"){
    if(launcher.classList.contains("open")){ launcher.classList.remove("open"); return; }
    if(startMenu.classList.contains("open")){ startMenu.classList.remove("open"); return; }
    if(ctxMenu.style.display === "block"){ ctxMenu.style.display = "none"; return; }
  }

  // Alt+F4: close focused window
  if(e.key === "F4" && e.altKey){
    e.preventDefault();
    if(focusedWinId) closeWindow(focusedWinId);
    return;
  }

  // Alt+Tab: cycle windows
  if(e.key === "Tab" && e.altKey){
    e.preventDefault();
    var open = windows.filter(function(w){return !w.closed;});
    if(open.length < 2) return;
    var idx = open.findIndex(function(w){return w.id === focusedWinId;});
    var next = open[(idx + 1) % open.length];
    if(next.minimized) restoreWindow(next.id);
    focusWindow(next.id);
    return;
  }

  // Ctrl+D: show desktop (minimize all)
  if(e.key === "d" && (e.ctrlKey || e.metaKey)){
    e.preventDefault();
    var allMinimized = windows.every(function(w){return w.closed || w.minimized;});
    if(allMinimized){
      windows.forEach(function(w){if(!w.closed && w.minimized) restoreWindow(w.id);});
    } else {
      windows.forEach(function(w){if(!w.closed && !w.minimized) minimizeWindow(w.id);});
    }
    return;
  }
});

// Close menus on click outside
document.addEventListener("click", function(e){
  if(!startMenu.contains(e.target) && !startBtn.contains(e.target)){
    startMenu.classList.remove("open");
  }
  if(ctxMenu.style.display === "block" && !ctxMenu.contains(e.target)){
    ctxMenu.style.display = "none";
  }
  if(launcher.classList.contains("open") && !launcher.contains(e.target)){
    launcher.classList.remove("open");
  }
});

// ── Clock ──
function updateClock(){
  var now = new Date();
  var h = now.getHours(), m = now.getMinutes();
  $("taskbar-clock").textContent = (h<10?"0":"")+h+":"+(m<10?"0":"")+m;
}
updateClock();
setInterval(updateClock, 10000);

// ── Widgets (desktop only) ──
if(!isMobile){
  function makeWidget(id, x, y, title, val, sub){
    var w = document.createElement("div");
    w.className = "widget";
    w.id = "widget-"+id;
    w.style.right = x+"px"; w.style.top = y+"px";
    w.innerHTML = '<div class="widget-title">'+esc(title)+'</div><div class="widget-val" id="wv-'+id+'">'+esc(val)+'</div><div class="widget-sub" id="ws-'+id+'">'+esc(sub)+'</div>';
    $("desktop").appendChild(w);
  }
  makeWidget("agents", 20, 20, "Agents Online", "--", "fleet");
  makeWidget("products", 20, 110, "Products Up", "--", "of 14");
  makeWidget("clock", 20, 200, "System Time", "--:--:--", new Date().toLocaleDateString());
  makeWidget("mem", 20, 290, "Memory Hash", "...", "chain active");

  // Widget clock
  function updateWidgetClock(){
    var now = new Date();
    var el = $("wv-clock");
    if(el) el.textContent = now.toLocaleTimeString();
    var el2 = $("ws-clock");
    if(el2) el2.textContent = now.toLocaleDateString();
  }
  updateWidgetClock();
  setInterval(updateWidgetClock, 1000);
}

// ── Tray: fetch live stats ──
function fetchStats(){
  fetch("/api/stats").then(function(r){return r.json()}).then(function(d){
    var agentEl = $("tray-agents");
    if(agentEl) agentEl.textContent = (d.agents||0)+" agents";
    if(!isMobile){
      var wv = $("wv-agents");
      if(wv) wv.textContent = d.agents || 0;
    }
  }).catch(function(){});
}
fetchStats();
setInterval(fetchStats, 60000);

function fetchProducts(){
  fetch("/api/products").then(function(r){return r.json()}).then(function(d){
    var up = 0;
    (d.products||[]).forEach(function(p){ if(p.ok) up++; });
    if(!isMobile){
      var wv = $("wv-products");
      if(wv) wv.textContent = up;
      var ws = $("ws-products");
      if(ws) ws.textContent = "of "+(d.products||[]).length;
    }
  }).catch(function(){});
}
fetchProducts();
setInterval(fetchProducts, 30000);

// Memory hash ticker
function fetchMemHash(){
  var hash = Math.random().toString(36).slice(2,10);
  var el = $("tray-mem");
  if(el) el.textContent = hash;
  if(!isMobile){
    var wv = $("wv-mem");
    if(wv) wv.textContent = hash;
  }
}
fetchMemHash();
setInterval(fetchMemHash, 5000);

// ── Intent-to-apps mapping ──
function getAppsForIntent(intent){
  var t = (intent||"").toLowerCase();
  if(t.indexOf("game")!==-1) return ["Game","Canvas","Chat"];
  if(t.indexOf("code")!==-1||t.indexOf("app")!==-1||t.indexOf("startup")!==-1) return ["RoadCode","Chat","Search"];
  if(t.indexOf("music")!==-1||t.indexOf("song")!==-1||t.indexOf("audio")!==-1) return ["Radio","Canvas","Chat"];
  if(t.indexOf("video")!==-1||t.indexOf("stream")!==-1) return ["Video","Chat","Social"];
  if(t.indexOf("learn")!==-1||t.indexOf("study")!==-1||t.indexOf("homework")!==-1) return ["Tutor","Search","Chat"];
  if(t.indexOf("social")!==-1||t.indexOf("post")!==-1||t.indexOf("friend")!==-1) return ["Social","Chat","Canvas"];
  if(t.indexOf("write")!==-1||t.indexOf("blog")!==-1||t.indexOf("story")!==-1) return ["Search","Chat","Social"];
  return ["Chat","Search","RoadCode"];
}

function openAppsByName(names){
  var offset=0;
  names.forEach(function(name){
    var app = APPS.find(function(a){return a.name===name;});
    if(app){
      openWindow(app.name, app.url, app.color, {x: 60+offset*40, y: 40+offset*30});
      offset++;
    }
  });
}

// ── Lucidia Panel ──
var lucidiaPanel = $("lucidia-panel");
var lucidiaMessages = $("lucidia-messages");
var lucidiaInput = $("lucidia-input");
var lucidiaSend = $("lucidia-send");
var lucidiaHeader = $("lucidia-header");
var lucidiaMinBtn = $("lucidia-min-btn");
var lucidiaUserId = localStorage.getItem("br-username") || ("visitor-"+Math.random().toString(36).slice(2,6));

function addLucidiaMsg(text, role){
  var div = document.createElement("div");
  div.className = "lucidia-msg "+(role||"assistant");
  div.textContent = text;
  lucidiaMessages.appendChild(div);
  lucidiaMessages.scrollTop = lucidiaMessages.scrollHeight;
}

function sendToLucidia(text){
  if(!text.trim()) return;
  addLucidiaMsg(text, "user");
  lucidiaInput.value = "";
  fetch("https://roadtrip.blackroad.io/api/rooms/general/messages", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({sender:lucidiaUserId,content:text})
  }).then(function(r){return r.json()}).then(function(d){
    if(d && d.reply) addLucidiaMsg(d.reply, "assistant");
    else addLucidiaMsg("I heard you. Working on it.", "assistant");
  }).catch(function(){
    addLucidiaMsg("I heard you. Working on it.", "assistant");
  });
}

lucidiaSend.addEventListener("click", function(){ sendToLucidia(lucidiaInput.value); });
lucidiaInput.addEventListener("keydown", function(e){ if(e.key==="Enter"){ e.preventDefault(); sendToLucidia(lucidiaInput.value); }});

var lucidiaMinimized = false;
function toggleLucidiaMin(){
  lucidiaMinimized = !lucidiaMinimized;
  if(lucidiaMinimized){
    lucidiaPanel.classList.add("minimized");
  } else {
    lucidiaPanel.classList.remove("minimized");
  }
}
lucidiaHeader.addEventListener("click", function(e){
  if(e.target === lucidiaMinBtn || lucidiaMinBtn.contains(e.target)){
    toggleLucidiaMin();
  } else if(lucidiaMinimized){
    toggleLucidiaMin();
  }
});
lucidiaMinBtn.addEventListener("click", function(e){ e.stopPropagation(); toggleLucidiaMin(); });

function showLucidia(){
  lucidiaPanel.classList.add("open");
}

// ── Onboarding Flow ──
var isOnboarded = localStorage.getItem("br-onboarded") === "true";

if(!isOnboarded){
  var obOverlay = $("onboarding");
  var obTagline = $("ob-tagline");
  var obPrompt = $("ob-prompt");
  var obInput = $("ob-input");
  var obHint = $("ob-hint");
  obOverlay.classList.remove("hidden");

  // Phase 1: tagline fades in
  setTimeout(function(){ obTagline.classList.add("visible"); }, 100);

  // Phase 2: after 2s, swap to intent prompt
  setTimeout(function(){
    obTagline.classList.remove("visible");
    setTimeout(function(){
      obTagline.style.display = "none";
      obPrompt.classList.add("visible");
      obInput.classList.add("visible");
      obHint.classList.add("visible");
      setTimeout(function(){ obInput.focus(); }, 200);
    }, 600);
  }, 2600);

  // Phase 3: on Enter, dissolve and open apps
  obInput.addEventListener("keydown", function(e){
    if(e.key === "Enter"){
      e.preventDefault();
      var intent = obInput.value.trim() || "explore";
      localStorage.setItem("br-onboarded", "true");
      localStorage.setItem("br-intent", intent);
      localStorage.setItem("br-username", lucidiaUserId);

      // Dissolve overlay
      obOverlay.classList.add("dissolving");
      setTimeout(function(){
        obOverlay.classList.add("hidden");
        obOverlay.classList.remove("dissolving");
      }, 900);

      // Open relevant app windows with slight stagger
      var appNames = getAppsForIntent(intent);
      setTimeout(function(){
        openAppsByName(appNames);
      }, 300);

      // Phase 4: Lucidia appears 1s after windows open
      setTimeout(function(){
        showLucidia();
        addLucidiaMsg("Got it. I'm setting this up with you.", "assistant");
        setTimeout(function(){
          addLucidiaMsg("Everything you do here is remembered. Come back anytime -- I'll keep it ready.", "assistant");
        }, 2000);
      }, 1400);
    }
  });
} else {
  // ── Returning user: restore saved state ──
  var saved = loadState();
  if(saved && saved.length){
    saved.forEach(function(s){
      var app = APPS.find(function(a){return a.url === s.url;});
      if(!app) return;
      openWindow(app.name, app.url, app.color, {x:s.x, y:s.y, w:s.w, h:s.h, maximized:s.maximized});
      if(s.minimized){
        var w = windows[windows.length-1];
        if(w) minimizeWindow(w.id);
      }
    });
  }
  // Show Lucidia panel for returning users too
  setTimeout(function(){ showLucidia(); }, 500);
}

})();
<\/script>
</body></html>`;
}
__name(buildDashboard, "buildDashboard");
export {
  index_default as default
};
//# sourceMappingURL=index.js.map

