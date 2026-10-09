# 墨斬 — SUMIKIRI
### *A Fast-Paced Hack & Slash Roguelike, Painted in Living Ink*

<p align="center">
  <img width="100%" alt="SUMIKIRI Banner" src="https://github.com/user-attachments/assets/30d267d4-a6c0-473e-b1f6-5ca9aa6b2839" />
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-b3372a.svg?style=for-the-badge" alt="License: MIT"></a>
  <a href="#-technical-stack--engine"><img src="https://img.shields.io/badge/Tech-HTML5_Canvas_2D-8f6d1f.svg?style=for-the-badge" alt="HTML5 Canvas 2D"></a>
  <a href="#-procedural-audio--ambient-soundscapes"><img src="https://img.shields.io/badge/Audio-Web_Audio_API-2c3550.svg?style=for-the-badge" alt="Procedural Web Audio"></a>
  <a href="#-dual-input-controls"><img src="https://img.shields.io/badge/Controls-Keyboard_+_Touch_Mobile-b3372a.svg?style=for-the-badge" alt="Mobile & Touch Ready"></a>
  <a href="https://thvariableyt.github.io/SUMIKIRI-/"><img src="https://img.shields.io/badge/Playable-Instant_In_Browser-1d1a16.svg?style=for-the-badge" alt="Play in Browser"></a>
</p>

<p align="center">
  <i>"Rice fields drink the sun.<br/>
  A blade wakes in black ink.<br/>
  The crows have noticed."</i>
</p>

---

## ✦ Table of Contents

