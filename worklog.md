# SUMIKIRI overhaul — worklog

Project: graphical + content overhaul of the uploaded single-file canvas game
`SUMIKIRI 墨斬` (Sekiro-style posture/deflect/deathblow brawler, 7 acts, 7 bosses,
Abyss endless mode). Core combat math must stay intact: parry window .13s,
posture +5/hit +24/parry, decay 7/s, break 2.3s, peril x1.4 unparryable,
deathblow on broken, perfect-dodge via dash, ki art at 100.

Deliverables:
- public/game/index.html — the overhauled game (self-contained, handcrafted style)
- /api/leaderboard — global records for abyss / gauntlet / story runs (Prisma+SQLite)
- src/app/page.tsx — fullscreen shell serving the game

Task plan:
1   (main agent)    game file: art/render/audio/ui overhaul + new enemies (ronin,
                   archer), duel mini-bosses (uzu, zangetsu, jin), gauntlet mode,
                   4 new blessings, wind/weather/lighting/shadow systems,
                   deathblow cinematics, leaderboard client
2-a (subagent)      prisma Run model, /api/leaderboard route, page.tsx shell, db push
3   (main agent)    assemble + lint + dev.log check
4   (main agent)    agent-browser E2E verification + fixes

---
Task ID: 0
Agent: main
Task: planning + spec extraction

Work Log:
- read full upload/index.html (2016 lines) via Explore agent, full mechanics spec extracted
- confirmed stack: Next.js 16 app router, prisma sqlite at db/custom.db, dev server live on 3000
- decided architecture: game stays a single self-contained html file in public/game/,
  embedded via iframe on /; leaderboard via /api/leaderboard

---
Task ID: 2-a
Agent: full-stack-developer
Task: leaderboard API + prisma + game shell page

Work Log:
- replaced demo User/Post models in prisma/schema.prisma with the Run model
  (id/name/mode/wave/kills/timeSec/difficulty/createdAt), generator + datasource
  blocks untouched; ran `bun run db:push` (client regenerated, schema in sync)
- created src/app/api/leaderboard/route.ts with `dynamic = 'force-dynamic'`:
  GET (mode whitelist abyss|gauntlet|story default abyss, limit clamp 1..50
  default 20, ordering abyss wave DESC+timeSec ASC else timeSec ASC, returns
  { rows }); POST (per-IP in-memory rate limit 30/min via x-forwarded-for
  fallback 'local', 429 'slow down'; strict validation of mode/name/wave/
  kills/timeSec/difficulty, name trim+collapse+clamp 16 fallback 'Nameless';
  insert then rank = count(strictly better)+1, 201 { ok, rank, id }; 400/500
  { ok:false, error }); no any, all DB calls in try/catch
- rewrote src/app/page.tsx as a client component: fullscreen fixed iframe
  (100vw/100dvh, border none, title "SUMIKIRI", allow fullscreen,
  background #e9e1cd) serving /game/index.html; paper splash with 墨斬 kanji,
  red #b3372a seal rotated 6deg, "sumikiri — ink & steel" caption; fades out
  over 500ms on iframe onLoad then unmounts; body overflow hidden via
  useEffect, no header/footer, zero scrollbars
- updated layout.tsx metadata only: title "SUMIKIRI 墨斬 — ink & steel",
  description "A hack & slash painted in ink. Posture, deflection, and one
  honest blade."
- ran `bun run lint` (clean, no errors), verified dev.log shows
  POST 201 / GET 200 / 400 paths compiling and serving correctly
- did NOT create or modify public/game/index.html (owned by another agent;
  currently 404 in dev.log which is expected until that agent lands it)

Stage Summary:
- modified: prisma/schema.prisma (Run model), src/app/layout.tsx (metadata)
- created: src/app/api/leaderboard/route.ts, rewrote src/app/page.tsx
- curl POST test run:
  {"ok":true,"rank":1,"id":"cmuxmx9qq0000pry4ekdctqge"} -> HTTP 201
- curl POST better run (wave 6): {"ok":true,"rank":1,...} -> 201 (rank math ok)
- curl POST invalid mode: {"ok":false,"error":"invalid mode"} -> 400
- curl GET ?mode=abyss:
  {"rows":[{"id":"cmuxmx9qq0000pry4ekdctqge","name":"test","mode":"abyss",
  "wave":5,"kills":40,"timeSec":120.5,"difficulty":1,
  "createdAt":"2026-10-07T04:56:07.827Z"}]} -> HTTP 200 (wave DESC confirmed
  with second row)

---
Task ID: 1
Agent: main
Task: SUMIKIRI graphical/content overhaul (public/game/index.html)

Work Log:
- extracted exact data tables + combat code from upload (weapons, enemies, bosses,
  BOSSMOVES verbatim, acts, blessings, shrine, difficulty, save format)
- rewrote the game as a single handcrafted file (2883 lines), core math unchanged:
  parry .13s window, posture +5/hit +24/parry decay 7/s, break 2.3s, peril x1.4
  unparryable, deathblow on broken, perfect dodge via dash, ki art at 100, all
  weapon/blessing/shrine/diff values identical
- graphics: per-act painterly floors + live wind-swayed props (rice/reeds/bamboo/
  snow/pines/burnt stalks), per-act color grading + directional shadows, weather
  (petals/rain/snow/leaves/ash/embers/ink specks + lightning in act 5), guiding-wind
  gust streaks, fireflies, water shimmer (act 2), ukiyo-e title scene (layered
  ridges, red sun, drifting mist, birds), redesigned HUD (brush hp bar, ki ring,
  dash pips, style ranks, boss bars with posture + phase notch), deflect gold
  sparks, deathblow/ki-art cinematics with letterbox + zoom punch + kanji fx,
  brush-wipe stage transitions, revamped DOM screens (frosted paper, hanging
  scroll blessings, stamp animations)
- audio: taiko, sting, thunder, swish, heal chord, extra parry chime layered onto
  the original karplus-strong engine
- content: ronin (chain slashes + gold riposte) and archer (arrow volleys,
  deflectable) enemy types; three named duel bosses in acts 2/4/6 (uzu 渦, zangetsu
  残, jin 燼); gauntlet mode (10 duels back to back, unlocks after story); 4 new
  blessings (息 breath, 酒 sake, 風 windblade, 雷 thunder); enemy posture bars;
  bestiary + controls help rewrite
- leaderboard client: name carving screen (銘), auto-submit on abyss death /
  gauntlet death+clear / story clear, records screen with per-mode tabs
- fixed during verification: audio init paren, init TDZ on resize, iframe splash
  race (load event before hydration -> poll + hard timeout, page.tsx), missing
  `on` class on title screen, gauntlet victory returning to death screen

Stage Summary:
- public/game/index.html: the overhauled game (also fetches /api/leaderboard)
- browser-verified: boot, movement, attack, deflect (+24 posture), posture break,
  deathblow, ki art, dash + perfect dodge, ronin riposte, archer arrows, boss AI
  + intro + bar, duel bosses, gauntlet, stage/wave/bless flow, death/clear/victory
  screens, records + live API submit + rank display, all menus, pause/escape
- VLM-verified renders: title (menu + scene), combat (HUD + slash fx + grass),
  boss (banner + bar + dash ghosts), no glitches reported
