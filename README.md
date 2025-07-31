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
Grab the following files from: node_modules/proteuscursor/dist
 - proteus-cursor.min.css
 - proteus-cursor.min.js

Place them in your preferred directory (e.g., inside your assets folder).

## 3) 🧩 Setup
### 3.1) Add the CSS
```
<link rel="stylesheet" href="proteus-cursor.min.css">
```

### 3.2) Import the JS
```
<script type="module">
    import ProteusCursor from './proteus-cursor.min.js';

    // Instantiate your ProteusCursor here
    
</script>
```
---

#### ✨ Cursor Types & Examples
##### 🔵 Circle Cursor
```
currentCursor = new ProteusCursor({
               shape: 'circle',
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

##### 🌊 Fluid Cursor
```
currentCursor = new ProteusCursor({
               shape: 'circle',
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


## 📜 License
This project is licensed under the MIT License.
Feel free to use, modify, and share! 💫
