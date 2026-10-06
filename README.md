# 墨斬 — SUMIKIRI
### *A Hack & Slash Action Roguelike, Painted in Ink*

[![License: MIT](https://img.shields.io/badge/License-MIT-b3372a.svg)](LICENSE)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-1d1a16.svg)](package.json)
[![Tech: HTML5 Canvas](https://img.shields.io/badge/Tech-HTML5_Canvas_2D-8f6d1f.svg)](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
[![Audio: Web Audio API](https://img.shields.io/badge/Audio-Procedural_Web_Audio-2c3550.svg)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
[![Mobile & Touch Ready](https://img.shields.io/badge/Controls-Desktop_%26_Touch_Mobile-b3372a.svg)](#dual-input-controls)
[![Playable in Browser](https://img.shields.io/badge/Playable-Browser_Instant-b3372a.svg)](#quick-start)

> *"Rice fields drink the sun.*  
> *A blade wakes in black ink.*  
> *The crows have noticed."*

---

## ✦ Overview

**SUMIKIRI (墨斬)** is a fast-paced, precision-focused top-down hack & slash roguelike running entirely within a standalone HTML file. Inspired by classical Japanese *sumi-e* (墨絵) ink wash calligraphy and high-tempo character action combat, every slash, deflection, dash, and death is rendered as physical strokes of black ink and vermilion cinnabar across textured washi paper.

Built with **zero external game engines, sprite sheets, or audio samples**, SUMIKIRI features:
- **Sekiro-Inspired Posture & Deathblow Combat:** Fill enemy posture with rapid deflections and crushing strikes to break their guard for a lethal, one-strike **Deathblow (死)**.
- **Telegraphed Perilous Attacks (危) & Perfect Dodges (見切):** Unblockable heavy lunges and sweeping boss charges require last-second dodges to trigger damage buffs and Ki surge.
- **Full Desktop & Mobile/Touch Architecture:** Play seamlessly on desktop with mouse and keyboard or on mobile devices with a virtual analog stick, smart aim-assist, tactile action buttons, and automatic landscape orientation lock.
- **Procedural Canvas Ink Engine:** Dynamic washi paper textures, multi-layer drifting atmospheric mist, animated film grain, fluid brush arcs, and directional ink splatter stamps.
- **Synthesized Web Audio Engine:** Karplus-Strong plucked strings (shamisen/koto), resonant taiko bass drums, and metallic deflection frequencies synthesized at runtime via mathematical oscillators.
- **Extensive Roguelite Depth:** 7 hand-crafted story Acts, 7 multi-phase bosses, an endless Abyss survival mode, 4 distinct weapons, 21 inkmark blessings, and permanent shrine meta-progression.

---

## ⚔ Combat Mechanics

Combat in *SUMIKIRI* revolves around proactive aggression, rhythmic deflections, and threat reading. **There is no passive contact damage**—you are only hurt by telegraphed strikes that can be avoided, countered, or punished.

```
       [ Enemy Strike Telegraphed ]
                   │
         Is it Perilous (危)?
        ┌──────────┴──────────┐
      YES                     NO
        │                      │
 ┌──────┴──────┐        ┌──────┴──────┐
 │ Dodge / Run │        │   Deflect   │
 └──────┬──────┘        └──────┬──────┘
        │                      │
 Last-Instant?          Fills Posture
        │                      │
 ┌──────┴──────┐        ┌──────┴──────┐
 │  見切 MIKIRI │        │     BREAK   │
 │ +Ki / +Dmg  │        │   DEATHBLOW │
 └─────────────┘        └─────────────┘
```

### 1. Posture & The Deathblow (体幹 & 死)
- Beneath every enemy's health bar lies an **amber Posture meter**.
- **Deflecting strikes** and landing heavy hits builds up posture. Kanabō strikes deal massive bonus posture damage.
- When an enemy's posture fills completely, they **break**: glowing with golden aura and bearing a pulsing red **死 (Death)** kanji.
- **Lethal Execution:** Striking a broken regular enemy executes a cinematic **Deathblow**, instantly killing them regardless of remaining health. On bosses, a Deathblow deals $15\%$ max health true damage plus double combo damage.
- **Posture Recovery:** If you back off and stop attacking, enemy posture rapidly recovers. Constant pressure is rewarded.

### 2. Reading the Ink & Perilous Strikes (危)
- **Standard Red Flashes (朱):** Melee slashes, multi-strike chains, and projectiles. Can be safely parried/deflected or dodged.
- **Perilous Attacks (危):** Heavy thrusts, explosive charges, and unblockable boss techniques marked by a floating vermilion **危** glyph. **These cannot be deflected** and deal $+40\%$ damage. You must dash through or evade them.
- **Perfect Dodge (見切 - Mikiri):** Dodging through an attack at the critical moment triggers a Perfect Dodge, granting $+12$ Ki, a $+25\%$ damage buff, and a burst of gold calligraphy.
- **Golden Boss Arcs (金):** Signature boss weapon arts. Deflecting these deals massive posture damage directly back to the boss.

### 3. Style Rank Progression
Landing consecutive strikes without taking damage builds your combat style through six distinct ranks:
$$\text{初 (Student)} \;\longrightarrow\; \text{中 (Adept)} \;\longrightarrow\; \text{上 (Expert)} \;\longrightarrow\; \text{極 (Master)} \;\longrightarrow\; \text{鬼 (Oni)} \;\longrightarrow\; \text{神 (Kami)}$$
Higher style ranks dramatically multiply the Ash (灰) collected from vanquished enemies.

---

## 🎮 Dual-Input Controls

Playable using either traditional keyboard & mouse or on touchscreens (smartphones & tablets) with dedicated touch interfaces.

| Action | Desktop (Mouse & Keyboard) | Mobile / Touch Screen |
| :--- | :--- | :--- |
| **Movement** | <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> or <kbd>Arrows</kbd> | Dynamic Left Thumb Virtual Joystick |
| **Aiming** | <kbd>Mouse Cursor</kbd> | Automatic Nearest-Target Aim Assist |
| **Slash (斬)** | <kbd>Left Click</kbd> | **斬** Button (tap or hold for continuous combo) |
| **Deflect (弾)** | <kbd>Right Click</kbd> | **弾** Button (deflects flashes, auto-faces target) |
| **Shadow Dash (走)** | <kbd>Space</kbd> | **走** Button (invulnerable $i$-frames, cancels windup) |
| **Ki Art (絶)** | <kbd>E</kbd> (when Ki is 100%) | **絶** Button (lights up with golden aura when ready) |
| **Weapon Swap** | <kbd>1</kbd> – <kbd>4</kbd> keys | Tap weapon icon tray at bottom-left |
| **Pause / Menu** | <kbd>Esc</kbd> | **停** Button at top-right |
| **Mute Audio** | <kbd>M</kbd> | Settings Menu |

---

## 🗡 Weapons of the Armory

Switch weapons dynamically during combat to counter enemy types:

| Weapon | Kanji | Attack Rhythm | Range | Combat Characteristics |
| :--- | :---: | :---: | :---: | :--- |
| **Katana** | 刀 | $0.24\text{s}$ (3 hits) | $84\text{px}$ | Balanced reach and recovery; dependable in every encounter. |
| **Naginata** | 薙 | $0.34\text{s}$ (3 hits) | $122\text{px}$ | Wide sweeping crowd-cleave; combo finisher spins $360^\circ$. |
| **Twin Blades** | 双 | $0.17\text{s}$ (4 hits) | $68\text{px}$ | High-frequency flurry; innate $+8\%$ critical strike chance. |
| **Kanabō** | 棒 | $0.52\text{s}$ (2 hits) | $94\text{px}$ | Heavy crushing blows that break Kame turtle shields and inflict massive posture damage. |

---

## 📜 Roguelike Progression & Upgrades

### The Shrine (詣) — Permanent Meta-Progression
Spend earned **Ash (灰)** between runs to permanently fortify your soul:
- **Vitality (命):** $+12$ Max HP per rank.
- **Strength (力):** $+6\%$ attack damage per rank.
- **Swiftness (風):** $+4\%$ movement speed per rank.
- **Fortune (運):** $+10\%$ Ash drops from fallen enemies.
- **Discipline (規):** Start every run with free pre-inscribed inkmark scrolls.
- **Rejuvenation (癒):** Increases HP percentage restored upon purifying each stage.
- **Talisman (符):** Once per run, cheating death revives you at $50\%$ health.

### Inkmark Scrolls (墨印) — Chamber Blessings
Choose one of three randomized inkmark scrolls after purifying each stage:
- **Common (並):** *Vermilion Edge* (+dmg), *Fleet Shadow* (+spd), *Iron Skin* (armor), *Deep Cuts* (crit), *Harvest* (double orb heals), *Focused Ki* (+Ki gain), *Long Reach* (+range), *Thousand Cuts* (+atk spd).
- **Rare (希):** *Blood Ink* (lifesteal), *Withering Rot* (stacking DoT), *Ink Burst* (corpse explosion), *Third Eye* (longer deflect window & parry heal), *Storm Steps* (+dash charge), *Vengeance* (post-wound counter dmg), *Night's Mantle* (post-dash burst), *War Drums* (kills refund dash cooldown), *Ink Well* (max HP + instant heal), *Executioner* (double dmg to foes under 25% HP).
- **Masterwork (極):** *Twin Fang* (finisher sends cutting wave), *Gods' Brush* (strikes fling bonus blade arcs), *Piercing Fang* (attacks bypass frontal shields).

---

## 👺 Bestiary & Boss Campaign

### Enemy Archetypes & Attack Chains
- **Kappa Imp (河童):** Swarm hunters that chain 2 rapid cuts and occasionally lunge forward with a perilous **危** strike.
- **Oni Brute (鬼):** Juggernauts with multi-hit ground slam chains. Perilous slams hit with extended shockwave radius.
- **Tengu Scribe (天狗):** Ranged tacticians hurling razor fans. Fans can be sliced out of the air or deflected back to sender.
- **Borei Wraith (亡霊):** High-speed line charges; nearly half of their dashes are unblockable **危** thrusts.
- **Inugami Hound (犬神):** Volatile explosive chargers. Dodge through their detonating rush at the final frame for a **見切** counter.
- **Kame Guard (亀):** Frontal turtle shields with 3-hit spear pokes. Deflect their pokes, flank them, or shatter their guard with the Kanabō.
- **Chōchin Broker (提灯):** Lantern spirits tethering and healing injured allies.
- **Gōma Sorcerer (降魔):** Summoners that teleport away when cornered and cast reinforcement marks.
- **Ashen Elites (精鋭):** Red-ringed variants with deep posture pools and tripled Ash yield.

### The Seven Acts & Boss Roster
1. **Act I — The Rice Fields at Dusk:** *Goroki, Warlord of Rot (鬼)*
2. **Act II — The Flooded Bridge:** *Orochi of the Flooded Veil (蛇)*
3. **Act III — The Bamboo Court:** *Sōjōbō, Master of Fans (天)*
4. **Act IV — The White Gale:** *Yukiko, Widow of the White Gale (雪)*
5. **Act V — The Storm Drum:** *Raiden, Drum of a Hundred Storms (雷)*
6. **Act VI — The Ash Garden:** *The Hollow Daimyō (灰)*
7. **Act VII — The Blank Eternity:** *The Nameless Kami (空)*
8. **Endless Abyss Mode (無):** Unlocked after conquering Act III; fight escalating enemy waves with boss trials every 6 waves.

---

## 🛠 Technical Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                       SUMIKIRI ENGINE                           │
├────────────────────────────┬────────────────────────────────────┤
│   Canvas 2D Renderer       │   Web Audio Synthesizer            │
│   • Procedural Washi Tile  │   • Karplus-Strong Plucks          │
│   • Dynamic Ink Mist Layers│   • Subtractive Bass Taiko Drums   │
│   • Procedural Film Grain  │   • Reactive Combat Intensity Music│
│   • Radial Ink-Wash Filters│   • Frequency-Shifting Deflect FX  │
├────────────────────────────┼────────────────────────────────────┤
│   Posture Combat Engine    │   Input & Platform Support         │
│   • Deflect & Posture Math │   • Dual Keyboard / Touch Engine   │
│   • Sekiro Deathblow Logic │   • Virtual Joystick & Aim Assist  │
│   • Perilous (危) Checking │   • Orientation Lock & Fullscreen  │
│   • Mikiri (見切) Buffs    │   • 100% Self-Contained HTML File  │
└────────────────────────────┴────────────────────────────────────┘
```

- **Zero External Assets:** 100% of visuals, calligraphy stamps, mist, and sound effects are synthesized at runtime. No CDNs, no remote assets, and no network requests.
- **Deterministic 60 FPS Simulation:** Fixed-step physics update loop prevents physics tunneling or projectile clipping.
- **Mobile First-Class Citizen:** Smooth handling of touch events, touch-action controls, device orientation alerts, and high-DPI scaling.
- **Tiny Footprint:** Complete game weighs under 100 KB uncompressed.

---

## 🚀 Quick Start & Installation

Because *SUMIKIRI* is built as a single portable HTML file, no build tools, compilers, or dependencies are required.

### Option 1: Direct Play
Double-click `index.html` to open it in any modern browser (Chrome, Safari, Firefox, Edge, Brave).

### Option 2: Local HTTP Server
```bash
# Clone the repository
git clone https://github.com/your-username/sumikiri.git
cd sumikiri

# Launch with Python 3
python3 -m http.server 8000

# Or launch with Node.js
npx serve .
```
Open `http://localhost:8000` in your desktop or mobile browser.

### Option 3: Deploy to GitHub Pages in 30 Seconds
1. Fork or push `index.html` to your GitHub repository.
2. In your repository, navigate to **Settings** $\rightarrow$ **Pages**.
3. Under **Branch**, select `main` (or `master`) and directory `/ (root)`.
4. Click **Save**. Your game is now live and playable on both desktop and mobile!

---

## ⚙ Settings & Accessibility

Available from the title menu or in-game pause screen (<kbd>Esc</kbd> / **停**):
- **Master Sound Slider:** Continuous volume gain control.
- **Screen Shake Toggle:** Turn off camera trauma if sensitive to motion.
- **Damage Numbers Toggle:** Toggle combat floating text for a clean, minimalist calligraphy aesthetic.
- **Fullscreen & Landscape Lock:** Fullscreen button with automatic orientation lock for mobile play.
- **Difficulty Settings:**
  - **Calm (静):** Slower windups, reduced enemy damage, and lenient recovery windows.
  - **Storm (嵐):** Standard tuned difficulty.
  - **Tempest (獄):** Accelerated enemy windups, relentless attack chains, and punishing damage.
- **Burn the Scroll (Wipe Data):** Dual-confirmation save data reset.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <i>The page is blank again. It was never empty.</i><br/>
  <b>斬</b>
</p>