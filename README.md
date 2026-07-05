# 🌀 Proteus Cursor
**Proteus Cursor** is a dynamic JavaScript library that revolutionizes web user interaction by transforming the mouse cursor based on HTML element interactions.

Inspired by the shape-shifting god **Proteus**, this library allows the cursor to morph into various forms — dot, circle, fluid, or text — depending on the element it's hovering over.

---

## 1) 🚀 Installation

Install via **npm**:

```bash
npm i proteuscursor
```

## 2) 📦 Import Files
There are two different import styles.

- ### 🧪 Without bundler
    Ideal for simple projects
    ```html
    <!-- Add minified CSS -->
    <link rel="stylesheet" href="dist/proteus-cursor.min.css" />

    <!-- Add UMD script -->
    <script src="dist/proteus-cursor.umd.js"></script>

    <script>
        // Global initialization
        const cursor = new ProteusCursor({
            // proteus options
        });
    </script>
    ```

- ### 🧪 With bundler
    Ideal for modular projects with Vite, Webpack, Nuxt, etc.
    #### 📁 1. Install with npm
    ```bash
    npm install proteuscursor
    ```

    #### ✍️ 2. Import in your JS modules
    ```js
    import ProteusCursor from 'proteuscursor';
    import 'proteuscursor/style'; // import minified CSS
    
    const cursor = new ProteusCursor({
      // proteus options
    });
    ```

---

## 3) ⚛️ Framework Adapters

Proteus Cursor ships first-class adapters for React, Vue 3 and Svelte. Each adapter handles lifecycle (mount / unmount) automatically and is SSR-safe.

### React

```bash
npm install proteuscursor
```

```jsx
import { useProteusCursor } from 'proteuscursor/react';
import 'proteuscursor/style'; // import minified CSS

export default function App() {
  const cursor = useProteusCursor({
    shape: 'circle',
    shape_color: '#ffffff',
    click_animation: 'ripple',
  });

  // cursor.current → ProteusCursor instance (null until mounted)
  // e.g. cursor.current?.addState('hero', { shape_size: '80px' })

  return <main>...</main>;
}
```

### Vue 3

```bash
npm install proteuscursor
```

```vue
<script setup>
import { useProteusCursor } from 'proteuscursor/vue';
import 'proteuscursor/style';

const cursor = useProteusCursor({
  shape: 'circle',
  shape_color: '#ffffff',
  click_animation: 'ripple',
});

// cursor.value → ProteusCursor instance (null until mounted)
</script>

<template>
  <main>...</main>
</template>
```

### Svelte

```bash
npm install proteuscursor
```

```svelte
<script>
  import { useProteusCursor } from 'proteuscursor/svelte';
  import 'proteuscursor/style';

  const cursor = useProteusCursor({
    shape: 'circle',
    shape_color: '#ffffff',
    click_animation: 'ripple',
  });

  // cursor.current → ProteusCursor instance (undefined until mounted)
</script>

<main>...</main>
```

> All three adapters expose the full ProteusCursor API via the returned reference. SSR environments (Next.js, Nuxt, SvelteKit) are handled automatically — the constructor runs only on the client.

---

## 4) 🎨 Preset System

Five built-in presets let you get a polished cursor in one line — no manual configuration required.

| Preset | Description |
|---|---|
| `'ghost'` | Translucent circle — blends into any design |
| `'neon'` | Teal dot with glowing halo — for dark creative sites |
| `'minimal'` | Tiny dot, no shadow, no animation — zero visual noise |
| `'chrome'` | Large circle with `mix-blend-mode: difference` — auto color inversion |
| `'ink'` | Fluid morphing blob — stretches and squeezes with movement |

### Apply to a live instance

```js
const cursor = new ProteusCursor({ shape: 'circle' });

cursor.loadPreset('neon');                         // apply preset
cursor.loadPreset('chrome', { shape_size: '64px' }); // preset + overrides
```

> `loadPreset()` is chainable and returns `this`.

### Use a preset as a constructor base

```js
const cursor = new ProteusCursor({
  ...ProteusCursor.getPreset('neon'),  // spread the raw config
  shape_color: '#ff4444',              // override what you want
});
```

### Access all presets

```js
// All presets as a static property
console.log(ProteusCursor.PRESETS); // { ghost: {...}, neon: {...}, ... }

// Initialize directly from a preset object
const cursor = new ProteusCursor(ProteusCursor.getPreset('ghost'));
```

---

## 5) ⚙️ Constructor Options
There are a lot of options ✨ for Proteus.
First of all you can set a cursor mode:
- `circle`
- `fluid`

##### 🔵 Circle Cursor
```js
const cursor = new ProteusCursor({
    shape: 'circle',
    shape_size: '10px',
    shape_color: '#ffffff',
    hasShadow: true,
    shadow_delay: '0.3s',
    shadow_size: '40px',
    shadow_color: 'rgba(255, 255, 255, 0.5)',
    magnetic: false,             // see "Magnetic Behavior" below
    text: '',
});
```

