/* ==========================================================================
   RUCK READY — Workout Engine
   Rules-based generator. Takes today's check-in, returns a structured session.
   input = {
     energy   : 1..4   (1 Drained, 2 OK, 3 Good, 4 Fired up)
     sore     : []      subset of ['chest','back','shoulders','arms','legs','core']
     location : 'home' | 'cabin'
     focus    : 'strength' | 'conditioning' | 'fullbody' | 'grinder'
     minutes  : 20 | 30 | 45 | 60
     avoid    : []      exercise names used last session (to keep it fresh)
   }
   ========================================================================== */

function generateWorkout(input) {
  const energy   = input.energy || 3;
  const sore     = input.sore || [];
  const location = input.location || "home";
  const focus    = input.focus || "fullbody";
  const minutes  = input.minutes || 45;
  const avoid    = input.avoid || [];

  const vm = { 1: 0.7, 2: 0.9, 3: 1.0, 4: 1.15 }[energy];
  const energyLabel = { 1: "Drained", 2: "OK", 3: "Good", 4: "Fired up" }[energy];

  // ---- available equipment for this location ----
  const avail = LOCATION_EQUIPMENT[location];
  const canDo = ex => ex.equip.every(e => avail.includes(e));

  const warmupPool  = EXERCISES.filter(e => e.type === "warmup"  && canDo(e));
  const cooldownPool= EXERCISES.filter(e => e.type === "cooldown"&& canDo(e));

  let mainPool = EXERCISES.filter(e => canDo(e) && e.type !== "warmup" && e.type !== "cooldown");

  // ---- dodge sore muscle groups ----
  let soreNote = null;
  if (sore.length) {
    const filtered = mainPool.filter(e => !e.muscles.some(m => sore.includes(m)));
    if (filtered.length >= 8) {
      mainPool = filtered;
      soreNote = `Programmed around your sore ${sore.join(" & ")} — nothing loads them directly today.`;
    } else {
      // Too restrictive (e.g. everything sore): keep full pool but flag it.
      soreNote = `You flagged a lot of soreness. Kept intensity down; skip anything that pinches.`;
    }
  }

  const strengthPool = mainPool.filter(e => e.type === "strength");
  const condPool     = mainPool.filter(e => e.type === "conditioning" || e.type === "strength");
  const corePool     = mainPool.filter(e => e.type === "core");
  const cardioPool   = mainPool.filter(e => e.pattern === "cardio");

  // ---------- helpers ----------
  const shuffle = arr => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  // pick n exercises with pattern variety, pushing recently-used ones to the back
  const pick = (pool, n, extraAvoid = []) => {
    if (!pool.length) return [];
    const dontRepeat = new Set([...avoid, ...extraAvoid]);
    let p = shuffle(pool);
    p.sort((a, b) => (dontRepeat.has(a.name) ? 1 : 0) - (dontRepeat.has(b.name) ? 1 : 0));
    const chosen = [];
    const patterns = {};
    for (const ex of p) {
      if (chosen.length >= n) break;
      if ((patterns[ex.pattern] || 0) >= 2) continue; // max 2 of a pattern
      chosen.push(ex);
      patterns[ex.pattern] = (patterns[ex.pattern] || 0) + 1;
    }
    for (const ex of p) { // backfill if variety rule left us short
      if (chosen.length >= n) break;
      if (!chosen.includes(ex)) chosen.push(ex);
    }
    return chosen.slice(0, n);
  };

  const scale = v => Math.max(1, Math.round(v * vm));

  // prescription string for one exercise, given mode 'strength' | 'cond'
  const pres = (ex, mode) => {
    if (ex.unit === "cardio") return `${scale(mode === "strength" ? 4 : 6)} × 40s hard / 20s easy`;
    if (ex.unit === "sec")    return `${scale(ex.type === "core" ? 40 : (mode === "strength" ? 40 : 35))}s`;
    if (ex.unit === "each") {
      let base = mode === "strength" ? 8 : 10;
      if (ex.intensity === 3) base -= 2;
      return `${scale(base)} each side`;
    }
    let base = mode === "strength"
      ? (ex.intensity === 3 ? 5 : ex.intensity === 2 ? 8 : 12)
      : (ex.intensity === 3 ? 10 : ex.intensity === 2 ? 12 : 15);
    return `${scale(base)} reps`;
  };

  const item = (ex, mode) => ({ name: ex.name, prescription: pres(ex, mode), muscles: ex.muscles });

  const strengthSets = Math.min(5, Math.max(3, Math.round(4 * vm)));
  const roundsFor = () => {
    let b = minutes >= 60 ? 5 : minutes >= 45 ? 4 : minutes >= 30 ? 3 : 2;
    if (energy >= 4) b += 1;
    if (energy <= 1) b = Math.max(2, b - 1);
    return b;
  };

  // ---------- build blocks ----------
  const blocks = [];
  const usedNames = [];
  const register = list => list.forEach(x => usedNames.push(x.name));

  // Warm-up
  const wuCount = minutes >= 45 ? 4 : 3;
  const warmup = pick(warmupPool, wuCount);
  register(warmup);
  blocks.push({
    heading: "WARM-UP",
    format: `~${minutes >= 45 ? 6 : 4} min · raise the heart rate, loosen up`,
    items: warmup.map(e => item(e, "cond")),
  });

  // Main work by focus
  if (focus === "strength") {
    const heavy = strengthPool.filter(e => ["squat","hinge","push","pull"].includes(e.pattern) && e.intensity >= 2);
    const lifts = pick(heavy.length >= 2 ? heavy : strengthPool, 2, usedNames);
    register(lifts);
    blocks.push({
      heading: "MAIN STRENGTH",
      format: `${strengthSets} sets each · rest 90–120s · push the load`,
      items: lifts.map(e => item(e, "strength")),
    });
    const acc = pick(strengthPool, minutes >= 45 ? 3 : 2, usedNames);
    register(acc);
    blocks.push({
      heading: "ACCESSORY",
      format: `3 rounds · rest 45–60s`,
      items: acc.map(e => item(e, "strength")),
    });
    if (minutes >= 45 && energy >= 2) {
      const fin = pick(condPool.filter(e => e.intensity >= 2), 2, usedNames);
      register(fin);
      blocks.push({ heading: "FINISHER", format: `AMRAP 5 min · steady pace`, items: fin.map(e => item(e, "cond")) });
    }

  } else if (focus === "conditioning") {
    const rounds = roundsFor();
    const circuit = pick(condPool, minutes >= 45 ? 5 : 4, usedNames);
    register(circuit);
    blocks.push({
      heading: "CONDITIONING CIRCUIT",
      format: `${rounds} rounds for time · rest 60s between rounds`,
      items: circuit.map(e => item(e, "cond")),
    });
    if (cardioPool.length && minutes >= 45) {
      const cardio = pick(cardioPool, 1, usedNames);
      register(cardio);
      blocks.push({ heading: "CARDIO FINISHER", format: `all-out`, items: cardio.map(e => item(e, "cond")) });
    }
    const core = pick(corePool, 2, usedNames);
    register(core);
    if (core.length) blocks.push({ heading: "CORE", format: `2 rounds`, items: core.map(e => item(e, "cond")) });

  } else if (focus === "grinder") {
    const amrap = minutes >= 60 ? 30 : minutes >= 45 ? 20 : minutes >= 30 ? 15 : 10;
    const pref = condPool.filter(e => ["full","fullbody"].includes(e.pattern) || e.muscles.includes("fullbody") || e.type === "conditioning");
    const grind = pick((pref.length >= 5 ? pref : condPool), minutes >= 45 ? 6 : 5, usedNames);
    register(grind);
    blocks.push({
      heading: `THE GRINDER — AMRAP ${amrap} MIN`,
      format: `As many rounds as possible · minimal rest · embrace the suck`,
      items: grind.map(e => item(e, "cond")),
    });
    const core = pick(corePool, 2, usedNames);
    register(core);
    if (core.length) blocks.push({ heading: "CORE FINISHER", format: `2 rounds, unbroken`, items: core.map(e => item(e, "cond")) });

  } else { // fullbody
    const lifts = pick(strengthPool.filter(e => e.intensity >= 2), 2, usedNames);
    register(lifts);
    blocks.push({
      heading: "STRENGTH",
      format: `${strengthSets} sets each · rest 75–90s`,
      items: lifts.map(e => item(e, "strength")),
    });
    const rounds = roundsFor();
    const circuit = pick(condPool, minutes >= 45 ? 4 : 3, usedNames);
    register(circuit);
    blocks.push({
      heading: "CIRCUIT",
      format: `${rounds} rounds · rest 60s`,
      items: circuit.map(e => item(e, "cond")),
    });
    const core = pick(corePool, 1, usedNames);
    register(core);
    if (core.length) blocks.push({ heading: "CORE", format: `2 rounds`, items: core.map(e => item(e, "cond")) });
  }

  // Cooldown
  const cool = pick(cooldownPool, minutes >= 45 ? 4 : 3);
  register(cool);
  blocks.push({
    heading: "COOLDOWN & MOBILITY",
    format: `~5 min · slow breathing, long holds`,
    items: cool.map(e => item(e, "cond")),
  });

  // ---------- coaching note ----------
  const coachNotes = {
    1: "Drained today — this is a recovery-flavoured session. Move well, keep it honest, don't chase a PR.",
    2: "Feeling OK — solid, no-drama work. Bank the volume and finish strong.",
    3: "Good energy — hit the prescribed numbers and leave a rep or two in reserve.",
    4: "Fired up — push the loads, close the gaps between sets. Make it a smoke session.",
  };

  const names = MISSION_NAMES[focus];
  const title = names[Math.floor(Math.random() * names.length)];

  return {
    title,
    focus,
    location,
    minutes,
    energyLabel,
    coachNote: coachNotes[energy],
    soreNote,
    blocks,
    allNames: usedNames, // stored so tomorrow's session avoids repeats
    date: new Date().toISOString(),
  };
}

if (typeof module !== "undefined") { module.exports = { generateWorkout }; }
