# 墨斬 — SUMIKIRI
### *A Hack & Slash Action Roguelike, Painted in Ink*

[![License: MIT](https://img.shields.io/badge/License-MIT-b3372a.svg)](LICENSE)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-1d1a16.svg)](package.json)
[![Tech: HTML5 Canvas](https://img.shields.io/badge/Tech-HTML5_Canvas_2D-8f6d1f.svg)](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
[![Audio: Web Audio API](https://img.shields.io/badge/Audio-Procedural_Web_Audio-2c3550.svg)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
[![Playable in Browser](https://img.shields.io/badge/Playable-Browser_Instant-b3372a.svg)](#quick-start)

> *"Rice fields drink the sun.*  
> *A blade wakes in black ink.*  
> *The crows have noticed."*

---

## ✦ Overview

**SUMIKIRI (墨斬)** is a fast-paced, precision-driven top-down hack & slash roguelike running entirely within a single standalone HTML file. Inspired by classical Japanese *sumi-e* (墨絵) ink wash brushwork and high-octane character action games, every slash, impact, dash, and death is rendered as physical strokes of black ink and vermilion cinnabar across textured washi paper.

Built without external game engines, sprite sheets, audio samples, or asset bundles, **SUMIKIRI** features:
- **Procedural Canvas Rendering:** Dynamic ink splatters, fluid calligraphy arcs, brush bleed trails, and custom kanji stamps.
- **Synthesized Web Audio Engine:** Procedural Karplus-Strong plucked strings (koto/shamisen), taiko drum resonance, and crisp metallic parry frequencies generated directly via math and oscillators.
- **Deterministic Action Combat:** Microsecond hit-stop frames, screenshake trauma, invulnerability-frame dashes, directional projectile deflection, and readable telegraphed threat zones.
- **Substantial Roguelike Depth:** 7 hand-crafted story Acts, 7 multi-phase bosses, an endless Abyss survival mode, 4 weapons, 21 inkmark blessings, and permanent shrine meta-progression.

---

## ⚔ Combat Fundamentals

Combat in *SUMIKIRI* is built around deliberate aggression, positioning, and strict readability. **There is no passive collision damage**—you are only hurt by telegraphed attacks that you can counter or avoid.

| Action | Control | Mechanic & Frame Data |
| :--- | :--- | :--- |
| **Move** | <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> / <kbd>Arrows</kbd> | Analog velocity blending with responsive deceleration. |
| **Aim** | <kbd>Mouse Cursor</kbd> | Full $360^\circ$ crosshair targeting for strikes, lunges, and projectile parries. |
| **Slash** | <kbd>Left Click</kbd> | Multi-hit combo chain. Input buffering allows fluid combo flow without mashing. |
| **Parry** | <kbd>Right Click</kbd> | Perfect-parry red/golden flashes. Freezes time, staggers foes, and reflects projectiles back at attackers. |
| **Shadow Dash** | <kbd>Space</kbd> | Consumes 1 droplet charge for invincible evasion ($i$-frames). Immediately cancels attack windups. |
| **Ki Art (絶)** | <kbd>E</kbd> | Unlocked at 100% Ki. Unleashes a $360^\circ$ ink shockwave that pierces armor and purges projectiles. |
| **Armory Swap** | <kbd>1</kbd> – <kbd>4</kbd> | Instantly switches between owned weapons mid-encounter to adapt to enemy formations. |
| **Sound / Pause** | <kbd>M</kbd> / <kbd>Esc</kbd> | Toggle audio synthesis mute or pause to configure settings mid-run. |

### Reading the Ink
- **Red Indicators (朱):** Standard lethal strikes, lunges, or projectile volleys. Can be dodged with a dash or countered with a timed parry.
- **Golden Flashes (金):** Heavy boss techniques and unblockable slashes. Can **only** be answered with a frame-perfect parry.
- **Style Rank System:** Landing consecutive hits without suffering damage builds your rank through six tiers:
  $$\text{初 (Student)} \;\longrightarrow\; \text{中 (Adept)} \;\longrightarrow\; \text{上 (Expert)} \;\longrightarrow\; \text{極 (Master)} \;\longrightarrow\; \text{鬼 (Oni)} \;\longrightarrow\; \text{神 (Kami)}$$
  Higher style ranks dramatically multiply the Ash (灰) collected from vanquished enemies.

---

## 🗡 Weapons of the Armory

Switch weapons dynamically to suit different enemy archetypes and boss patterns:

| Weapon | Kanji | Attack Rhythm | Range | Special Traits |
| :--- | :---: | :---: | :---: | :--- |
| **Katana** | 刀 | $0.24\text{s}$ (3-hit) | $84\text{px}$ | Balanced reach, fast recovery, honest and adaptable. |
| **Naginata** | 薙 | $0.34\text{s}$ (3-hit) | $122\text{px}$ | Extended cleave radius; combo finisher executes a complete $360^\circ$ spin. |
| **Twin Blades** | 双 | $0.17\text{s}$ (4-hit) | $68\text{px}$ | High-frequency flurry with innate $+8\%$ critical strike chance. |
| **Kanabō** | 棒 | $0.52\text{s}$ (2-hit) | $94\text{px}$ | Crushing impacts that smash directly through frontal turtle shields and heavy armor. |

---

## 📜 Roguelike Progression & Upgrades

### The Shrine (詣) — Permanent Meta-Progression
Spend earned **Ash (灰)** between runs to permanently fortify your soul:
- **Vitality (命):** $+12$ Max HP per rank.
- **Strength (力):** $+6\%$ attack damage per rank.
- **Swiftness (風):** $+4\%$ movement speed per rank.
- **Fortune (運):** $+10\%$ Ash drop rate from fallen enemies.
- **Discipline (規):** Begin every journey with free Inkmark Blessings pre-inscribed.
- **Rejuvenation (癒):** Boosts the percentage of HP restored when purifying a stage.
- **Talisman (符):** Once per run, cheating death returns you to life with half health.

### Inkmark Scrolls (墨印) — Chamber Blessings
Choose one of three randomized inkmark scrolls after purifying each encounter:
- **Common (並):** *Vermilion Edge* (+dmg), *Fleet Shadow* (+spd), *Iron Skin* (armor), *Deep Cuts* (crit), *Long Reach* (range).
- **Rare (希):** *Blood Ink* (lifesteal), *Withering Rot* (stacking DoT), *Ink Burst* (corpse explosion), *Third Eye* (parry healing & window), *Night's Mantle* (post-dash burst).
- **Masterwork (極):** *Twin Fang* (finisher sends cutting wave), *Gods' Brush* (chance to fling secondary blade arcs), *Piercing Fang* (attacks ignore frontal shields).

---

## 👺 Bestiary & Boss Campaign

### Enemy Archetypes
- **Kappa Imp (河童):** Agile pack hunters that swarm in groups.
- **Oni Brute (鬼):** Heavy juggernauts with massive ground-slam shockwaves.
- **Tengu Scribe (天狗):** Ranged tacticians throwing slicing fans; their projectiles can be sliced in midair or parried back.
- **Borei Wraith (亡霊):** Ethereal phantoms executing high-speed line charges.
- **Inugami Hound (犬神):** Volatile beasts that rush forward and self-detonate.
- **Kame Guard (亀):** Impenetrable from the front unless flanked or broken with the Kanabō.
- **Chōchin Broker (提灯):** Support spirits that tether and heal their wounded allies.
- **Gōma Sorcerer (降魔):** Arcane summoners that teleport away when cornered.
- **Ashen Elites (精鋭):** Blood-ringed variants with boosted agility, health, and triple Ash yield.

### The Seven Acts & Boss Roster
1. **Act I — The Rice Fields at Dusk:** *Goroki, Warlord of Rot (鬼)*
2. **Act II — The Flooded Bridge:** *Orochi of the Flooded Veil (蛇)*
3. **Act III — The Bamboo Court:** *Sōjōbō, Master of Fans (天)*
4. **Act IV — The White Gale:** *Yukiko, Widow of the White Gale (雪)*
5. **Act V — The Storm Drum:** *Raiden, Drum of a Hundred Storms (雷)*
6. **Act VI — The Ash Garden:** *The Hollow Daimyō (灰)*
7. **Act VII — The Blank Eternity:** *The Nameless Kami (空)*
8. **Endless Abyss Mode (無):** Unlocked after conquering Act III; fight through infinite escalating waves with scaling rewards.

---

## 🛠 Technical Architecture

```
┌────────────────────────────────────────────────────────┐
│                     SUMIKIRI ENGINE                    │
├──────────────────────────┬─────────────────────────────┤
│   Canvas 2D Renderer     │   Web Audio Synthesizer     │
│   • Multi-layer Buffers  │   • Karplus-Strong Plucks   │
│   • Procedural Splatters │   • Subtractive Bass Drums  │
│   • Ink Wash Shaders     │   • Reactive Combat Melodies│
├──────────────────────────┼─────────────────────────────┤
│   Deterministic Combat   │   State & Persistence       │
│   • Sub-frame Hitstop    │   • Robust LocalStorage     │
│   • Buffer Input Queue   │   • Zero External Network   │
│   • Circular/Arc Raycast │   • Single Portable HTML    │
└──────────────────────────┴─────────────────────────────┘
```

- **Zero External Assets:** 100% of visual assets, textures, and sound effects are synthesized at runtime. There are no missing images, broken CDN links, or asset loading stalls.
- **Deterministic 60 FPS Fixed-Step Physics:** Decoupled simulation update loop prevents physics tunneling or clipping even during frame rate fluctuations.
- **Lightweight & Portable:** Weighs under 100 KB uncompressed.

---

## 🚀 Quick Start & Installation

Because *SUMIKIRI* is built as an all-in-one single-file application, you can run it immediately without any build tools (`npm`, `webpack`, `vite`, etc.).

### Option 1: Direct Play
Simply open `index.html` in any modern web browser (Chrome, Firefox, Safari, Edge, Brave).

### Option 2: Local HTTP Server
If you prefer running through a local web server:

```bash
# Clone the repository
git clone https://github.com/your-username/sumikiri.git
cd sumikiri

# Launch with Python 3
python3 -m http.server 8000

# Or launch with Node.js npx
npx serve .
```
Then navigate to `http://localhost:8000` in your browser.

### Option 3: Deploy to GitHub Pages in 30 Seconds
1. Push `index.html` to your GitHub repository.
2. Go to **Settings** $\rightarrow$ **Pages**.
3. Under **Build and deployment**, select `Deploy from a branch` and choose `main` / `root`.
4. Click **Save**. Your game is now live worldwide!

---

## ⚙ Settings & Accessibility

Accessible from the main menu or in-game pause screen (<kbd>Esc</kbd>):
- **Sound Volume Slider:** Continuous master gain control.
- **Screen Shake Toggle:** Turn off camera trauma effects if prone to motion sensitivity.
- **Damage Numbers Toggle:** Toggle combat floating text for a cleaner, minimalist aesthetic.
- **Difficulty Selection:**
  - **Calm (静):** Reduced enemy damage and aggression for narrative exploration.
  - **Storm (嵐):** Standard tuned difficulty.
  - **Tempest (獄):** Accelerated enemy windups, increased damage, and relentless spawns.
- **Burn the Scroll (Wipe Data):** Dual-confirmation save data reset.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for full details. You are free to fork, modify, study, and distribute this software.

---

<p align="center">
  <i>The page is blank again. It was never empty.</i><br/>
  <b>斬</b>
</p>