##### 🌊 Fluid Cursor
```js
const cursor = new ProteusCursor({
    shape: 'fluid',
    shape_size: '10px',
    shape_color: '#ffffff',
    hasShadow: true,
    shadow_delay: '0.3s',
    shadow_size: '40px',
    shadow_color: 'rgba(255, 255, 255, 0.5)',
    magnetic: false,
    text: '',
});
```


---

## 6) 🖱️ Click Animations

Proteus plays a small animation on every `mousedown` to give tactile feedback. Choose between two built-in effects or disable them entirely.

```js
new ProteusCursor({
  shape: 'circle',
  click_animation: 'scale',  // 'scale' | 'ripple' | 'none'  — default: 'scale'
  click_duration: 300,       // ms — default: 300
});
```

| Value | Effect |
|---|---|
| `'scale'` | Cursor shrinks and springs back on click |
| `'ripple'` | A circle expands and fades from the click point |
| `'none'` | No animation |

---

## 7) 🧲 Magnetic Behavior

While hovering an interactive element, the cursor is *pulled* toward the element's centre — and eases back onto the real mouse position when it leaves. Works in `circle` mode (fluid support is planned).

```js
new ProteusCursor({
  shape: 'circle',
  magnetic: true,                // master switch — default: false
  magnetic_strength: 0.4,        // 0–1, how snappy the pull is — default: 0.4
  magnetic_radius: null,         // px falloff radius — default: null (full pull)
  magnetic_targets: 'a, button, [data-cursor-magnetic]', // CSS selector — default shown
});
```

| Option | Type | Description |
|---|---|---|
| `magnetic` | `boolean` | Enables the effect |
| `magnetic_strength` | `number` | Fraction (0–1) of the remaining cursor→centre distance recovered each frame. Higher = snappier |
| `magnetic_radius` | `number \| null` | Attraction falloff in px from the element centre: full pull at the centre, none at this distance. `null` = constant full pull while hovering |
| `magnetic_targets` | `string` | CSS selector for the elements that attract the cursor |

Any element can opt in via the data attribute included in the default selector:

```html
<div data-cursor-magnetic>Hover me</div>
```

Toggle it at runtime (both methods are chainable):

```js
cursor.setMagnetic(true);              // enable/disable
cursor.setMagneticStrength(0.6, true); // isPermanent — persists after state resets
```

### Magnetic parallax

With parallax, it's not just the cursor that moves: the hovered element itself *leans* toward the cursor (a few px, clamped) and springs back to its exact original position on leave. It's a **separate opt-in** — enabling `magnetic` never moves your elements; either option works with or without the other.

```js
new ProteusCursor({
  shape: 'circle',
  magnetic: true,                    // cursor pulled toward the element (optional)
  magnetic_parallax: true,           // element pulled toward the cursor — default: false
  magnetic_parallax_strength: 0.15,  // 0–1, how far it leans — default: 0.15
});

cursor.setMagneticParallax(true);    // toggle at runtime (chainable)
```

The shift is applied *on top of* any CSS `transform` the element already has, and its `transition` is suspended only while the hover is active — both are restored untouched on leave.

---

## 8) 🔁 State Machine API

Define named cursor states once in JS and attach them to HTML elements with a single data attribute. The cursor switches automatically on hover and restores defaults on leave.

### Define states

```js
const cursor = new ProteusCursor({ shape: 'circle' });

cursor
  .addState('cta', {
    shape_size: '60px',
    shape_color: '#ff4444',
    text: 'Click',
    text_size: '13px',
  })
  .addState('video', {
    shape_size: '80px',
    shape_color: 'rgba(255,255,255,0.15)',
    text: '▶ Play',
    hasShadow: false,
  })
  .addState('gallery', {
    shape_size: '100px',
    shape_color: 'rgba(255,255,255,0.1)',
    text: 'Zoom',
  });
```

> `addState()` and `removeState()` are chainable.

### Attach to elements

```html
<button data-cursor-state="cta">Buy now</button>
<div data-cursor-state="video">▶ Watch trailer</div>
<img data-cursor-state="gallery" src="photo.jpg" />
```

### Available state properties

| Property | Type | Description |
|---|---|---|
| `shape_size` | `string` | CSS size (e.g. `'60px'`) |
| `shape_color` | `string` | CSS color |
| `hasShadow` | `boolean` | Show/hide shadow |
| `shadow_size` | `string` | Shadow element size |
| `text` | `string` | Text inside cursor |
| `text_color` | `string` | Text color |
| `text_size` | `string` | CSS font size |
| `text_weight` | `string` | CSS font weight |

### Remove a state

```js
cursor.removeState('video');
```

### Debug overlay

Integrating many states? Turn on the read-only debug panel to see what the state machine is doing in real time — the active state, the default preset snapshot, the last 10 hover/leave transitions (timestamped) and the current behaviour flags:

```js
cursor.enableDebugOverlay();                          // default: top-left corner
cursor.enableDebugOverlay({ position: 'bottom-right' }); // or pick a corner
cursor.disableDebugOverlay();
```

The panel is purely passive: `pointer-events: none`, so it can never become a hover target itself, and it only re-renders on state transitions (no per-frame work). Both methods are chainable.

