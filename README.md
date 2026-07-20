# Ruck Ready

A no-nonsense, military-style workout generator built for **you**: 47, high fitness, 4 sessions a week, ~45 minutes, bodyweight-heavy. Every day it asks how you're feeling and where you're training, then hands you a custom "mission" for the day.

Everything runs **100% in the browser** — no accounts, no internet required after the first load, no monthly fees. Your workout log is saved privately on your own device.

---

## What it does

- **Daily check-in** — location (Home Gym or Lake Cabin), energy, soreness, focus, and time.
- **Custom workout every time** — a rules engine picks and scales a full session (warm-up → main work → finisher → cooldown) from a library of ~85 military / bodyweight / free-weight movements.
- **Knows your two gyms** — Home Gym uses the barbell, rack, kettlebells, dumbbells, bench, and treadmill. Lake Cabin drops to dumbbells + bodyweight automatically.
- **Trains around soreness** — flag a sore area and it won't load that muscle group directly.
- **Scales to how you feel** — "Drained" pulls volume back for a recovery session; "Fired up" turns it into a smoke session.
- **Four focus modes** — Strength, Conditioning, Full-Body, and Grinder (a military AMRAP/chipper).
- **Logs & streaks** — mark a session complete to build your streak; the next day's workout avoids repeating what you just did.

---

## How to run it

**Option A — just open it (easiest)**

Double-click `index.html`. It opens in your browser and works immediately. That's it.

**Option B — put it online for free with GitHub Pages**

So you can pull it up on your phone at the cabin, from any browser:

1. **Make a GitHub account** at [github.com](https://github.com) if you don't have one.
2. **Create a new repository** — click the **+** (top right) → **New repository**. Name it `ruck-ready`, set it to **Public**, and click **Create repository**.
3. **Upload the files** — on the new repo page click **uploading an existing file**, then drag in all the files from this folder:
   - `index.html`
   - `app.js`
   - `engine.js`
   - `exercises.js`
   - `README.md`

   Click **Commit changes**.
4. **Turn on Pages** — go to the repo's **Settings** → **Pages** (left sidebar). Under *Branch*, pick **main** and **/ (root)**, then **Save**.
5. Wait about a minute, refresh, and GitHub shows your live link — something like:
   `https://YOUR-USERNAME.github.io/ruck-ready/`
6. Open that link on your phone and **add it to your home screen** (Share → *Add to Home Screen*) so it behaves like an app.

> If you'd rather use the command line later, it's just: `git init`, `git add .`, `git commit -m "first"`, then push to your new repo. But the drag-and-drop upload above needs no tools at all.

---

## Files

| File | What it is |
|------|-----------|
| `index.html` | The screen layout and styling |
| `app.js` | Runs the check-in, shows the workout, handles your log & streak |
| `engine.js` | The workout brain — builds and scales each session |
| `exercises.js` | The exercise library (edit this to add your own movements) |

---

## Make it your own

Want to add an exercise? Open `exercises.js` and copy one of the existing lines, for example:

```js
{ name:"Sandbag Clean", equip:["dumbbell"], muscles:["fullbody","legs"], pattern:"full", type:"conditioning", intensity:3, unit:"reps" },
```

- `equip` — what it needs (`bodyweight`, `dumbbell`, `kettlebell`, `barbell`, `rack`, `bench`, `treadmill`). Only movements whose gear is present at the chosen location get used.
- `muscles` — used to steer around soreness.
- `unit` — how it's counted: `reps`, `sec` (seconds), `each` (per side), or `cardio` (intervals).

Save the file and reload — it's in the rotation.

---

*Built for Stefan. Stay ruck ready.*
