/* ==========================================================================
   RUCK READY — App controller
   Wires the check-in UI to the engine, renders the workout, and handles
   logging + history + streak using the browser's localStorage (device-only).
   ========================================================================== */
(function () {
  "use strict";

  const LS = {
    history: "rr_history",   // array of completed sessions
    last:    "rr_last",      // exercise names from last session (avoid repeats)
    prefs:   "rr_prefs",     // remembered location + time
  };
  const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
  const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

  // ---- check-in state ----
  const prefs = load(LS.prefs, {});
  const state = {
    location: prefs.location || null,
    energy:   null,
    sore:     [],
    focus:    null,
    minutes:  prefs.minutes || null,
  };
  let currentWorkout = null;

  const $  = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));

  /* ---------- single-select grids ---------- */
  function wireSingle(gridId, key, cast) {
    const grid = document.getElementById(gridId);
    grid.addEventListener("click", e => {
      const opt = e.target.closest(".opt");
      if (!opt) return;
      grid.querySelectorAll(".opt").forEach(o => o.classList.remove("sel"));
      opt.classList.add("sel");
      state[key] = cast ? cast(opt.dataset.v) : opt.dataset.v;
    });
  }
  wireSingle("locGrid",    "location");
  wireSingle("energyGrid", "energy",  Number);
  wireSingle("focusGrid",  "focus");
  wireSingle("timeGrid",   "minutes", Number);

  // prefill remembered prefs
  function preselect(gridId, val) {
    if (val == null) return;
    const el = document.querySelector(`#${gridId} .opt[data-v="${val}"]`);
    if (el) el.classList.add("sel");
  }
  preselect("locGrid", state.location);
  preselect("timeGrid", state.minutes);

  /* ---------- soreness chips (multi, with "none") ---------- */
  const soreWrap = $("#soreChips");
  soreWrap.addEventListener("click", e => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    const v = chip.dataset.v;
    if (v === "none") {
      soreWrap.querySelectorAll(".chip").forEach(c => c.classList.remove("sel"));
      chip.classList.add("sel");
      state.sore = [];
      return;
    }
    soreWrap.querySelector('.chip.none').classList.remove("sel");
    chip.classList.toggle("sel");
    state.sore = $$("#soreChips .chip.sel:not(.none)").map(c => c.dataset.v);
  });

  /* ---------- generate ---------- */
  $("#genBtn").addEventListener("click", () => {
    const missing = [];
    if (!state.location) missing.push("a location");
    if (!state.energy)   missing.push("your energy");
    if (!state.focus)    missing.push("a focus");
    if (!state.minutes)  missing.push("your time");
    if (missing.length) { flash($("#genBtn"), "Pick " + missing.join(", ")); return; }

    save(LS.prefs, { location: state.location, minutes: state.minutes });
    makeWorkout();
    showScreen("workout");
  });

  function makeWorkout() {
    currentWorkout = generateWorkout({
      energy: state.energy, sore: state.sore, location: state.location,
      focus: state.focus, minutes: state.minutes, avoid: load(LS.last, []),
    });
    renderWorkout();
  }

  /* ---------- render workout ("mission briefing") ---------- */
  function renderWorkout() {
    const w = currentWorkout;
    const locLabel = w.location === "home" ? "Home Gym" : "Lake Cabin";
    const focusLabel = { strength:"Strength", conditioning:"Conditioning", fullbody:"Full-Body", grinder:"Grinder" }[w.focus];

    let html = `
      <div class="brief fade">
        <div class="kick">// Today's Mission</div>
        <h1>${w.title}</h1>
        <div class="meta">
          <span class="tag">◷ <b>${w.minutes} min</b></span>
          <span class="tag">▣ <b>${focusLabel}</b></span>
          <span class="tag">⌂ <b>${locLabel}</b></span>
          <span class="tag">⚡ <b>${w.energyLabel}</b></span>
        </div>
        <div class="note">${w.coachNote}</div>
        ${w.soreNote ? `<div class="note sore">${w.soreNote}</div>` : ""}
      </div>`;

    w.blocks.forEach(b => {
      html += `<div class="block fade"><div class="bh"><h3>${b.heading}</h3><div class="fmt">${b.format}</div></div>`;
      b.items.forEach(it => {
        const mus = (it.muscles || []).filter(m => m !== "cardio" && m !== "fullbody").join(" · ");
        html += `<div class="ex"><div><div class="exn">${it.name}</div>${mus ? `<div class="exm">${mus}</div>` : ""}</div>
                 <div class="rx">${it.prescription}</div></div>`;
      });
      html += `</div>`;
    });

    html += `
      <div class="rowbtns">
        <button class="btn" id="regenBtn">↻ Regenerate</button>
        <button class="btn" id="editBtn">‹ Change Check-in</button>
        <button class="btn done" id="doneBtn">✓ Mark Complete</button>
      </div>`;

    $("#screen-workout").innerHTML = html;
    $("#regenBtn").addEventListener("click", () => { makeWorkout(); window.scrollTo({ top: 0, behavior: "smooth" }); });
    $("#editBtn").addEventListener("click", () => showScreen("checkin"));
    $("#doneBtn").addEventListener("click", completeWorkout);
  }

  /* ---------- complete + log ---------- */
  function completeWorkout() {
    const w = currentWorkout;
    const hist = load(LS.history, []);
    hist.unshift({
      date: new Date().toISOString(),
      title: w.title, focus: w.focus, location: w.location,
      minutes: w.minutes, energyLabel: w.energyLabel,
    });
    save(LS.history, hist);
    save(LS.last, w.allNames);   // so tomorrow avoids repeats
    renderHistory();
    updateStreak();
    showScreen("history");
  }

  /* ---------- streak ---------- */
  function dayKey(d) { const x = new Date(d); return `${x.getFullYear()}-${x.getMonth()}-${x.getDate()}`; }
  function computeStreak(hist) {
    if (!hist.length) return 0;
    const days = new Set(hist.map(h => dayKey(h.date)));
    let streak = 0;
    const cur = new Date();
    // allow the streak to still count if they haven't trained *today* yet
    if (!days.has(dayKey(cur))) cur.setDate(cur.getDate() - 1);
    while (days.has(dayKey(cur))) { streak++; cur.setDate(cur.getDate() - 1); }
    return streak;
  }
  function updateStreak() { $("#streakN").textContent = computeStreak(load(LS.history, [])); }

  /* ---------- history screen ---------- */
  function renderHistory() {
    const hist = load(LS.history, []);
    const el = $("#screen-history");
    if (!hist.length) {
      el.innerHTML = `<div class="empty fade"><span class="bg">No missions logged</span>
        Generate today's workout, crush it, and hit <b>Mark Complete</b> to start your streak.</div>`;
      return;
    }
    // stats
    const now = new Date();
    const weekAgo = new Date(now); weekAgo.setDate(now.getDate() - 7);
    const thisWeek = hist.filter(h => new Date(h.date) >= weekAgo).length;
    const totalMin = hist.reduce((s, h) => s + (h.minutes || 0), 0);
    const hrs = (totalMin / 60).toFixed(totalMin >= 600 ? 0 : 1);

    let html = `<h2 class="section">Your record</h2>
      <div class="stats fade">
        <div class="stat"><div class="v">${hist.length}</div><div class="k">Total</div></div>
        <div class="stat"><div class="v">${thisWeek}</div><div class="k">This Week</div></div>
        <div class="stat"><div class="v">${hrs}</div><div class="k">Hours</div></div>
      </div>
      <h2 class="section">Mission log</h2>`;

    hist.forEach(h => {
      const d = new Date(h.date);
      const day = d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
      const locLabel = h.location === "home" ? "Home Gym" : "Lake Cabin";
      html += `<div class="hcard fade"><div>
        <div class="ht">${h.title}</div>
        <div class="hs">${h.focus} · ${locLabel} · ${h.minutes} min · felt ${h.energyLabel}</div>
      </div><div class="hd">${day}</div></div>`;
    });
    html += `<button class="clear" id="clearBtn">Clear all history</button>`;
    el.innerHTML = html;
    $("#clearBtn").addEventListener("click", () => {
      if (confirm("Delete your entire workout log? This can't be undone.")) {
        save(LS.history, []); save(LS.last, []); renderHistory(); updateStreak();
      }
    });
  }

  /* ---------- screen / tab switching ---------- */
  function showScreen(name) {
    $("#screen-checkin").classList.toggle("hidden", name !== "checkin");
    $("#screen-workout").classList.toggle("hidden", name !== "workout");
    $("#screen-history").classList.toggle("hidden", name !== "history");
    $("#tab-today").classList.toggle("on", name !== "history");
    $("#tab-history").classList.toggle("on", name === "history");
    window.scrollTo({ top: 0 });
  }
  $("#tab-today").addEventListener("click", () => showScreen(currentWorkout ? "workout" : "checkin"));
  $("#tab-history").addEventListener("click", () => { renderHistory(); showScreen("history"); });

  /* ---------- tiny helper: flash a message on a button ---------- */
  function flash(btn, msg) {
    const orig = btn.textContent;
    btn.textContent = msg;
    btn.style.background = "var(--amber)";
    setTimeout(() => { btn.textContent = orig; btn.style.background = ""; }, 1600);
  }

  /* ---------- boot ---------- */
  updateStreak();
  renderHistory();
})();