---

## 9) 🎨 Blend Mode

Apply a CSS `mix-blend-mode` to the cursor shape so it blends with the page content beneath it. The most popular effect is `'difference'`, which automatically inverts the colors underneath the cursor — creating perfect contrast on any background.

```js
new ProteusCursor({
  shape: 'circle',
  shape_size: '40px',
  shape_color: '#ffffff',   // white + difference = automatic inversion
  hasShadow: false,
  blend_mode: 'difference', // 'normal' | 'difference' | 'exclusion' | any CSS value
});
```

| Value | Effect |
|---|---|
| `'normal'` | Default — no blending |
| `'difference'` | Inverts the colors beneath the cursor. Best with `shape_color: '#ffffff'` |
| `'exclusion'` | Softer inversion, lower contrast than `difference` |
| any CSS value | Full `mix-blend-mode` spec is supported |

> **Tip:** `difference` with a white cursor gives automatic light/dark contrast on any background — white on dark, black on light.

Switch blend mode at runtime or per state:

```js
// Runtime switch
cursor.setBlendMode('exclusion');
cursor.setBlendMode('normal', true); // isPermanent — persists after state resets

// Per state
cursor.addState('hero', {
  shape_size: '60px',
  shape_color: '#ffffff',
  blend_mode: 'difference',
});
```

---

## 10) ♿ Accessibility — Reduced Motion

Some users enable **"Reduce Motion"** in their OS accessibility settings (macOS → Accessibility → Display, Windows → Accessibility → Visual Effects). This signals that animations may cause discomfort (vestibular disorders, epilepsy, motion sensitivity).

By default Proteus Cursor **respects this preference** and skips initialization entirely when `prefers-reduced-motion: reduce` is detected — no DOM elements, no RAF loops, native cursor preserved.

```js
// Default — respects the OS preference automatically
const cursor = new ProteusCursor({ shape: 'circle' });

// Opt-out: always run regardless of OS setting
const cursor = new ProteusCursor({
  shape: 'circle',
  respectReducedMotion: false,
});
```

All API methods remain **safe to call** when reduced motion is active — they are no-ops:

```js
cursor.addState('cta', { shape_size: '60px' }); // silent no-op
```

### Static fallback (opt-in)

If you'd rather keep a branded cursor than fall back to the native one, opt into the **static fallback**: a custom circle that snaps to the mouse on every `mousemove` — no RAF loop, no smoothing, no shadow follow, no trail, no fluid deformation, no click animation, no magnetic effects. Nothing that needs a second tick, by construction.

```js
const cursor = new ProteusCursor({
  shape: 'circle',
  reducedMotionFallback: 'static', // default: 'native' — zero breaking change
});
```

What still works in static mode: `shape_color`, `shape_size`, text options, `blend_mode` — including through the **state machine** (`addState` hovers apply as instant restyles) and `data-proteus-*` attributes. A `shape: 'fluid'` config falls back to a static circle with a console warning.

Check which mode you ended up in with `cursor.isStaticFallback`. Cost note: one `mousemove` listener with two direct style writes — negligible, but not free compared to `'native'`.

Use the static helper for your own conditional logic:

```js
if (!ProteusCursor.prefersReducedMotion()) {
  // extra animation logic
}
```

---

## 11) 📱 Touch Device Support

Proteus Cursor automatically detects touch-only devices (phones, tablets without a paired mouse) and **skips initialization entirely** — no DOM elements are injected, no event listeners are registered, and the native cursor behaviour is preserved.

Detection is based on the CSS `pointer: coarse` media feature, which correctly handles hybrid devices:

| Device | Primary pointer | Proteus active? |
|---|---|---|
| Phone / tablet (no mouse) | coarse | ❌ skipped |
| Laptop with touchscreen | fine (mouse) | ✅ active |
| iPad / Surface + paired mouse | fine | ✅ active |

All API methods remain **safe to call** on touch devices — they are no-ops that return without error. This means you never need to guard your initialization code:

```js
// Safe on every device — no try/catch or feature checks needed
const cursor = new ProteusCursor({ shape: 'circle' });
cursor.addState('cta', { shape_size: '60px' }); // no-op on touch
```

If you need to branch your own logic based on the device type, use the static helper:

```js
if (!ProteusCursor.isTouchOnly()) {
  // desktop-only logic
}
```

---

## 12) 🏷️ Data Attributes (per-element overrides)

For quick one-off customizations without defining a full state, you can use data attributes directly on elements:

```html
<button
  data-proteus-shapeSize="80px"
  data-proteus-shapeColor="#ffffff"
  data-proteus-text="Hello"
  data-proteus-textColor="#000000"
  data-proteus-textSize="14px"
  data-proteus-textWeight="600"
  data-proteus-shadowIsEnabled="true"
>
  Hover me
</button>
```

---

## 🗺️ Roadmap
Looking for what's next? See [ROADMAP.md](ROADMAP.md) for planned features and the [public project board](https://github.com/users/Shuriken933/projects/11).

## 📜 License
This project is licensed under the MIT License.
Feel free to use, modify, and share! 💫
