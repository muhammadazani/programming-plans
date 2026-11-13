/* buatkode · Programming Plans — home page: the plan finder and the catalogue.
   Data: window.CATALOG (data/catalog.js) and window.FINDER (data/finder.js). */
(function () {
  "use strict";

  const C = window.CATALOG, F = window.FINDER;
  const $ = (sel, root = document) => root.querySelector(sel);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage unavailable */ } }
  };
  const plan = (id) => C.plans.find((p) => p.id === id);
  const href = (p) => `plans/${p.slug}.html`;
  const live = C.plans.filter((p) => p.live);

  /* ---------- isometric mini-cubes ---------- */
  const PAL = {
    blue: ["#5b8def", "#2b5fd9", "#1a44b8"],
    amber: ["#ffd166", "#f5b731", "#d99a12"],
    pale: ["#f4f8ff", "#d6e3fb", "#b9cdf3"]
  };
  function cube(x, y, a, pal, op = 1) {
    const [t, l, r] = PAL[pal];
    const p = (pts) => pts.map((q) => q.join(",")).join(" ");
    return `<g opacity="${op}">
      <polygon points="${p([[x + a, y], [x + 2 * a, y + a / 2], [x + a, y + a], [x, y + a / 2]])}" fill="${t}" stroke="#fff" stroke-width=".8"/>
      <polygon points="${p([[x, y + a / 2], [x + a, y + a], [x + a, y + 2 * a], [x, y + 1.5 * a]])}" fill="${l}" stroke="#fff" stroke-width=".8"/>
      <polygon points="${p([[x + a, y + a], [x + 2 * a, y + a / 2], [x + 2 * a, y + 1.5 * a], [x + a, y + 2 * a]])}" fill="${r}" stroke="#fff" stroke-width=".8"/>
    </g>`;
  }
  // one small picture per group, in the same visual language as the card traces
  const THUMB = {
    A: () => cube(4, 26, 9, "pale") + `<path d="M24 36h8" stroke="#1f5fe0" stroke-width="2"/>` + cube(34, 18, 13, "blue") + `<path d="M62 36h8" stroke="#1f5fe0" stroke-width="2"/>` + cube(72, 26, 10, "amber"),
    B: () => cube(8, 6, 10, "pale") + cube(30, 20, 10, "amber") + cube(52, 34, 10, "blue", 0.4) + cube(74, 48, 8, "blue", 0.3),
    C: () => [0, 1, 2, 3].map((i) => cube(8 + i * 20, 24 + (i % 2) * 6, 9, i === 3 ? "amber" : "pale")).join("") + `<path d="M14 60 Q48 76 84 60" fill="none" stroke="#1f5fe0" stroke-width="2" stroke-dasharray="3 3"/>`,
    D: () => [0, 1, 2, 3, 4].map((i) => cube(4 + i * 18, 14 + i * 9, 8, i === 2 ? "amber" : i < 2 ? "pale" : "blue", i > 2 ? 0.35 : 1)).join(""),
    E: () => { let s = ""; for (let r = 0; r < 3; r++) for (let c = 0; c <= r; c++) s += cube(14 + c * 20, 6 + r * 16, 9, r === 2 && c === 2 ? "amber" : r % 2 ? "blue" : "pale"); return s; },
    F: () => cube(4, 30, 9, "amber") + cube(24, 30, 9, "pale") + cube(44, 30, 9, "pale") + cube(64, 30, 9, "pale") + cube(84 - 2, 30, 9, "amber") + `<path d="M12 22l10 0M88 22l-10 0" stroke="#1f5fe0" stroke-width="2"/>`,
    G: () => `<rect x="18" y="10" width="64" height="52" rx="10" fill="none" stroke="#9fbcf6" stroke-width="2" stroke-dasharray="4 3"/>` + cube(30, 18, 10, "blue") + cube(50, 26, 8, "amber")
  };
  const thumb = (group) => `<svg viewBox="0 0 100 72" class="thumb" aria-hidden="true" focusable="false">${THUMB[group]()}</svg>`;

  /* ---------- hero ---------- */
  function renderHero() {
    $("#hero-stats").innerHTML = `<b>${live.length}</b> plans live · <b>${C.plans.length}</b> planned · code in <b>Python, Java, Rust, C and C++</b>`;
    let s = "";
    // a little skyline of cubes in the banner's style
    // tall columns on the left, short ones on the right, clear of the floating card
    const blocks = [[0, 3], [1, 4], [2, 2], [3, 3], [4, 1], [5, 1]];
    blocks.forEach(([col, h]) => { for (let r = 0; r < h; r++) s += cube(6 + col * 46, 222 - r * 27 - col * 5, 23, r === h - 1 && col === 1 ? "amber" : (col + r) % 3 ? "blue" : "pale"); });
    s += cube(20, 30, 14, "pale") + cube(400, 230, 16, "pale") + cube(330, 250, 12, "amber", 0.85);
    $("#home-art").innerHTML = `<svg class="cubes" viewBox="0 0 460 290">${s}</svg>
      <div class="plan-card"><div class="pc-title">plans <b>you'll meet</b></div>
        <ol><li><span class="num">1</span>count, total, average</li><li><span class="num">2</span>find, any?, all?</li><li><span class="num">3</span>filter, build, classify</li></ol>
        <div class="pc-foot">↻ in 5 languages</div></div>`;
  }

  /* ---------- plan finder ---------- */
  function renderFinder() {
    const card = $("#finder-card");
    let trail = []; // [{ node, option }]

    function planTile(p, big) {
      return `<div class="ftile${big ? " big" : ""}">
        ${thumb(p.id[0])}
        <div><span class="pcode">${esc(p.id)}</span> <b>${esc(p.title)}</b><p>${esc(p.intent)}</p></div></div>`;
    }

    function draw(focus) {
      const crumbs = trail.map((t, i) => `<li><button type="button" class="crumb" data-back="${i}" title="Change this answer">${esc(F.nodes[t.node].options[t.option].label)}</button></li>`).join("");
      const last = trail[trail.length - 1];
      const chosen = last && F.nodes[last.node].options[last.option];
      let body;
      if (chosen && chosen.result) {
        const p = plan(chosen.result), alt = chosen.alt && plan(chosen.alt);
        body = `
          <p class="f-step">Your plan</p>
          <h3 class="f-q" tabindex="-1">${esc(p.title)}</h3>
          ${planTile(p, true)}
          <p class="f-why"><b>Why:</b> ${esc(chosen.why)}</p>
          <div class="f-actions">
            ${p.live
              ? `<a class="btn primary" href="${href(p)}">Open the ${esc(p.id)} card →</a>`
              : `<span class="chip soon-chip">Coming soon</span>${alt ? `<a class="btn primary" href="${href(alt)}">Meanwhile, read ${esc(alt.id)} · ${esc(alt.title)} →</a>` : ""}`}
            <button type="button" class="btn" data-restart>Start over</button>
          </div>`;
      } else {
        const nodeId = chosen ? chosen.next : F.start;
        const node = F.nodes[nodeId];
        body = `
          <p class="f-step">Question ${trail.length + 1}</p>
          <h3 class="f-q" tabindex="-1">${esc(node.q)}</h3>
          <div class="f-options">${node.options.map((o, i) => `
            <button type="button" class="f-opt" data-node="${esc(nodeId)}" data-opt="${i}">
              <b>${esc(o.label)}</b><span>${esc(o.hint || "")}</span>
            </button>`).join("")}</div>
          ${trail.length ? `<div class="f-actions"><button type="button" class="btn" data-back="${trail.length - 1}">◀ Back</button><button type="button" class="btn" data-restart>Start over</button></div>` : ""}`;
      }
      card.innerHTML = `${trail.length ? `<ol class="f-trail" aria-label="Your answers so far">${crumbs}</ol>` : ""}<div class="f-body" aria-live="polite">${body}</div>`;
      if (focus) $(".f-q", card).focus();
    }

    card.addEventListener("click", (e) => {
      const opt = e.target.closest(".f-opt");
      if (opt) { trail.push({ node: opt.dataset.node, option: Number(opt.dataset.opt) }); return draw(true); }
      const back = e.target.closest("[data-back]");
      if (back) { trail = trail.slice(0, Number(back.dataset.back)); return draw(true); }
      if (e.target.closest("[data-restart]")) { trail = []; draw(true); }
    });
    draw(false);
  }

  /* ---------- catalogue ---------- */
  function renderCatalogue() {
    const LEVELS = ["Foundations", "Core", "Advanced"];
    const groups = Object.keys(C.groups);
    let saved = {};
    try { saved = JSON.parse(store.get("bk.catalogue") || "{}") || {}; } catch (e) { saved = {}; }
    const state = { level: LEVELS.includes(saved.level) ? saved.level : "all", group: groups.includes(saved.group) ? saved.group : "all", liveOnly: !!saved.liveOnly };

    const chip = (key, value, label) => `<button type="button" class="fchip" data-key="${key}" data-value="${esc(value)}">${esc(label)}</button>`;
    $("#filters").innerHTML = `
      <div class="frow" role="group" aria-label="Filter by level"><span class="flabel">Level</span>${chip("level", "all", "All")}${LEVELS.map((l) => chip("level", l, l)).join("")}</div>
      <div class="frow" role="group" aria-label="Filter by group"><span class="flabel">Group</span>${chip("group", "all", "All")}${groups.map((g) => chip("group", g, `${g} · ${C.groups[g]}`)).join("")}</div>
      <label class="flive"><input type="checkbox" id="live-only"> Only show plans that are live</label>`;
    const liveBox = $("#live-only");

    function draw() {
      store.set("bk.catalogue", JSON.stringify(state));
      document.querySelectorAll(".fchip").forEach((b) => b.setAttribute("aria-pressed", String(state[b.dataset.key] === b.dataset.value)));
      liveBox.checked = state.liveOnly;
      const keep = (p) => (state.level === "all" || p.level === state.level) && (state.liveOnly ? p.live : true);
      const html = groups.filter((g) => state.group === "all" || state.group === g).map((g) => {
        const all = C.plans.filter((p) => p.id.replace(/\d+$/, "") === g);
        const shown = all.filter(keep);
        if (!shown.length) return "";
        const nLive = all.filter((p) => p.live).length;
        return `<section class="group" id="group-${g}" aria-labelledby="group-${g}-title">
          <h3 class="group-title" id="group-${g}-title"><span class="gcode">${g}</span>${esc(C.groups[g])}<span class="gcount">${all.length} plans · ${nLive} live</span></h3>
          <div class="ptiles">${shown.map((p) => p.live
            ? `<a class="ptile" href="${href(p)}">${thumb(g)}<span class="pt-head"><span class="pcode">${esc(p.id)}</span>${p.core ? '<span class="pt-core" title="Core plan">★</span>' : ""}<span class="pt-level">${esc(p.level)}</span></span><b>${esc(p.title)}</b><span class="pt-intent">${esc(p.intent)}</span><span class="pt-go">Open →</span></a>`
            : `<div class="ptile soon">${thumb(g)}<span class="pt-head"><span class="pcode">${esc(p.id)}</span><span class="pt-level">${esc(p.level)}</span></span><b>${esc(p.title)}</b><span class="pt-intent">${esc(p.intent)}</span><span class="pt-soon">Coming soon</span></div>`).join("")}</div>
        </section>`;
      }).join("");
      $("#groups").innerHTML = html || `<p class="empty-filter">No plans match these filters. <button type="button" class="btn small" data-clear>Clear the filters</button></p>`;
    }

    $("#filters").addEventListener("click", (e) => {
      const b = e.target.closest(".fchip");
      if (!b) return;
      state[b.dataset.key] = b.dataset.value;
      draw();
    });
    liveBox.addEventListener("change", () => { state.liveOnly = liveBox.checked; draw(); });
    $("#groups").addEventListener("click", (e) => {
      if (e.target.closest("[data-clear]")) { state.level = "all"; state.group = "all"; state.liveOnly = false; draw(); }
    });
    // links like index.html#group-D (from a card's breadcrumb) should show that group
    const m = location.hash.match(/^#group-([A-G])$/);
    if (m) { state.group = "all"; state.level = "all"; state.liveOnly = false; draw(); const el = document.getElementById(`group-${m[1]}`); if (el) el.scrollIntoView(); return; }
    draw();
  }

  renderHero();
  renderFinder();
  renderCatalogue();
})();
