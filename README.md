# Proteus Cursor
Proteus Cursor is a dynamic JavaScript library that revolutionizes web user interaction by transforming the mouse cursor based on HTML element interactions. Inspired by the shape-shifting god Proteus, this library allows the cursor to change into various shapes and behaviors, such as a dot, circle, or text, depending on the element it hovers over


## Install via npm
```
npm install proteus-cursor
```

## Import

### css
```
<link rel="stylesheet" href="node_modules/proteus-cursor/dist/styles.css">
```

### js and usage
```
<script type="module">
    import ProteusCursor from './proteus-cursor.js';
    document.addEventListener("DOMContentLoaded", () => {
        // Initialize the ProteusCursor
        let cursor = new ProteusCursor();
        cursor.setShape('circle'); // Set the cursor shape to 'circle'
        cursor.enableTestMode(); // enable TEST MODE
    });
</script>
```


## License
This project is licensed under the MIT License.
