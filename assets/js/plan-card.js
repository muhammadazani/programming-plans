/* buatkode · Programming Plans — renders one plan card from window.PLAN.
   Everything plan-specific (text, code, trace logic, tests) lives in the plan's
   data file; this file only knows how to draw the shared template.
   No build step and no framework: serve the folder statically. */
(function () {
  "use strict";

  const P = window.PLAN;
  const CAT = window.CATALOG || { plans: [], groups: {} };
  const LANGS = [
    { id: "python", label: "Python" },
    { id: "java", label: "Java" },
    { id: "rust", label: "Rust" },
    { id: "c", label: "C" },
    { id: "cpp", label: "C++" }
  ];
  const NUM_WORD = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];

  /* ---------- small helpers ---------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  function h(html) {
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage unavailable: keep in memory only */ } }
  };
  const stepsOf = (s) => (!s ? [] : Array.isArray(s) ? s : [s]);
  const langLabel = (id) => LANGS.find((l) => l.id === id).label;
  const fnName = (lang) => (P.fn && P.fn[lang]) || (P.fn && P.fn.python) || "";
  const withFn = (text, lang) => String(text).replace(/\{fn\}/g, fnName(lang));
  const catEntry = (id) => CAT.plans.find((p) => p.id === id);

  /* ---------- global language / style state ---------- */
  const params = new URLSearchParams(location.search);
  const state = {
    lang: [params.get("lang"), store.get("bk.lang")].find((l) => LANGS.some((x) => x.id === l)) || "python",
    variant: store.get("bk.variant") === "idiomatic" ? "idiomatic" : "plain"
  };
  const listeners = [];
  const onState = (fn) => { listeners.push(fn); fn(); };
  function setState(patch) {
    Object.assign(state, patch);
    store.set("bk.lang", state.lang);
    store.set("bk.variant", state.variant);
    const u = new URL(location.href);
    u.searchParams.set("lang", state.lang);
    history.replaceState(null, "", u);
    listeners.forEach((fn) => fn());
  }

  function segmented(container, items, key) {
    items.forEach((it) => {
      const b = h(`<button type="button">${esc(it.label)}</button>`);
      b.addEventListener("click", () => setState({ [key]: it.id }));
      container.appendChild(b);
    });
    onState(() => {
      [...container.children].forEach((b, i) => b.setAttribute("aria-pressed", String(items[i].id === state[key])));
    });
  }

  /* ---------- syntax highlighting (tiny, per language) ---------- */
  const KW = {
    python: "def for in if else elif return not and or pass while True False None import from lambda match case",
    java: "static boolean int double long for if else return true false new public private class void char String import final var",
    rust: "fn for in if else return true false let mut i32 i64 u32 f64 bool str usize as match",
    c: "bool int double long const size_t for if else return true false char NULL void while unsigned",
    cpp: "bool int double long const size_t for if else return true false char void while auto std nullptr"
  };
  const BUILTIN = {
    python: "any all len print range round sum max min next enumerate strip lower find isdigit join",
    java: "Arrays stream anyMatch allMatch filter count sum max average orElse getAsInt boxed toList List ArrayList add indexOf toCharArray System out print println repeat Math StringBuilder append toString trim toLowerCase substring isDigit Character IntStream range findFirst takeWhile",
    rust: "iter any all filter count sum max min position copied collect map push push_str is_empty len trim to_lowercase find split_once unwrap unwrap_or_default to_string take_while is_ascii_digit String Vec vec",
    c: "strchr printf putchar puts strlen isdigit isspace tolower",
    cpp: "vector string ranges any_of all_of count_if find_if copy_if replace_if back_inserter accumulate max push_back size empty npos begin end cout tolower find_first_not_of find_last_not_of substr"
  };
  const kwSet = {}; const fnSet = {};
  Object.keys(KW).forEach((l) => { kwSet[l] = new Set(KW[l].split(" ")); fnSet[l] = new Set(BUILTIN[l].split(" ")); });

  function highlight(line, lang) {
    // groups: 1 comment, 2 preprocessor, 3 string/char, 4 number, 5 word
    const re = lang === "python"
      ? /(#.*$)|(\x00)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|\b(\d+(?:\.\d+)?)\b|([A-Za-z_]\w*)/g
      : /(\/\/.*$)|(^\s*#\w+.*$)|("(?:[^"\\]|\\.)*"|'(?:\\.|[^'\\])')|\b(\d+(?:\.\d+)?)\b|([A-Za-z_]\w*)/g;
    let out = "", last = 0, m;
    while ((m = re.exec(line))) {
      out += esc(line.slice(last, m.index));
      last = re.lastIndex;
      const tok = m[0];
      let cls = null;
      if (m[1]) cls = "com"; else if (m[2]) cls = "pp"; else if (m[3]) cls = "str"; else if (m[4]) cls = "num";
      else if (kwSet[lang].has(tok)) cls = "kw"; else if (fnSet[lang].has(tok)) cls = "fn";
      out += cls ? `<span class="tok-${cls}">${esc(tok)}</span>` : esc(tok);
    }
    return out + esc(line.slice(last));
  }

  /* ---------- code block ----------
     lines: [[steps, text], ...] or plain strings (no step tags).
     Returns the element with .setActive(stepNumber|null). */
  function codeBlock({ lang, lines, file, note, onLineHover }) {
    const norm = lines.map((l) => (typeof l === "string" ? [0, l] : l));
    const root = h(`<div class="code"><div class="code-head"><span class="fname">${esc(file || langLabel(lang))}</span><button type="button">Copy</button></div><pre></pre></div>`);
    const pre = $("pre", root);
    const rows = norm.map(([s, text]) => {
      const st = stepsOf(s);
      const label = st.length > 1 ? `${st[0]}–${st[st.length - 1]}` : st[0] || "";
      const row = h(`<div class="ln"><span class="g">${label ? `<i>${label}</i>` : ""}</span><span class="t">${highlight(text, lang) || " "}</span></div>`);
      if (onLineHover && st.length) {
        row.addEventListener("mouseenter", () => onLineHover(st.length > 1 ? null : st[0]));
        row.addEventListener("mouseleave", () => onLineHover(null));
      }
      pre.appendChild(row);
      return { row, st };
    });
    if (note) root.appendChild(h(`<div class="note">${note}</div>`));
    const copyBtn = $("button", root);
    copyBtn.addEventListener("click", () => {
      const text = norm.map((l) => l[1]).join("\n");
      const done = () => { copyBtn.textContent = "Copied"; setTimeout(() => (copyBtn.textContent = "Copy"), 1200); };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, () => {}); else done();
    });
    root.setActive = (step) => rows.forEach(({ row, st }) => row.classList.toggle("on", step != null && st.includes(step)));
    return root;
  }

  /* Which implementation to show for a language in the current style. */
  function implFor(lang, variant = state.variant) {
    const L = P.impl[lang];
    const wantIdiom = variant === "idiomatic";
    if (wantIdiom && !L.idiomatic) return { lines: L.plain.lines, note: L.idiomaticNote, file: L.file, fallback: true };
    const v = wantIdiom ? L.idiomatic : L.plain;
    return { lines: v.lines, note: v.note, file: L.file, fallback: false };
  }

  function sectionHead(kicker, title, sub) {
    return `<div class="section-head"><span class="kicker">${esc(kicker)}</span><h2>${esc(title)}</h2></div>${sub ? `<p class="muted" style="margin:-4px 0 14px">${sub}</p>` : ""}`;
  }

  /* ---------- isometric cubes (hero art, matches the banner) ---------- */
  const PAL = {
    blue: ["#5b8def", "#2b5fd9", "#1a44b8"],
    amber: ["#ffd166", "#f5b731", "#d99a12"],
    pale: ["#f4f8ff", "#d6e3fb", "#b9cdf3"]
  };
  function cube(x, y, a, pal, extra = "") {
    const [t, l, r] = PAL[pal];
    const p = (pts) => pts.map((q) => q.join(",")).join(" ");
    return `<g ${extra}>
      <polygon points="${p([[x + a, y], [x + 2 * a, y + a / 2], [x + a, y + a], [x, y + a / 2]])}" fill="${t}" stroke="#fff" stroke-width="1"/>
      <polygon points="${p([[x, y + a / 2], [x + a, y + a], [x + a, y + 2 * a], [x, y + 1.5 * a]])}" fill="${l}" stroke="#fff" stroke-width="1"/>
      <polygon points="${p([[x + a, y + a], [x + 2 * a, y + a / 2], [x + 2 * a, y + 1.5 * a], [x + a, y + 2 * a]])}" fill="${r}" stroke="#fff" stroke-width="1"/>
    </g>`;
  }
  const label = (x, y, text, size = 13, fill = "#0f1b3d") =>
    `<text x="${x}" y="${y}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-weight="700" font-size="${size}" fill="${fill}">${esc(text)}</text>`;
  const tag = (x, y, text) =>
    `<g><rect x="${x - 46}" y="${y - 18}" rx="8" width="92" height="26" fill="#0f1b3d"/>${label(x, y, text, 12, "#ffd166")}</g>`;

  const HERO_ART = {
    // a diagonal row of items; the highlighted one is the match, later ones fade out
    tiles(H) {
      const a = 30, step = a + 10;
      let s = cube(30, 30, 16, "pale", 'opacity=".9"') + cube(400, 236, 18, "pale") + cube(330, 196, 14, "amber", 'opacity=".85"');
      // H.colors (optional): one of "pale" | "amber" | "blue" | "fade" per tile
      H.values.forEach((v, i) => {
        const x = 20 + i * step, y = 112 + i * (step / 2);
        const c = H.colors ? H.colors[i] : i === H.highlight ? "amber" : i < H.highlight ? "pale" : "fade";
        s += cube(x, y, a, c === "fade" ? "blue" : c, c === "fade" ? 'opacity=".35"' : "") + label(x + a, y + a / 2 + 5, v);
      });
      const at = H.highlight ?? H.tagAt ?? 2;
      const px = 20 + at * step + a, py = 112 + at * (step / 2) - 18;
      s += `<path d="M${px} ${py - 22} L${px} ${py - 4}" stroke="#1f5fe0" stroke-width="2.5" marker-end="url(#arr)"/>` + tag(px, py - 32, H.tag);
      return s;
    },
    // inputs flow into a process cube, which produces the output cube
    pipeline(H) {
      const dy = 100; // keep clear of the floating plan card in the top right
      let s = cube(30, 30, 16, "pale") + cube(410, 40, 12, "pale") + cube(400, 250, 14, "pale");
      s += cube(6, 100 + dy, 20, "pale") + label(26, 116 + dy, H.inputs[0], 11) + cube(6, 158 + dy, 20, "pale") + label(26, 174 + dy, H.inputs[1], 11);
      s += `<path d="M54 ${140 + dy} L90 ${140 + dy}" stroke="#1f5fe0" stroke-width="2.5" marker-end="url(#arr)"/>`;
      s += cube(98, 92 + dy, 40, "blue") + label(138, 115 + dy, "⚙", 22, "#fff");
      s += `<path d="M184 ${140 + dy} L220 ${140 + dy}" stroke="#1f5fe0" stroke-width="2.5" marker-end="url(#arr)"/>`;
      s += cube(228, 106 + dy, 28, "amber") + label(256, 125 + dy, H.output, 12);
      s += tag(138, 76 + dy, H.tag);
      return s;
    },
    // a ladder of tests; the value drops until one test is true
    branches(H) {
      const a = 22;
      let s = cube(400, 30, 14, "pale") + cube(410, 236, 16, "pale");
      H.labels.forEach((lab, i) => {
        const x = 40 + i * 52, y = 60 + i * 44;
        const pal = i === H.hit ? "amber" : i < H.hit ? "pale" : "blue";
        s += cube(x, y, a, pal, i > H.hit ? 'opacity=".35"' : "") + label(x + a, y + a / 2 + 5, lab, 12);
        if (i < H.labels.length - 1) s += `<path d="M${x + 2 * a + 4} ${y + a + 6} L${x + 2 * a + 12} ${y + a + 22}" stroke="#9fbcf6" stroke-width="2"/>`;
      });
      const hx = 40 + H.hit * 52 + a, hy = 60 + H.hit * 44;
      s += tag(hx + 70, hy + 6, H.tag);
      return s;
    },
    // a staircase of cubes: row r has r cubes
    grid(H) {
      const a = 18;
      let s = cube(400, 30, 14, "pale") + cube(420, 236, 14, "amber", 'opacity=".85"');
      // back rows first, so each lower row is drawn in front of the one above it
      for (let r = 0; r < H.rows; r++) {
        for (let c = 0; c <= r; c++) {
          const last = r === H.rows - 1 && c === r;
          s += cube(40 + c * (2 * a + 4), 60 + r * 1.6 * a, a, last ? "amber" : r % 2 ? "blue" : "pale");
        }
      }
      s += tag(110, 236, H.tag);
      return s;
    }
  };
  function heroArt() {
    const H = P.hero;
    return `<svg class="cubes" viewBox="0 0 460 290" role="img" aria-label="${esc(H.alt)}">
      <defs><marker id="arr" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="#1f5fe0"/></marker></defs>${HERO_ART[H.type](H)}</svg>`;
  }

  /* ---------- sections ---------- */
  function renderHero() {
    const title = esc(P.title).replace(esc(P.highlight), `<mark class="hl">${esc(P.highlight)}</mark>`);
    const groupName = CAT.groups[P.group] || "";
    document.title = `${P.title} · Programming Plans · buatkode`;
    $("#hero").innerHTML = `
      <div class="wrap">
        <div>
          <div class="crumbs"><a href="../index.html">Plans</a><span>/</span><a href="../index.html#group-${esc(P.group)}">${esc(P.group)} · ${esc(groupName)}</a><span>/</span>${esc(P.title)}</div>
          <h1><span class="code-tag">${esc(P.id)}</span>${title}</h1>
          <p class="aka">Also known as ${P.aka.map((a) => `<b>${esc(a)}</b>`).join(", ")}</p>
          <p class="intent">${esc(P.intent)}</p>
          <div class="chips">
            ${P.core ? '<span class="chip core">★ Core plan</span>' : ""}
            <span class="chip level">Level · ${esc(P.level)}</span>
            <span class="chip">Group ${esc(P.group)} · ${esc(groupName)}</span>
          </div>
        </div>
        <div class="hero-art">
          ${heroArt()}
          <div class="plan-card" aria-hidden="true">
            <div class="pc-title">plan <b>${esc(P.planCard.name)}</b></div>
            <ol>${P.planCard.lines.map((t, i) => `<li><span class="num">${i + 1}</span>${esc(t)}</li>`).join("")}</ol>
            <div class="pc-foot">${esc(P.planCard.foot)}</div>
          </div>
        </div>
      </div>`;
  }

  function renderAnalogy() {
    $("#analogy").innerHTML = `
      <div class="card analogy">
        <div class="icon" aria-hidden="true">${P.analogy.icon}</div>
        <div><h3 class="small">Everyday analogy</h3><h3>${esc(P.analogy.title)}</h3><p>${esc(P.analogy.text)}</p></div>
      </div>`;
  }

  function renderWhen() {
    $("#when").innerHTML = `
      ${sectionHead("01", "When to use it")}
      <div class="card grid-2">
        <div>
          <h3 class="small">Clue words in the problem</h3>
          <div class="cues">${P.cues.map((c) => `<span class="cue">${esc(c)}</span>`).join("")}</div>
          <p class="muted" style="margin:0;font-size:14px">${P.cueSummary}</p>
        </div>
        <div>
          <h3 class="small">Problems that use this plan</h3>
          <ul class="examples">${P.cueExamples.map((e) => `<li>${esc(e)}</li>`).join("")}</ul>
        </div>
      </div>`;
  }

  /* ----- trace views: each draws one event's `view` object ----- */
  const VIEWS = {
    tiles(host, v) {
      host.className = "view tilesv";
      const badges = v.badges || [];
      const row = v.values.length
        ? v.values.map((val, i) => {
          const ptr = i === v.ptr ? '<span class="ptr" aria-hidden="true">▼</span>' : "";
          const badge = badges[i] ? `<span class="badge">${esc(badges[i])}</span>` : "";
          return `<div class="tile ${v.states[i] || ""}">${ptr}${esc(val)}<span class="idx">[${i}]</span>${badge}</div>`;
        }).join("")
        : `<div class="empty-note">${esc(v.emptyNote || "[ ]  (no items to visit)")}</div>`;
      let out = "";
      if (v.out) {
        const items = v.out.items.length
          ? v.out.items.map((x, i) => `<span class="oitem${i === v.out.fresh ? " fresh" : ""}">${esc(x)}</span>`).join("")
          : `<span class="oempty">${esc(v.out.empty || "empty")}</span>`;
        out = `<div class="tiles-out"><span class="to-label">${esc(v.out.label)}</span><div class="to-items${v.out.text ? " text" : ""}">${items}</div></div>`;
      }
      host.innerHTML = `<div class="tiles${badges.some(Boolean) ? " with-badges" : ""}${v.values.length > 6 ? " compact" : ""}">${row}</div>${out}`;
    },
    pipeline(host, v) {
      host.className = "view pipe";
      host.innerHTML = v.stages.map((s, i) => `
        ${i ? '<span class="pipe-arrow" aria-hidden="true">→</span>' : ""}
        <div class="stage ${s.state || ""}">
          <div class="st-label"><span class="num">${s.step}</span>${esc(s.label)}</div>
          ${s.vars.map((x) => `<div class="st-var${x.fresh ? " fresh" : ""}"><span>${esc(x.k)}</span><b>${x.v === undefined ? "·" : esc(x.v)}</b></div>`).join("")}
        </div>`).join("");
    },
    branches(host, v) {
      host.className = "view ladder";
      host.innerHTML = `<div class="subject"><code>${esc(v.subject.k)} = ${esc(v.subject.v)}</code></div>` +
        v.rows.map((r) => `<div class="rung ${r.state || ""}"><code>${esc(r.test)}</code><span class="rung-arrow" aria-hidden="true">→</span><span class="rung-label">${esc(r.label)}</span><span class="rung-state">${{ miss: "false", hit: "true ✓", skipped: "not tested", testing: "testing…" }[r.state] || ""}</span></div>`).join("");
    },
    grid(host, v) {
      host.className = "view gridv";
      const cells = v.cells.map((row, r) => `<div class="grow${r === v.row ? " active" : ""}">${row.map((c) => `<span class="gcell ${c}"></span>`).join("")}<span class="gnl${v.newlines > r ? " done" : ""}">↵</span></div>`).join("");
      host.innerHTML = `<div class="gwrap"><div class="ggrid" style="--n:${v.cells[0] ? v.cells[0].length : 1}">${cells}</div>
        <div class="gout"><div class="gout-h">Output</div><pre>${esc(v.output) || " "}</pre></div></div>`;
    }
  };

  function renderTrace() {
    const T = P.trace, sec = $("#watch");
    sec.innerHTML = `
      ${sectionHead("02", "Watch it run", T.intro)}
      <div class="card trace">
        <div class="trace-stage">
          <div class="presets" role="group" aria-label="Choose an input"></div>
          <div class="view"></div>
          <div class="msg" aria-live="polite"></div>
          <div class="vars"></div>
          <div class="controls">
            <button class="btn" data-act="reset" type="button" title="Back to the start">⏮ Reset</button>
            <button class="btn" data-act="back" type="button">◀ Back</button>
            <button class="btn primary" data-act="next" type="button">Step ▶</button>
            <button class="btn" data-act="play" type="button">▶ Play</button>
            <span class="progress"></span>
          </div>
        </div>
        <div class="trace-code"></div>
      </div>`;

    const presetsEl = $(".presets", sec), viewEl = $(".view", sec), msgEl = $(".msg", sec),
      varsEl = $(".vars", sec), progEl = $(".progress", sec), codeHost = $(".trace-code", sec);
    let events = [], at = 0, timer = null, codeEl = null, presetIdx = 0;

    T.presets.forEach((p, idx) => {
      const b = h(`<button type="button">${esc(p.label)}</button>`);
      b.addEventListener("click", () => { presetIdx = idx; load(p.input); });
      presetsEl.appendChild(b);
    });

    // custom input form, shaped by the plan's input definition
    const I = T.input;
    let form;
    if (I.kind === "list") {
      form = h(`<form><input type="text" inputmode="numeric" aria-label="Your own list of numbers" placeholder="${esc(I.placeholder || "your list: 5, 2, -7")}"><button type="submit" class="btn small">Use</button></form>`);
    } else {
      form = h(`<form>${I.fields.map((f) => f.type === "text"
        ? `<label class="field">${esc(f.label)} <input type="text" class="wide" name="${esc(f.name)}" maxlength="${f.max}" value="${esc(T.presets[0].input[f.name])}"></label>`
        : `<label class="field">${esc(f.label)} <input type="number" name="${esc(f.name)}" min="${f.min}" max="${f.max}" step="1" value="${esc(T.presets[0].input[f.name])}"></label>`).join("")}<button type="submit" class="btn small">Use</button></form>`);
    }
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let input;
      if (I.kind === "list") {
        input = $("input", form).value.split(/[\s,;]+/).filter(Boolean).map(Number).filter(Number.isFinite).map(Math.trunc).slice(0, I.max || 10);
      } else {
        input = {};
        I.fields.forEach((f) => {
          if (f.type === "text") { input[f.name] = $(`input[name="${f.name}"]`, form).value.slice(0, f.max); return; }
          const n = Math.trunc(Number($(`input[name="${f.name}"]`, form).value));
          input[f.name] = Math.min(f.max, Math.max(f.min, Number.isFinite(n) ? n : f.min));
          $(`input[name="${f.name}"]`, form).value = input[f.name];
        });
      }
      presetIdx = -1;
      load(input);
    });
    presetsEl.appendChild(form);

    function load(input) {
      stop(); events = T.run(input); at = 0;
      // keep the custom-input boxes in step with what is being shown
      if (I.kind === "list") $("input", form).value = input.join(", ");
      else I.fields.forEach((f) => { $(`input[name="${f.name}"]`, form).value = input[f.name]; });
      draw();
    }

    function draw() {
      [...presetsEl.querySelectorAll(":scope > button")].forEach((b, i) => b.setAttribute("aria-pressed", String(i === presetIdx)));
      const e = events[at];
      VIEWS[T.type](viewEl, e.view);
      msgEl.className = `msg ${e.tone || ""}`;
      msgEl.innerHTML = `${e.step ? `<span class="num">${e.step}</span>` : ""}<span>${esc(e.msg)}</span>`;
      varsEl.innerHTML = (e.vars || []).map((x) =>
        `<div class="var"><span class="k">${esc(x.k)}</span>${x.role ? `<span class="role ${esc(x.role)}" title="${esc(ROLE_HELP[x.role] || "")}">${esc(x.role)}</span>` : ""}<div class="v">${esc(x.v)}${x.of !== undefined ? `<span class="muted" style="font-size:14px"> / ${esc(x.of)}</span>` : ""}</div></div>`).join("");
      progEl.textContent = `step ${at} of ${events.length - 1}`;
      $('[data-act="back"]', sec).disabled = at === 0;
      $('[data-act="reset"]', sec).disabled = at === 0;
      $('[data-act="next"]', sec).disabled = at === events.length - 1;
      $('[data-act="play"]', sec).textContent = timer ? "⏸ Pause" : at === events.length - 1 ? "↻ Replay" : "▶ Play";
      if (codeEl) codeEl.setActive(e.step);
    }

    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    sec.addEventListener("click", (ev) => {
      const b = ev.target.closest("[data-act]");
      if (!b) return;
      const act = b.dataset.act;
      if (act === "next" && at < events.length - 1) { stop(); at++; }
      if (act === "back" && at > 0) { stop(); at--; }
      if (act === "reset") { stop(); at = 0; }
      if (act === "play") {
        if (timer) stop();
        else {
          if (at === events.length - 1) at = 0;
          timer = setInterval(() => { if (at < events.length - 1) { at++; draw(); } if (at >= events.length - 1) { stop(); draw(); } }, T.speed || 900);
        }
      }
      draw();
    });

    events = T.run(T.presets[0].input);
    onState(() => {
      const im = implFor(state.lang);
      codeEl = codeBlock({ lang: state.lang, lines: im.lines, file: im.file, note: im.fallback ? im.note : null });
      codeHost.innerHTML = "";
      codeHost.appendChild(codeEl);
      draw();
    });
  }

  const ROLE_HELP = {
    walker: "Walker: holds each item of a collection in turn",
    stepper: "Stepper: counts through a known sequence of values (1, 2, 3, …)",
    result: "The answer the function gives back",
    count: "Counter: goes up by one each time something happens",
    fixed: "Fixed value: set once and never changed",
    best: "Best so far: the most suitable value seen up to now",
    gatherer: "Gatherer: collects the items (or total) seen so far",
    flag: "One-way flag: once it changes, it never changes back",
    temp: "Temporary: holds a value for a short while"
  };

  /* ----- steps + code in the chosen language ----- */
  function renderSteps() {
    const sec = $("#steps");
    sec.innerHTML = `
      ${sectionHead("03", "The plan, step by step", "The steps are the same in every language. Hover a step to find it in the code, or a line to find its step.")}
      <div class="grid-2">
        <div class="card"><ol class="steps">${P.steps.map((s) => `<li data-step="${s.n}" tabindex="0"><span class="num">${s.n}</span><div><b>${esc(s.title)}</b><span>${esc(s.text)}</span></div></li>`).join("")}</ol></div>
        <div class="steps-code"></div>
      </div>`;
    const items = [...sec.querySelectorAll(".steps li")];
    let codeEl = null;
    const mark = (n) => { items.forEach((li) => li.classList.toggle("on", Number(li.dataset.step) === n)); if (codeEl) codeEl.setActive(n); };
    items.forEach((li) => {
      li.addEventListener("mouseenter", () => mark(Number(li.dataset.step)));
      li.addEventListener("mouseleave", () => mark(null));
      // keyboard users get the same highlight when a step has focus
      li.addEventListener("focus", () => mark(Number(li.dataset.step)));
      li.addEventListener("blur", () => mark(null));
    });
    onState(() => {
      const im = implFor(state.lang);
      codeEl = codeBlock({ lang: state.lang, lines: im.lines, file: im.file, note: im.note, onLineHover: mark });
      const host = $(".steps-code", sec);
      host.innerHTML = "";
      host.appendChild(codeEl);
    });
  }

  /* ----- the same plan in the languages the reader picks ----- */
  function renderAllLangs() {
    const sec = $("#code");
    sec.innerHTML = `
      ${sectionHead("04", `Same plan, ${NUM_WORD[LANGS.length] || LANGS.length} languages`, "Tick the languages you want to compare. Hover any line: the matching step lights up in every listing. Switch <b>Style</b> in the toolbar to compare the plain version with each language's built-in shortcut.")}
      <fieldset class="lang-picker"><legend class="sr-only">Languages to show</legend>
        <label class="lp-all"><input type="checkbox" data-all> All</label>
        ${LANGS.map((L) => `<label><input type="checkbox" value="${L.id}"> ${esc(L.label)}</label>`).join("")}
      </fieldset>
      <div class="grid-2 all-langs"></div>`;
    const grid = $(".all-langs", sec), picker = $(".lang-picker", sec);
    const boxes = [...picker.querySelectorAll("input[value]")], allBox = $("input[data-all]", picker);

    // which listings to show: remembered per visitor; by default only the toolbar language
    let shown;
    try { shown = JSON.parse(store.get("bk.shown") || "null"); } catch (e) { shown = null; }
    if (!Array.isArray(shown) || !shown.some((id) => LANGS.some((L) => L.id === id))) shown = [state.lang];
    let lastLang = state.lang;

    let blocks = [];
    const markAll = (n) => blocks.forEach((b) => b.setActive(n));
    function draw() {
      shown = LANGS.map((L) => L.id).filter((id) => shown.includes(id));
      store.set("bk.shown", JSON.stringify(shown));
      boxes.forEach((b) => {
        b.checked = shown.includes(b.value);
        b.disabled = shown.length === 1 && b.checked; // keep at least one listing
      });
      allBox.checked = shown.length === LANGS.length;
      allBox.indeterminate = shown.length > 1 && shown.length < LANGS.length;
      grid.innerHTML = "";
      grid.classList.toggle("single", shown.length === 1);
      blocks = shown.map((id) => {
        const L = LANGS.find((x) => x.id === id), im = implFor(id);
        const b = codeBlock({ lang: id, lines: im.lines, file: `${L.label} · ${im.file}`, note: im.note, onLineHover: markAll });
        grid.appendChild(b);
        return b;
      });
    }
    picker.addEventListener("change", (e) => {
      if (e.target === allBox) shown = allBox.checked ? LANGS.map((L) => L.id) : [state.lang];
      else shown = boxes.filter((b) => b.checked).map((b) => b.value);
      if (!shown.length) shown = [state.lang];
      draw();
    });
    onState(() => {
      // when the reader is looking at one language and switches the toolbar, follow along
      if (state.lang !== lastLang && shown.length === 1) shown = [state.lang];
      lastLang = state.lang;
      draw();
    });
  }

  /* ----- pitfalls ----- */
  function renderPitfalls() {
    const sec = $("#pitfalls");
    sec.innerHTML = `${sectionHead("05", "Pitfalls", "The mistakes people make most often with this plan, and what to do instead.")}<div class="pitfalls"></div>`;
    const host = $(".pitfalls", sec);
    onState(() => {
      host.innerHTML = "";
      P.pitfalls.forEach((p) => {
        const el = h(`<article class="pit ${p.kind}${p.wide ? " wide" : ""}">
          <span class="tag">${p.kind === "do" ? "✓ Do" : "✗ Don't"}</span>
          <h3>${esc(p.title)}</h3><p>${p.text}</p><div class="pit-code"></div>
          ${p.take ? `<p class="take">→ ${esc(p.take)}</p>` : ""}</article>`);
        if (p.code) $(".pit-code", el).appendChild(codeBlock({ lang: state.lang, lines: P.snippets[p.code][state.lang], file: `${langLabel(state.lang)} · buggy` }));
        host.appendChild(el);
      });
    });
  }

  /* ----- quiz + exercise ----- */
  function renderTry() {
    const sec = $("#try");
    sec.innerHTML = `
      ${sectionHead("06", "Try it", "Predict first, then check. Then write the plan yourself in your own editor.")}
      <div class="quiz"></div>
      <div class="card exercise" style="margin-top:16px"></div>`;
    const quizEl = $(".quiz", sec);
    const answers = {}; // keeps answers when the language changes

    onState(() => {
      quizEl.innerHTML = "";
      P.quiz.forEach((q, qi) => {
        const el = h(`<div class="card q"><div class="qn">QUESTION ${qi + 1} OF ${P.quiz.length}</div><h3>${esc(withFn(q.q, state.lang))}</h3><div class="qcode"></div><div class="opts"></div><div class="explain"></div></div>`);
        if (q.code) $(".qcode", el).appendChild(codeBlock({ lang: state.lang, lines: P.snippets[q.code][state.lang], file: langLabel(state.lang) }));
        const opts = $(".opts", el), ex = $(".explain", el);
        const show = (picked) => {
          [...opts.children].forEach((b, i) => {
            b.disabled = true;
            if (i === q.answer) b.classList.add("right");
            else if (i === picked) b.classList.add("wrong");
          });
          const ok = picked === q.answer;
          ex.className = `explain show ${ok ? "good" : "bad"}`;
          ex.innerHTML = `<b>${ok ? "Right." : "Not quite."}</b> ${esc(withFn(q.explain, state.lang))}`;
        };
        q.options.forEach((o, oi) => {
          const b = h(`<button type="button" class="opt">${esc(o)}</button>`);
          b.addEventListener("click", () => { answers[qi] = oi; show(oi); });
          opts.appendChild(b);
        });
        if (answers[qi] !== undefined) show(answers[qi]);
        quizEl.appendChild(el);
      });
    });

    // exercise: the plan to follow, test cases to try in your own editor, and a solution
    const X = P.exercise, exEl = $(".exercise", sec);
    const argLit = (v, lang) => {
      if (typeof v === "string") return JSON.stringify(v);
      if (Array.isArray(v)) return `[${v.map((x) => argLit(x, lang)).join(", ")}]`;
      if (typeof v === "boolean") return lang === "python" ? (v ? "True" : "False") : String(v);
      if (typeof v === "number" && !Number.isInteger(v)) return String(+v.toFixed(4));
      return String(v);
    };
    exEl.innerHTML = `
      <div>
        <h3 style="margin:0 0 6px">${esc(X.title)}</h3>
        <p style="margin:0 0 14px;color:var(--ink-2)">${X.task}</p>
        <h3 class="small">The plan to follow</h3>
        <ol class="ex-plan">${X.plan.map((t, i) => `<li><span class="num">${i + 1}</span><span>${esc(t)}</span></li>`).join("")}</ol>
        <h3 class="small" style="margin-top:16px">Test your code with these cases</h3>
        <div class="ex-tests"></div>
        <p class="muted" style="margin:10px 0 0;font-size:14px">Write it in your own editor or an online playground, run each case, and compare. Any language works.</p>
      </div>
      <div>
        <h3 class="small">Solution</h3>
        <p class="muted" style="margin:0 0 10px;font-size:14px">Try it first. The solution follows the same steps as the plan.</p>
        <button class="btn" data-x="sol" type="button">Show solution</button>
        <div class="solution" hidden style="margin-top:12px"></div>
      </div>`;
    const sol = $(".solution", exEl), testsEl = $(".ex-tests", exEl);
    onState(() => {
      const fn = X.fn[state.lang];
      const stdout = X.tests.some((t) => t.stdout !== undefined);
      testsEl.innerHTML = `<div class="table-scroll"><table class="ctable ex-table">
        <thead><tr><th>Call</th><th>${stdout ? "Prints" : "Returns"}</th></tr></thead>
        <tbody>${X.tests.map((t) => `<tr><td><code>${esc(`${fn}(${t.args.map((a) => argLit(a, state.lang)).join(", ")})`)}</code></td>
          <td>${t.stdout !== undefined ? (t.stdout ? `<pre class="ex-out">${esc(t.stdout)}</pre>` : '<span class="muted">nothing</span>') : `<code>${esc(argLit(t.expect, state.lang))}</code>`}</td></tr>`).join("")}</tbody>
      </table></div>`;
      sol.innerHTML = "";
      sol.appendChild(codeBlock({ lang: state.lang, lines: X.solutions[state.lang], file: langLabel(state.lang) }));
    });
    exEl.addEventListener("click", (e) => {
      const b = e.target.closest('[data-x="sol"]');
      if (!b) return;
      sol.hidden = !sol.hidden;
      b.textContent = sol.hidden ? "Show solution" : "Hide solution";
    });
  }

  /* ----- compare with sibling plans ----- */
  function renderCompare() {
    const C = P.compare, sec = $("#compare");
    const rows = C.rows.map((r) => {
      const visual = C.data
        ? `<div class="mini" aria-label="checks ${r.stop == null ? C.data.length : r.stop + 1} of ${C.data.length} items">${C.data.map((v, i) => `<span class="${r.stop == null ? "seen" : i < r.stop ? "seen" : i === r.stop ? "stop" : "unseen"}">${v}</span>`).join("")}</div>`
        : `<div class="cshape">${esc(r.shape)}</div>`;
      return `<div class="crow${r.self ? " self" : ""}">
        <div class="cname"><span class="pcode">${esc(r.id)}</span>${esc(r.name)}<small>${esc(r.question)}</small></div>
        ${visual}
        <div class="cres">→ ${esc(r.result)}</div></div>`;
    }).join("");
    const T = C.table;
    sec.innerHTML = `
      ${sectionHead("07", "Don't confuse it with…", C.intro)}
      <div class="card">
        <div class="compare-rows">${rows}</div>
        <div class="table-scroll"><table class="ctable">
          <thead><tr>${T.head.map((x) => `<th>${esc(x)}</th>`).join("")}</tr></thead>
          <tbody>${T.rows.map((r, i) => `<tr class="${i === T.selfRow ? "self" : ""}">${r.map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody>
        </table></div>
      </div>`;
  }

  function renderRelated() {
    const R = P.related;
    const list = (items) => items.map((r) => {
      const c = catEntry(r.id) || {};
      const title = c.title || r.id;
      return c.live
        ? `<a class="rel" href="${esc(c.slug)}.html"><span class="pcode">${esc(r.id)}</span><span>${esc(title)}<br><span class="why">${esc(r.why)}</span></span><span class="go">Open →</span></a>`
        : `<span class="rel" aria-disabled="true"><span class="pcode">${esc(r.id)}</span><span>${esc(title)}<br><span class="why">${esc(r.why)}</span></span><span class="soon">Coming soon</span></span>`;
    }).join("");
    $("#related").innerHTML = `
      ${sectionHead("08", "Where it fits")}
      <div class="related">
        <div class="card"><h3 class="small">Builds on</h3><div class="rel-list">${R.buildsOn.length ? list(R.buildsOn) : `<p class="muted" style="margin:0">${esc(R.buildsOnNote || "Nothing: this is a starting point.")}</p>`}</div></div>
        <div class="card"><h3 class="small">Leads to</h3><div class="rel-list">${list(R.leadsTo)}</div></div>
      </div>`;
  }

  /* ---------- boot ---------- */
  segmented($("#lang-seg"), LANGS, "lang");
  segmented($("#variant-seg"), [{ id: "plain", label: "Plain" }, { id: "idiomatic", label: "Idiomatic" }], "variant");
  renderHero();
  renderAnalogy();
  renderWhen();
  renderTrace();
  renderSteps();
  renderAllLangs();
  renderPitfalls();
  renderTry();
  renderCompare();
  renderRelated();
})();
