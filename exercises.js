/* ==========================================================================
   RUCK READY — Exercise Library
   Each exercise:
     name      : display name
     equip     : equipment required (all must be available at the location)
     muscles   : muscle groups worked (used to dodge soreness)
     pattern   : movement pattern (used for variety)
     type      : 'strength' | 'conditioning' | 'core' | 'warmup' | 'cooldown'
     intensity : 1 (easy) .. 3 (brutal)
     unit      : how the movement is prescribed ('reps' | 'sec' | 'each' | 'cardio')
   Equipment tags: bodyweight, dumbbell, kettlebell, barbell, rack, bench, treadmill
   Muscle tags:    chest, back, shoulders, arms, legs, core, cardio, fullbody
   ========================================================================== */

const EXERCISES = [
  /* ---------------- WARM-UP (bodyweight, all locations) ---------------- */
  { name:"Jumping Jacks",            equip:["bodyweight"], muscles:["cardio"],            pattern:"cardio", type:"warmup", intensity:1, unit:"sec" },
  { name:"Arm Circles",              equip:["bodyweight"], muscles:["shoulders"],         pattern:"mobility", type:"warmup", intensity:1, unit:"sec" },
  { name:"Leg Swings",               equip:["bodyweight"], muscles:["legs"],              pattern:"mobility", type:"warmup", intensity:1, unit:"each" },
  { name:"World's Greatest Stretch", equip:["bodyweight"], muscles:["legs","core"],       pattern:"mobility", type:"warmup", intensity:1, unit:"each" },
  { name:"Inchworm Walkouts",        equip:["bodyweight"], muscles:["core","shoulders"],  pattern:"mobility", type:"warmup", intensity:1, unit:"reps" },
  { name:"Bodyweight Squats",        equip:["bodyweight"], muscles:["legs"],              pattern:"squat", type:"warmup", intensity:1, unit:"reps" },
  { name:"High Knees",               equip:["bodyweight"], muscles:["cardio","legs"],     pattern:"cardio", type:"warmup", intensity:1, unit:"sec" },
  { name:"Spiderman Lunge + Reach",  equip:["bodyweight"], muscles:["legs","core"],       pattern:"mobility", type:"warmup", intensity:1, unit:"each" },
  { name:"Cat-Cow",                  equip:["bodyweight"], muscles:["core","back"],       pattern:"mobility", type:"warmup", intensity:1, unit:"reps" },
  { name:"Hip Openers",              equip:["bodyweight"], muscles:["legs"],              pattern:"mobility", type:"warmup", intensity:1, unit:"each" },
  { name:"Butt Kicks",               equip:["bodyweight"], muscles:["cardio","legs"],     pattern:"cardio", type:"warmup", intensity:1, unit:"sec" },
  { name:"Scapular Push-ups",        equip:["bodyweight"], muscles:["shoulders","chest"], pattern:"push", type:"warmup", intensity:1, unit:"reps" },

  /* ---------------- STRENGTH — BARBELL (home only) ---------------- */
  { name:"Back Squat",       equip:["barbell","rack"], muscles:["legs"],            pattern:"squat", type:"strength", intensity:3, unit:"reps" },
  { name:"Front Squat",      equip:["barbell","rack"], muscles:["legs","core"],     pattern:"squat", type:"strength", intensity:3, unit:"reps" },
  { name:"Deadlift",         equip:["barbell"],        muscles:["back","legs"],     pattern:"hinge", type:"strength", intensity:3, unit:"reps" },
  { name:"Barbell RDL",      equip:["barbell"],        muscles:["legs","back"],     pattern:"hinge", type:"strength", intensity:2, unit:"reps" },
  { name:"Bench Press",      equip:["barbell","bench"],muscles:["chest","arms"],    pattern:"push", type:"strength", intensity:3, unit:"reps" },
  { name:"Overhead Press",   equip:["barbell"],        muscles:["shoulders","arms"],pattern:"push", type:"strength", intensity:2, unit:"reps" },
  { name:"Bent-Over Row",    equip:["barbell"],        muscles:["back","arms"],     pattern:"pull", type:"strength", intensity:2, unit:"reps" },
  { name:"Barbell Hip Thrust",equip:["barbell","bench"],muscles:["legs"],           pattern:"hinge", type:"strength", intensity:2, unit:"reps" },

  /* ---------------- STRENGTH — RACK / BODYWEIGHT (home) ---------------- */
  { name:"Pull-ups",         equip:["rack"],           muscles:["back","arms"],     pattern:"pull", type:"strength", intensity:3, unit:"reps" },
  { name:"Chin-ups",         equip:["rack"],           muscles:["back","arms"],     pattern:"pull", type:"strength", intensity:3, unit:"reps" },
  { name:"Inverted Rows",    equip:["barbell","rack"], muscles:["back","arms"],     pattern:"pull", type:"strength", intensity:2, unit:"reps" },
  { name:"Hanging Knee Raises",equip:["rack"],         muscles:["core"],            pattern:"core", type:"core", intensity:2, unit:"reps" },

  /* ---------------- STRENGTH — KETTLEBELL (home) ---------------- */
  { name:"Kettlebell Swing",       equip:["kettlebell"], muscles:["legs","back","cardio"], pattern:"hinge", type:"conditioning", intensity:2, unit:"reps" },
  { name:"Goblet Squat",           equip:["kettlebell"], muscles:["legs","core"],          pattern:"squat", type:"strength", intensity:2, unit:"reps" },
  { name:"KB Clean & Press",       equip:["kettlebell"], muscles:["fullbody","shoulders"], pattern:"push", type:"strength", intensity:2, unit:"each" },
  { name:"KB Snatch",              equip:["kettlebell"], muscles:["fullbody","shoulders"], pattern:"pull", type:"conditioning", intensity:3, unit:"each" },
  { name:"Turkish Get-up",         equip:["kettlebell"], muscles:["core","shoulders","fullbody"], pattern:"core", type:"strength", intensity:2, unit:"each" },

  /* ---------------- STRENGTH — DUMBBELL (home + cabin) ---------------- */
  { name:"DB Bench Press",        equip:["dumbbell","bench"], muscles:["chest","arms"],   pattern:"push", type:"strength", intensity:2, unit:"reps" },
  { name:"DB Floor Press",        equip:["dumbbell"],         muscles:["chest","arms"],   pattern:"push", type:"strength", intensity:2, unit:"reps" },
  { name:"DB Shoulder Press",     equip:["dumbbell"],         muscles:["shoulders","arms"],pattern:"push", type:"strength", intensity:2, unit:"reps" },
  { name:"DB Row",                equip:["dumbbell"],         muscles:["back","arms"],    pattern:"pull", type:"strength", intensity:2, unit:"each" },
  { name:"Renegade Row",          equip:["dumbbell"],         muscles:["back","core"],    pattern:"pull", type:"conditioning", intensity:2, unit:"each" },
  { name:"DB Thruster",           equip:["dumbbell"],         muscles:["fullbody","legs","shoulders"], pattern:"squat", type:"conditioning", intensity:3, unit:"reps" },
  { name:"DB Walking Lunge",      equip:["dumbbell"],         muscles:["legs"],           pattern:"lunge", type:"strength", intensity:2, unit:"each" },
  { name:"Bulgarian Split Squat", equip:["dumbbell"],         muscles:["legs"],           pattern:"lunge", type:"strength", intensity:3, unit:"each" },
  { name:"DB Romanian Deadlift",  equip:["dumbbell"],         muscles:["legs","back"],    pattern:"hinge", type:"strength", intensity:2, unit:"reps" },
  { name:"DB Curl",               equip:["dumbbell"],         muscles:["arms"],           pattern:"pull", type:"strength", intensity:1, unit:"reps" },
  { name:"DB Snatch",             equip:["dumbbell"],         muscles:["fullbody","shoulders"], pattern:"pull", type:"conditioning", intensity:3, unit:"each" },
  { name:"Devil Press",           equip:["dumbbell"],         muscles:["fullbody","cardio"], pattern:"full", type:"conditioning", intensity:3, unit:"reps" },
  { name:"Man Makers",            equip:["dumbbell"],         muscles:["fullbody","cardio"], pattern:"full", type:"conditioning", intensity:3, unit:"reps" },
  { name:"DB Push Press",         equip:["dumbbell"],         muscles:["shoulders","legs"],pattern:"push", type:"strength", intensity:2, unit:"reps" },
  { name:"Farmer Carry",          equip:["dumbbell"],         muscles:["fullbody","core"],pattern:"carry", type:"conditioning", intensity:2, unit:"sec" },

  /* ---------------- STRENGTH — BENCH (home) ---------------- */
  { name:"Box/Bench Step-ups",    equip:["dumbbell","bench"], muscles:["legs"],           pattern:"lunge", type:"strength", intensity:2, unit:"each" },
  { name:"Bench Dips",            equip:["bench"],            muscles:["arms","chest"],   pattern:"push", type:"strength", intensity:2, unit:"reps" },

  /* ---------------- BODYWEIGHT (all locations) ---------------- */
  { name:"Push-ups",         equip:["bodyweight"], muscles:["chest","arms"],   pattern:"push", type:"strength", intensity:2, unit:"reps" },
  { name:"Pike Push-ups",    equip:["bodyweight"], muscles:["shoulders","arms"],pattern:"push", type:"strength", intensity:2, unit:"reps" },
  { name:"Diamond Push-ups", equip:["bodyweight"], muscles:["arms","chest"],   pattern:"push", type:"strength", intensity:2, unit:"reps" },
  { name:"Air Squats",       equip:["bodyweight"], muscles:["legs"],           pattern:"squat", type:"conditioning", intensity:1, unit:"reps" },
  { name:"Jump Squats",      equip:["bodyweight"], muscles:["legs","cardio"],  pattern:"squat", type:"conditioning", intensity:2, unit:"reps" },
  { name:"Walking Lunges",   equip:["bodyweight"], muscles:["legs"],           pattern:"lunge", type:"strength", intensity:1, unit:"each" },
  { name:"Reverse Lunges",   equip:["bodyweight"], muscles:["legs"],           pattern:"lunge", type:"strength", intensity:1, unit:"each" },
  { name:"Pistol Squats",    equip:["bodyweight"], muscles:["legs","core"],    pattern:"squat", type:"strength", intensity:3, unit:"each" },
  { name:"Burpees",          equip:["bodyweight"], muscles:["fullbody","cardio"],pattern:"full", type:"conditioning", intensity:3, unit:"reps" },
  { name:"Mountain Climbers",equip:["bodyweight"], muscles:["core","cardio"],  pattern:"core", type:"conditioning", intensity:2, unit:"sec" },
  { name:"Bear Crawl",       equip:["bodyweight"], muscles:["fullbody","core"],pattern:"carry", type:"conditioning", intensity:2, unit:"sec" },
  { name:"Broad Jumps",      equip:["bodyweight"], muscles:["legs","cardio"],  pattern:"squat", type:"conditioning", intensity:2, unit:"reps" },
  { name:"Tuck Jumps",       equip:["bodyweight"], muscles:["legs","cardio"],  pattern:"squat", type:"conditioning", intensity:2, unit:"reps" },
  { name:"Sprint Intervals", equip:["bodyweight"], muscles:["cardio","legs"],  pattern:"cardio", type:"conditioning", intensity:3, unit:"cardio" },
  { name:"Shuttle Runs",     equip:["bodyweight"], muscles:["cardio","legs"],  pattern:"cardio", type:"conditioning", intensity:3, unit:"cardio" },

  /* ---------------- CORE (all locations) ---------------- */
  { name:"Plank",            equip:["bodyweight"], muscles:["core"], pattern:"core", type:"core", intensity:1, unit:"sec" },
  { name:"Hollow Hold",      equip:["bodyweight"], muscles:["core"], pattern:"core", type:"core", intensity:2, unit:"sec" },
  { name:"V-ups",            equip:["bodyweight"], muscles:["core"], pattern:"core", type:"core", intensity:2, unit:"reps" },
  { name:"Russian Twists",   equip:["bodyweight"], muscles:["core"], pattern:"core", type:"core", intensity:1, unit:"reps" },
  { name:"Sit-ups",          equip:["bodyweight"], muscles:["core"], pattern:"core", type:"core", intensity:1, unit:"reps" },
  { name:"Flutter Kicks",    equip:["bodyweight"], muscles:["core"], pattern:"core", type:"core", intensity:1, unit:"sec" },
  { name:"Leg Raises",       equip:["bodyweight"], muscles:["core"], pattern:"core", type:"core", intensity:2, unit:"reps" },
  { name:"Side Plank",       equip:["bodyweight"], muscles:["core"], pattern:"core", type:"core", intensity:1, unit:"each" },

  /* ---------------- CARDIO MACHINE (home only) ---------------- */
  { name:"Treadmill Intervals",   equip:["treadmill"], muscles:["cardio","legs"], pattern:"cardio", type:"conditioning", intensity:3, unit:"cardio" },
  { name:"Treadmill Incline Walk",equip:["treadmill"], muscles:["cardio","legs"], pattern:"cardio", type:"conditioning", intensity:1, unit:"cardio" },
  { name:"Treadmill Tempo Run",   equip:["treadmill"], muscles:["cardio","legs"], pattern:"cardio", type:"conditioning", intensity:2, unit:"cardio" },

  /* ---------------- COOLDOWN (all locations) ---------------- */
  { name:"Child's Pose",         equip:["bodyweight"], muscles:["back"],      pattern:"mobility", type:"cooldown", intensity:1, unit:"sec" },
  { name:"Couch Stretch",        equip:["bodyweight"], muscles:["legs"],      pattern:"mobility", type:"cooldown", intensity:1, unit:"each" },
  { name:"Hamstring Stretch",    equip:["bodyweight"], muscles:["legs"],      pattern:"mobility", type:"cooldown", intensity:1, unit:"each" },
  { name:"Pigeon Stretch",       equip:["bodyweight"], muscles:["legs"],      pattern:"mobility", type:"cooldown", intensity:1, unit:"each" },
  { name:"Doorway Chest Stretch",equip:["bodyweight"], muscles:["chest"],     pattern:"mobility", type:"cooldown", intensity:1, unit:"sec" },
  { name:"Cobra Stretch",        equip:["bodyweight"], muscles:["core","back"],pattern:"mobility", type:"cooldown", intensity:1, unit:"sec" },
  { name:"Figure-Four Stretch",  equip:["bodyweight"], muscles:["legs"],      pattern:"mobility", type:"cooldown", intensity:1, unit:"each" },
  { name:"Box Breathing",        equip:["bodyweight"], muscles:["cardio"],    pattern:"mobility", type:"cooldown", intensity:1, unit:"sec" },
  { name:"Downward Dog",         equip:["bodyweight"], muscles:["back","legs"],pattern:"mobility", type:"cooldown", intensity:1, unit:"sec" },
];

const LOCATION_EQUIPMENT = {
  home:  ["bodyweight","dumbbell","kettlebell","barbell","rack","bench","treadmill"],
  cabin: ["bodyweight","dumbbell"],
};

// Military-flavoured mission names, chosen by focus.
const MISSION_NAMES = {
  strength:     ["Iron Discipline","Anvil","Load Bearing","Heavy Metal","The Forge","Steel Column"],
  conditioning: ["Engine Room","Redline","Gut Check","The Grinder","Afterburner","Smoke Session"],
  fullbody:     ["Full Kit","Combat Ready","Total Force","Field Op","All Points","Standard Issue"],
  grinder:      ["The Suck","Embrace It","Ruck & Roll","Zero Dark","Pain Cave","Last Man Standing"],
};

if (typeof module !== "undefined") { module.exports = { EXERCISES, LOCATION_EQUIPMENT, MISSION_NAMES }; }
