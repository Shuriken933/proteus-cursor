/*! ProteusCursor.js - v0.0.1
* A lightweight javascript library to create some amazing effects for the mouse (cursor) on your website
* https://github.com/
* Copyright (c) 2023 Eros A. under MIT license; */

export default class ProteusCursor{

   constructor(){
      this.testMode = false;

      // shape
      this.shape = 'default'
      this.shape_size = ''
      this.shape_color = ''

      // shadow
      this.hasShadow = true
      this.shadow_delay = '0.3s'
      this.shadow_size = '20px'
      this.shadow_color = '#ffffff'

      // background
      this.background_color = '#ffffff'
      this.background_opacity = 0.5

      // text
      this.text = ''
      this.text_color = ''
      this.isMagnetic = false

   }


   enableTestMode() {
      this.testMode = true;

      const container = document.querySelector("body");

      // HTML string for the button
      const buttonHTML = `
      <button id="proteus-button-test">
         <img src="icons/icon-cursor.svg" alt="icon" width="35" height="35" />
      </button>
   `;

      // Insert the button into the DOM
      container.insertAdjacentHTML("beforeend", buttonHTML);

      // HTML for the panel
      const panelHTML = `
         <div id="proteus-panel-test">
            <p>Type cursor</p>
            <ul>
               <li><button id="button-setShape-circle">circle</button></li>
               <li><button id="button-setShape-dot">dot</button></li>
               <li><button></button></li>
               <li><button></button></li>
            </ul>
            
            <p>Modifiers</p>
            <ul>
               <li><button>magnetic</button></li>
               <li><button>parallax hover</button></li>
               <li><button>text</button></li>
            </ul>
         </div>
      `;

      container.insertAdjacentHTML("beforeend", panelHTML);
      const panel = document.querySelector("#proteus-panel-test");

      // Now we can select the real DOM element and add the event listener
      const button = document.querySelector("#proteus-button-test");
      button.addEventListener("click", () => {panel.classList.toggle('open')} );

      // type shape
      const buttonTypeShape_dot = document.querySelector("#button-setShape-dot");
      const buttonTypeShape_circle = document.querySelector("#button-setShape-circle");
      // listeners
      buttonTypeShape_dot.addEventListener("click", () => {this.setShape('dot')} );
      buttonTypeShape_circle.addEventListener("click", () => {this.setShape('circle')} );

      // Optional class toggle
      button.classList.add("active");
   }

   disableTestMode(){
      this.testMode = false;
      document.querySelector('#proteus-button-test').classList.remove('active')
   }


   setShape(shape){
      this.shape = shape
      // if (this.shape === 'dot') {
      //    this.setShape_dot(shape)
      // }
      if (this.shape === 'circle') {
         this.setShape_circle(shape)
      }
      this.printShape();
   }

   setShape_circle(shape){
      this.delay = 8;
      this._x = 0
      this._y = 0;
      this.endX = (window.innerWidth / 2);
      this.endY = (window.innerHeight / 2);
      this.cursorVisible = true;
      this.cursorEnlarged = false;
      this.$shape = document.querySelector('.proteus-cursor-shape');
      this.$shadow = document.querySelector('.proteus-cursor-shadow');
      this.init()
      console.log("setShape_circle executed")
   }

   setModifier(modifier){

   }

   init() {
      if (this.testMode) {
         this.showButtonTest()
      }

      switch (this.shape) {
         case 'default':
            this.$shape.style.display = 'none';
            break;
         case 'circle':
            document.body.style.cursor = 'none';
            this.shape_size = this.$shape.offsetWidth;
            this.shadow_size = this.$shadow.offsetWidth;
            this.setupEventListeners();
            this.animateShadow();
            break;
         case 'circle':
            break;
      }

   }

   showButtonTest(){
      document.querySelector('#proteus-button-test').classList.add('active')
   }
   hideButtonTest(){
      document.querySelector('#proteus-button-test').classList.remove('active')
   }

   printShape(){
      console.log('This is the type: ', this.shape);
   }

   setupEventListeners() {
      document.querySelectorAll('a').forEach(el => {
         el.addEventListener('mouseover', () => {
            this.cursorEnlarged = true;
            this.toggleCursorSize();
         });
         el.addEventListener('mouseout', () => {
            this.cursorEnlarged = false;
            this.toggleCursorSize();
         });
      });

      document.addEventListener('mousedown', () => {
         this.cursorEnlarged = true;
         this.toggleCursorSize();
      });
      document.addEventListener('mouseup', () => {
         this.cursorEnlarged = false;
         this.toggleCursorSize();
      });

      document.addEventListener('mousemove', e => {
         this.cursorVisible = true;
         this.toggleCursorVisibility();

         this.endX = e.pageX;
         this.endY = e.pageY;
         this.$shape.style.top = this.endY + 'px';
         this.$shape.style.left = this.endX + 'px';
      });

      document.addEventListener('mouseenter', () => {
         this.cursorVisible = true;
         this.toggleCursorVisibility();
         this.$shape.style.opacity = 1;
         this.$shadow.style.opacity = 1;
      });

      document.addEventListener('mouseleave', () => {
         this.cursorVisible = false;
         this.toggleCursorVisibility();
         this.$shape.style.opacity = 0;
         this.$shadow.style.opacity = 0;
      });
   }

   animateShadow() {
      this._x += (this.endX - this._x) / this.delay;
      this._y += (this.endY - this._y) / this.delay;
      this.$shadow.style.top = this._y + 'px';
      this.$shadow.style.left = this._x + 'px';

      requestAnimationFrame(this.animateShadow.bind(this));
   }

   toggleCursorSize() {
      if (this.cursorEnlarged) {
         this.$shape.style.transform = 'translate(-50%, -50%) scale(0.75)';
         this.$shadow.style.transform = 'translate(-50%, -50%) scale(1.5)';
      } else {
         this.$shape.style.transform = 'translate(-50%, -50%) scale(1)';
         this.$shadow.style.transform = 'translate(-50%, -50%) scale(1)';
      }
   }

   toggleCursorVisibility() {
      if (this.cursorVisible) {
         this.$shape.style.opacity = 1;
         this.$shadow.style.opacity = 1;
      } else {
         this.$shape.style.opacity = 0;
         this.$shadow.style.opacity = 0;
      }
   }
}

