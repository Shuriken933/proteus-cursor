# proteus-cursor
Proteus Cursor is a dynamic JavaScript library that revolutionizes web user interaction by transforming the mouse cursor based on HTML element interactions. Inspired by the shape-shifting god Proteus, this library allows the cursor to change into various shapes and behaviors, such as a dot, circle, or text, depending on the element it hovers over


## Install via npm
```
npm install proteus-cursor
```

## Import
```
<link rel="stylesheet" href="node_modules/proteus-cursor/dist/styles.css">
```
or
```
import 'proteus-cursor/dist/styles.css';
```


## Usage
```
// Initialize Proteus Cursor with default settings
const cursor = new ProteusCursor();

// Example: Change cursor to a circle on hover over elements with class 'circle-hover'
cursor.addInteraction('.circle-hover', {
    cursorShape: 'circle',
    cursorColor: '#ff0000'
});
```


## License
This project is licensed under the MIT License.
