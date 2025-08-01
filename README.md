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
There are two different import style

- ### 🧪 Without bundler
    Ideal for simple projects
    ```
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
    Ideal for modular projects with Vite, Webpack, Nuxt, ecc.
    #### 📁 1. install with npm
    ```bash
    npm install proteuscursor
    ```

    #### ✍️ 2. Import in your JS modules
    ```
    import ProteusCursor from 'proteuscursor';
    import 'proteuscursor/style'; // importa lo stile CSS minificato
    
    const cursor = new ProteusCursor({
      // proteus options
    });
    ```

---
## 3) Proteus options
There are a lot of options ✨ for Proteus.
First of all you can set a cursor type:
- circle
- fluid
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