- [✦ Overview](#-overview)
- [⚔ Core Combat System](#-core-combat-system)
  - [1. Posture & The Deathblow (体幹 & 死)](#1-posture--the-deathblow-体幹--死)
  - [2. Perilous Strikes (危) & Mikiri Counter (見切)](#2-perilous-strikes-危--mikiri-counter-見切)
  - [3. Style Rank Meter](#3-style-rank-meter)
- [🗡 The Armory](#-the-armory)
- [📜 Roguelite Meta-Progression & Blessings](#-roguelite-meta-progression--blessings)
  - [The Shrine (詣)](#the-shrine-詣--permanent-soul-upgrades)
  - [Inkmark Scrolls (墨印)](#inkmark-scrolls-墨印--chamber-blessings)
- [👺 Chronicle, Bestiary & Boss Acts](#-chronicle-bestiary--boss-acts)
  - [The 7 Acts & Roster](#the-seven-story-acts)
  - [Endless Abyss Mode (無)](#endless-abyss-mode-無)
- [🎨 Dynamic Visual & Calligraphy Engine](#-dynamic-visual--calligraphy-engine)
- [🎵 Procedural Audio & Ambient Soundscapes](#-procedural-audio--ambient-soundscapes)
- [🎮 Dual-Input Controls](#-dual-input-controls)
- [⚙ Settings & Accessibility](#-settings--accessibility)
- [🛠 Technical Stack & Engine](#-technical-stack--engine)
- [🚀 Quick Start & Deployment](#-quick-start--deployment)
- [📄 License & Credits](#-license--credits)

---

## ✦ Overview

**SUMIKIRI (墨斬)** is a precision-driven, high-tempo top-down action roguelike rendered in the aesthetic tradition of classical Japanese *sumi-e* (墨絵) ink wash paintings. Every slash, deflection, shadow dash, and demise is painted in real time as visceral strokes of black soot ink and vermilion cinnabar upon fibrous, textured washi paper.

Designed with **zero third-party game engines or pre-rendered sprite sheets**, SUMIKIRI runs fluidly across desktop browsers and mobile devices.

### Key Highlights
- **Sekiro-Inspired Guard & Posture Combat:** Rhythmic deflections and heavy impacts shatter enemy posture, exposing them to cinematic, one-strike **Deathblows (死)**.
- **Telegraphed Perilous Attacks (危):** Deadly sweeps and heavy thrusts cannot be blocked—read the calligraphy tell, dodge at the last split-second to execute a **Mikiri Counter (見切)**, and unleash counter-damage.
- **Narrative Story Mode & Lore Chapters:** Hand-crafted story acts featuring dynamic dialogue interludes, haiku revelations, and mythic folklore dialogues.
- **Atmospheric Procedural Audio:** Synthesized shamisen plucks, resonate taiko drum beats, singing deflection overtones, and generative ambient nature soundscapes synthesized entirely via Web Audio math oscillators.
- **Universal Input Architecture:** Desktop keyboard and mouse bindings alongside responsive mobile touch controls (dynamic virtual joystick, swipe-friendly action buttons, and intelligent aim assist).
- **Infinite Abyss Survival:** Test your blade against endless scaling waves of yokai with multi-phase boss trials.

---

## ⚔ Core Combat System

Combat rewards aggressive initiative, disciplined defense, and rhythmic reading of attacks. **Passive collision damage does not exist**—damage is dealt exclusively through telegraphed strikes that can be deflected, dodged, or punished.

```
                  [ Telegraphed Enemy Strike ]
                               │
                      Is it Perilous (危)?
                     ┌─────────┴─────────┐
                   YES                   NO
                    │                     │
             ┌──────┴──────┐       ┌──────┴──────┐
             │ Dash Evade  │       │ Deflect (弾) │
             └──────┬──────┘       └──────┬──────┘
                    │                     │
              Last Instant?         Fills Posture
                    │                     │
             ┌──────┴──────┐       ┌──────┴──────┐
             │  見切 MIKIRI │       │    BREAK    │
             │ +Ki / +Dmg  │       │  DEATHBLOW  │
             └─────────────┘       └─────────────┘
```

### 1. Posture & The Deathblow (体幹 & 死)
- Beneath every enemy's health pool sits an **amber Posture Bar**.
- **Deflecting attacks** and landing heavy counter-strikes charges their posture gauge.
- When full, the enemy's stance breaks: they are enveloped in a golden halo, marked by a pulsing red **死 (Death)** kanji.
- **Lethal Execution:** Striking a broken standard enemy executes an instant **Deathblow**, immediately slaying them regardless of remaining health. On boss encounters, a Deathblow carves off an instant $15\%$ max HP chunk along with double combo scaling.
- **Posture Decay:** Breaking off combat allows enemy posture to regenerate rapidly—relentless pressure is required to force an opening.

### 2. Perilous Strikes (危) & Mikiri Counter (見切)
- **Standard Red Tells (朱):** Slashing strikes, rapid combos, and incoming arrows. These can be deflected with precise timing or dodged through.
- **Perilous Attacks (危):** Heavy thrusts, lunging charges, and sweeping unblockables marked by an ominous hovering **危** glyph. **These bypass guard and deal $+40\%$ bonus damage**.
- **Mikiri Counter (見切):** Dashing through a Perilous attack at the impact frame triggers a Mikiri Counter, awarding $+12$ Ki, grant a temporary $+25\%$ damage surge, and spawning golden kanji splatter stamps.
- **Golden Boss Weapon Arts (金):** Signature boss sequences. Deflecting them sends posture shockwaves straight back into the boss.

### 3. Style Rank Meter
Chaining consecutive hits without receiving damage ranks up your combat style:

$$\text{初 (Student)} \;\longrightarrow\; \text{中 (Adept)} \;\longrightarrow\; \text{上 (Expert)} \;\longrightarrow\; \text{極 (Master)} \;\longrightarrow\; \text{鬼 (Oni)} \;\longrightarrow\; \text{神 (Kami)}$$

Achieving higher style tiers multiplies the **Ash (灰)** yielded by vanquished enemies, accelerating meta-progression.

---

## 🗡 The Armory

Equip and swap between 4 distinct weapons mid-combat with zero animation lock to exploit enemy weaknesses:

| Weapon | Kanji | Attack Speed | Reach | Playstyle & Properties |
| :--- | :---: | :---: | :---: | :--- |
| **Katana** | 刀 | $0.24\text{s}$ (3-hit combo) | $84\text{px}$ | Balanced reach, rapid recovery, and dependable parry timing. |
| **Naginata** | 薙 | $0.34\text{s}$ (3-hit combo) | $122\text{px}$ | Sweeping crowd cleave; 3rd combo step performs a full $360^\circ$ circle sweep. |
| **Twin Blades** | 双 | $0.17\text{s}$ (4-hit combo) | $68\text{px}$ | Relentless flurry; innate $+8\%$ critical strike chance. |
| **Kanabō** | 棒 | $0.52\text{s}$ (2-hit combo) | $94\text{px}$ | Massive crushing poise; shatters turtle shields and inflicts $+150\%$ posture damage. |

---

## 📜 Roguelite Meta-Progression & Blessings

### The Shrine (詣) — Permanent Soul Upgrades
Spend collected **Ash (灰)** at the Torii Shrine between runs to permanently enhance your warrior:

- **Vitality (命):** $+12$ Max Health per rank.
- **Strength (力):** $+6\%$ base attack damage per rank.
- **Swiftness (風):** $+4\%$ sprint and movement speed per rank.
- **Fortune (運):** $+10\%$ bonus Ash yield per rank.
- **Discipline (規):** Begin each descent with pre-inscribed ink scrolls.
- **Rejuvenation (癒):** Increases HP recovered upon cleansing each chamber.
- **Talisman (符):** Once per run, resist fatal damage and resurrect with $50\%$ health.

### Inkmark Scrolls (墨印) — Chamber Blessings
Purifying chambers grants a choice among three randomized scrolls:

```
┌────────────────────────────────────────────────────────────────────────┐
│                          INKMARK TIERS (墨印)                          │
├────────────────────┬────────────────────┬──────────────────────────────┤
│    Common (並)     │     Rare (希)      │       Masterwork (極)        │
│ • Vermilion Edge   │ • Blood Ink        │ • Twin Fang                  │
│ • Fleet Shadow     │ • Withering Rot    │ • Gods' Brush                │
│ • Iron Skin        │ • Ink Burst        │ • Piercing Fang              │
│ • Deep Cuts        │ • Third Eye        │ • Void Pulse                 │
│ • Thousand Cuts    │ • Storm Steps      │ • Master's Flourish          │
│ • Focused Ki       │ • Executioner      │ • Thousand Thousand Slashes  │
└────────────────────┴────────────────────┴──────────────────────────────┘
```

- **Blood Ink:** Siphons health upon landing critical hits and Deathblows.
- **Withering Rot:** Applies stacking black-ink damage over time.
- **Ink Burst:** Defeated foes detonate in a burst of ink, damaging nearby enemies.
- **Third Eye:** Widens deflection timing window and restores health on parry.
- **Twin Fang & Gods' Brush:** Blade sweeps fling piercing calligraphy crescents across the battlefield.

---

## 👺 Chronicle, Bestiary & Boss Acts

### The Seven Story Acts
Each Act takes place in a distinct biome accompanied by thematic visual filters, weather effects, and unique lore:

1. **Act I — The Rice Fields at Dusk:** *Goroki, Warlord of Rot (鬼)*
   - Wandering brutes in golden paddy fields soaked in evening cinnabar.
2. **Act II — The Flooded Bridge:** *Orochi of the Flooded Veil (蛇)*
   - Waterlogged planks shrouded in river mist and serpentine water spirits.
3. **Act III — The Bamboo Court:** *Sōjōbō, Master of Fans (天)*
   - Slicing windstorms and airborne Tengu scribes hurling razor feather fans.
4. **Act IV — The White Gale:** *Yukiko, Widow of the White Gale (雪)*
   - Freezing blizzard winds, reduced visibility, and frozen wraiths.
5. **Act V — The Storm Drum:** *Raiden, Drum of a Hundred Storms (雷)*
   - Flashes of ink-lightning, thunder taiko rhythms, and electrified samurai.
6. **Act VI — The Ash Garden:** *The Hollow Daimyō (灰)*
   - Burnt ruins covered in floating black ash flakes and corrupted temple guardians.
7. **Act VII — The Blank Eternity:** *The Nameless Kami (空)*
   - The boundary where washi paper dissolves into pure void calligraphy.

### Endless Abyss Mode (無)
Unlocked after conquering Act III in the campaign. Face escalating random waves with randomized elite affixes and boss gauntlets every 6 stages. High-score tracking commemorates your deepest descent into the ink.

---

## 🎨 Dynamic Visual & Calligraphy Engine

SUMIKIRI renders its world through an in-house Canvas 2D brushwork pipeline:
- **Procedural Washi Texture:** Synthetic paper fibers and uneven absorption values simulate physical handmade paper.
- **Dynamic Brush Physics:** Slash arcs adjust line thickness based on blade velocity and angular momentum.
- **Atmospheric Mist & Grain:** Multi-layered procedural parallax mist with animated film grain overlays.
- **Calligraphic Particle Physics:** Radial ink-splatter stamps, cinnabar bleeding, and persistent battlefield stains.
- **Menu Visual FX (`menufx.js` / `menufx.css`):** Fluid ink-bleed UI transitions, floating washi embers, and reactive brush-stroke cursor trails.

---

## 🎵 Procedural Audio & Ambient Soundscapes

SUMIKIRI features an audio engine powered entirely by the **Web Audio API**:
- **Karplus-Strong Plucked Strings:** Mathematically simulates acoustic shamisen and koto string resonances in real time.
- **Subtractive Taiko Synthesizer:** Low-frequency membrane oscillators create visceral taiko impacts.
- **Metallic Deflection Harmonics:** High-Q bandpass filters simulate steel-on-steel clashing during deflections.
- **Ambient Soundscapes (`ambient2.js`):** Procedurally synthesized wind howls, flowing stream water, cricket chirps, and rainfall that dynamically shift intensity according to combat state.

---

## 🎮 Dual-Input Controls

### Desktop (Keyboard & Mouse)
- <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> or <kbd>Arrow Keys</kbd> — Move
- <kbd>Mouse Cursor</kbd> — Aim Blade
- <kbd>Left Click</kbd> — Slash (斬) / Combo Attack
- <kbd>Right Click</kbd> — Deflect (弾) / Guard
- <kbd>Spacebar</kbd> — Shadow Dash (走) (Invulnerability frames)
- <kbd>E</kbd> — Ki Art / Ultimate (絶) (When Ki reaches 100%)
- <kbd>1</kbd> – <kbd>4</kbd> — Swap Active Weapon
- <kbd>Esc</kbd> — Pause & Options Menu
- <kbd>M</kbd> — Quick Mute

### Mobile & Touch Devices
- **Left Virtual Joystick:** Free directional movement.
- **Smart Aim-Assist:** Automatically locks blade direction to the highest-threat enemy.
- **Action Buttons:** Dedicated on-screen calligraphy buttons for **斬** (Slash), **弾** (Deflect), **走** (Dash), and **絶** (Ki Art).
- **Weapon Tray:** Tap weapon icons in the HUD to instantly switch weapons.
- **Orientation Lock:** Automatically requests fullscreen and landscape orientation.

---

## ⚙ Settings & Accessibility

Available from the main menu or pause screen (<kbd>Esc</kbd>):
- **Master Sound & Ambient Sliders:** Independent gain control for SFX, music, and ambient noise.
- **Screen Shake Toggle:** Disable camera trauma and screen shake for motion sensitivity.
- **Floating Combat Text Toggle:** Toggle damage numbers on/off for a pure minimalist calligraphy experience.
- **Performance / Grain Toggle:** Disable film grain overlay on low-power devices.
- **Three Tuned Difficulty Modes:**
  - **Calm (静):** Slower windups, generous deflect windows, reduced enemy damage.
  - **Storm (嵐):** Standard tuned experience.
  - **Tempest (獄):** Accelerated enemy windups, relentless combo chains, punishing poise damage.
- **Burn the Scroll:** Data-wipe option with safety confirmation to reset progress.

---

## 🛠 Technical Stack & Engine

```
┌────────────────────────────────────────────────────────────────────────┐
│                          SUMIKIRI ARCHITECTURE                         │
├───────────────────────────────┬────────────────────────────────────────┤
│   Canvas 2D Renderer          │   Web Audio Synthesizer                │
│   • Procedural Washi Shader   │   • Karplus-Strong Strings             │
│   • Dynamic Ink Splatter FX   │   • Subtractive Bass Taiko Drums       │
│   • Animated Film Grain       │   • Procedural Ambient Engine          │
│   • Brushstroke Physics Engine│   • Reactive Intensity Audio Loop      │
├───────────────────────────────┼────────────────────────────────────────┤
│   Combat & Physics Loop       │   Input & Platform Support             │
│   • Fixed 60 FPS Delta Step   │   • Keyboard & Mouse Driver            │
│   • Sekiro Posture & Guard    │   • Multi-Touch Virtual Joystick       │
│   • Mikiri Counter Detection  │   • Nearest-Target Aim Assist          │
│   • Weapon Poise Calculations │   • Mobile Landscape Lock              │
└───────────────────────────────┴────────────────────────────────────────┘
```

- **Zero External Dependencies:** Built with pure vanilla HTML5, Canvas 2D, and JavaScript.
- **Instant Load Time:** Total bundle size is under 150 KB uncompressed.
- **Deterministic 60 FPS Engine:** Fixed physics timestep prevents collision tunneling.

---

## 🚀 Quick Start & Deployment

### Option 1: Direct Play in Browser
Open `public/game/index.html` directly in any modern web browser (Google Chrome, Safari, Mozilla Firefox, Microsoft Edge, Brave).

### Option 2: Live Server
Play instantly without any download:  
👉 **[Play SUMIKIRI Online](https://thvariableyt.github.io/SUMIKIRI-/)**

### Option 3: Local Development Server
```bash
# Clone the repository
git clone https://github.com/your-username/sumikiri.git
cd sumikiri

# Launch with Node.js
npx serve .

# Or launch with Python 3
python3 -m http.server 8000
```
Open `http://localhost:8000` in your web browser.

---

## 📄 License & Credits

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for complete details.

<p align="center">
  <i>The page is blank again. It was never empty.</i><br/>
  <b>斬</b>
</p>