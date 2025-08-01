/*!
 * Proteus Cursor v1.1.5
 * https://github.com/Shuriken933/proteus-cursor
 *
 * A dynamic JavaScript library that transforms the default mouse cursor
 * into interactive shapes based on HTML element interactions.
 * Inspired by Proteus, the Greek god of change, this library provides
 * a flexible way to customize the user’s pointer experience on the web.
 *
 * Features:
 * - Cursor shape customization (dot, circle, fluid, text, etc.)
 * - Magnetic effects
 * - Smooth shadow animations
 * - Easy integration via ES module or browser script tag
 *
 * Author: Eros Agostini (https://github.com/Shuriken933)
 * License: MIT
 * Released: July 2025
 *
 * © 2025 Eros Agostini. All rights reserved.
 */


export default class ProteusCursor{
   // internal state
   velocity = 0;
   _x = 0;
   _y = 0;
   mouseX = 0;
   mouseY = 0;
   cursorX = 0;
   cursorY = 0;
   prevMouseX = 0;
   prevMouseY = 0;
   // cursor = document.getElementById('cursor');
   // cursorVisible = true;
   // cursorEnlarged = false;
   // $shape = document.querySelector('.proteus-cursor-shape');
   // $shadow = document.querySelector('.proteus-cursor-shadow');
   // endX = 0;
   // endY = 0;
   // delay = 8;

   constructor(options = {}){

      this.testMode = false;

      // shape
      this.shape = options.shape || 'default';
      this.shape_size = options.shape_size || '10px';
      this.shape_color = options.shape_color || '#fff';

      // shadow
      this.hasShadow = options.hasShadow ?? true;
      if (this.hasShadow){
         this.shadow_delay = options.shadow_delay || '0.3s'
         this.shadow_size = options.shadow_size || '40px'
         this.shadow_color = options.shadow_color || '#ffffff'
      } else {
         this.shadow_delay = '0s'
         document.querySelector('.proteus-cursor-shadow').style.display = 'none'
      }

      // text
      this.text = ''
      this.text_color = ''
      this.text_weight = ''
      this.text_size = ''


      this.isMagnetic = false



      // Aggiungi questi per tracciare tutto ciò che deve essere pulito
      this.eventListeners = [];
      this.animationIds = [];
      this.intervals = [];
      this.timeouts = [];
      this.isDestroyed = false;

      // Bind dei metodi per poterli rimuovere correttamente
      this.boundMouseMove = this.handleMouseMove.bind(this);
      this.boundMouseEnter = this.handleMouseEnter.bind(this);
      this.boundMouseLeave = this.handleMouseLeave.bind(this);
      this.boundAnimateCircle = this.animateCircleShadow.bind(this);
      this.boundAnimateFluid = this.animateFluidCursor.bind(this);



      this.init();
      this.dataAttributeEvents();

   }

   init(){
      this.$shape = document.getElementById('proteus-cursor-shape');
      this.$shadow = document.getElementById('proteus-cursor-shadow');
      this.$shape.style.width = this.shape_size || '20px';
      this.$shape.style.height = this.shape_size || '20px';
      this.$shadow.style.width = this.shadow_size || '40px';
      this.$shadow.style.height = this.shadow_size || '40px';
      this.setShape(this.shape);
   }

   // Metodo helper per aggiungere event listeners tracciabili
   addEventListenerTracked(element, event, handler, options = false) {
      if (this.isDestroyed) return;

      element.addEventListener(event, handler, options);
      this.eventListeners.push({
         element,
         event,
         handler,
         options
      });
   }

   // Metodo helper per requestAnimationFrame tracciabile
   requestAnimationFrameTracked(callback) {
      if (this.isDestroyed) return;

      const id = requestAnimationFrame(callback);
      this.animationIds.push(id);
      return id;
   }


   setShape(shape){
      document.querySelector('body').classList.remove('proteus-is-a-fluid');
      document.querySelector('body').classList.remove('proteus-is-a-circle');
      console.log("setShape executed")
      this.shape = shape
      switch (this.shape) {
         case 'default':
            break;
         case 'circle':
            this.setShape__circle(this.shape)
            break;
         case 'fluid':
            this.setShape__fluid();
            break;
      }

      printShape(this.shape);
   }

   /* -------------------------------------------------------------------------------- */
   /* ! Type Shape */
   /* -------------------------------------------------------------------------------- */

   /* ! - type 1) CIRCLE */
   setShape__circle(shape){
      this.delay = 8;
      this._x = 0
      this._y = 0;
      this.endX = (window.innerWidth / 2);
      this.endY = (window.innerHeight / 2);
      this.cursorVisible = true;
      this.cursorEnlarged = false;
      // this.$shape = document.querySelector('.proteus-cursor-shape');
      // this.$shadow = document.querySelector('.proteus-cursor-shadow');
      document.querySelector('body').classList.add('proteus-is-a-circle');
      // this.init()

      document.body.style.cursor = 'none';

      // this.$shape.style.width = this.shape_size || '20px';
      // this.$shape.style.height = this.shape_size || '20px';
      // this.$shadow.style.width = this.shadow_size || '40px';
      // this.$shadow.style.height = this.shadow_size || '40px';
      this.shape__circle__interactions();
      this.shape__circle__animateShadow();
   }
   shape__circle__interactions() {
      // Salva i references degli handlers
      if (this.isDestroyed) return;

      // Aggiungi event listeners tracciabili
      document.querySelectorAll('a, button, input').forEach(el => {
         this.addEventListenerTracked(el, 'mouseover', this.boundMouseEnter);
         this.addEventListenerTracked(el, 'mouseout', this.boundMouseLeave);
      });

      this.addEventListenerTracked(document, 'mousemove', this.boundMouseMove);

   }

   handleMouseMove(e) {
      if (this.isDestroyed) return;

      this.cursorVisible = true;
      this.toggleCursorVisibility();
      this.endX = e.pageX;
      this.endY = e.pageY;

      if (this.$shape) {
         this.$shape.style.top = this.endY + 'px';
         this.$shape.style.left = this.endX + 'px';
      }
   }

   handleMouseEnter() {
      if (this.isDestroyed) return;
      this.cursorEnlarged = true;
      this.toggleCursorSize();
   }

   handleMouseLeave() {
      if (this.isDestroyed) return;
      this.cursorEnlarged = false;
      this.toggleCursorSize();
   }

   // Modifica il metodo di animazione del circle shadow
   animateCircleShadow() {
      if (this.isDestroyed) return;

      this._x += (this.endX - this._x) / this.delay;
      this._y += (this.endY - this._y) / this.delay;

      if (this.$shadow) {
         this.$shadow.style.top = this._y + 'px';
         this.$shadow.style.left = this._x + 'px';
      }

      this.requestAnimationFrameTracked(this.boundAnimateCircle);
   }

   shape__circle__animateShadow() {
      this.animateCircleShadow();
   }

   shape__circle__animateShadow() {
      // this._x += (this.endX - this._x) / this.delay;
      // this._y += (this.endY - this._y) / this.delay;
      // this.$shadow.style.top = this._y + 'px';
      // this.$shadow.style.left = this._x + 'px';
      //
      // requestAnimationFrame(this.shape__circle__animateShadow.bind(this));
      this._x += (this.endX - this._x) / this.delay;
      this._y += (this.endY - this._y) / this.delay;
      this.$shadow.style.top = this._y + 'px';
      this.$shadow.style.left = this._x + 'px';

      this.animationFrame = requestAnimationFrame(this.shape__circle__animateShadow.bind(this));
   }
   toggleCursorSize() {
      if (this.cursorEnlarged) {
         this.$shape.style.transform = 'translate(-50%, -50%) scale(1.5)';
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

   /* ! - type 2) FLUID */
   setShape__fluid__animateCursor__calcVelocity() {
      const fluidMouseHandler = (e) => {
         if (this.isDestroyed) return;

         const deltaX = e.clientX - this.prevMouseX;
         const deltaY = e.clientY - this.prevMouseY;
         this.velocity = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
         this.prevMouseX = this.mouseX;
         this.prevMouseY = this.mouseY;
         this.mouseX = e.clientX;
         this.mouseY = e.clientY;
      };

      this.addEventListenerTracked(document, 'mousemove', fluidMouseHandler);
   }
   setShape__fluid__animateCursor() {

         if (this.isDestroyed) return;

         if (!this.velocityInitialized) {
            this.setShape__fluid__animateCursor__calcVelocity();
            this.velocityInitialized = true;
         }

         const speed = 0.9;
         this.cursorX += (this.mouseX - this.cursorX) * speed;
         this.cursorY += (this.mouseY - this.cursorY) * speed;

         const maxVelocity = 10;
         const normalizedVelocity = Math.min(this.velocity / maxVelocity, 1);

         if (normalizedVelocity > 0.01) {
            const deltaX = this.mouseX - this.cursorX;
            const deltaY = this.mouseY - this.cursorY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            if (distance > 0) {
               const dirX = deltaX / distance;
               const dirY = deltaY / distance;
               const stretchFactor = 1 + normalizedVelocity * 1.5;
               const squeezeFactor = 1 - normalizedVelocity * 0.3;
               const a = dirX * dirX * (stretchFactor - 1) + 1;
               const b = dirX * dirY * (stretchFactor - 1);
               const c = dirX * dirY * (stretchFactor - 1);
               const d = dirY * dirY * (stretchFactor - 1) + 1;
               const perpDirX = -dirY;
               const perpDirY = dirX;
               const finalA = a + perpDirX * perpDirX * (squeezeFactor - 1);
               const finalB = b + perpDirX * perpDirY * (squeezeFactor - 1);
               const finalC = c + perpDirX * perpDirY * (squeezeFactor - 1);
               const finalD = d + perpDirY * perpDirY * (squeezeFactor - 1);

               if (this.$shape) {
                  this.$shape.style.transform = `matrix(${finalA}, ${finalB}, ${finalC}, ${finalD}, 0, 0)`;
               }
            } else if (this.$shape) {
               this.$shape.style.transform = 'matrix(1, 0, 0, 1, 0, 0)';
            }
         } else if (this.$shape) {
            this.$shape.style.transform = 'matrix(1, 0, 0, 1, 0, 0)';
         }

         if (this.$shape) {
            this.$shape.style.left = this.cursorX - this.$shape.offsetWidth / 2 + 'px';
            this.$shape.style.top = this.cursorY - this.$shape.offsetHeight / 2 + 'px';
         }

         this.velocity *= 0.95;
         this.requestAnimationFrameTracked(this.boundAnimateFluid);

   }

   animateFluidCursor() {
      this.setShape__fluid__animateCursor();
   }
   setShape__fluid() {
      document.querySelector('body').classList.add('proteus-is-a-fluid');
      // hyde cursor system
      document.body.style.cursor = 'none';
      // Assicurati che l'elemento cursor esista
      if (!this.$shape) {
         console.error("Elemento con id 'cursor' non trovato!");
         return;
      }

      // set base style of cursor fluid
      this.$shape.style.position = 'fixed';
      this.$shape.style.width = this.shape_size || '20px';
      this.$shape.style.height = this.shape_size || '20px';
      this.$shape.style.backgroundColor = this.shape_color || '#fff';
      this.$shape.style.borderRadius = '50%';
      this.$shape.style.pointerEvents = 'none';
      this.$shape.style.zIndex = '9999';
      this.$shape.style.transition = 'all 0.3s cubic-bezier(0.23, 1, 0.320, 1)';

      if (this.hasShadow) {
         this.$shape.style.boxShadow = `0 0 ${this.shadow_size} ${this.shadow_color}`;
      }

      // initialize the variables
      this.velocityInitialized = false;
      this.cursorX = window.innerWidth / 2;
      this.cursorY = window.innerHeight / 2;

      // start animation
      this.setShape__fluid__animateCursor();
   }




   destroy() {
      console.log('🔴 Destroying ProteusCursor instance...');

      // Marca come distrutto per fermare tutte le operazioni
      this.isDestroyed = true;

      // 1. FERMA TUTTE LE ANIMAZIONI
      this.animationIds.forEach(id => {
         cancelAnimationFrame(id);
      });
      this.animationIds = [];

      // 2. RIMUOVI TUTTI GLI INTERVALS E TIMEOUTS
      this.intervals.forEach(id => clearInterval(id));
      this.timeouts.forEach(id => clearTimeout(id));
      this.intervals = [];
      this.timeouts = [];

      // 3. RIMUOVI TUTTI GLI EVENT LISTENERS
      this.eventListeners.forEach(({ element, event, handler, options }) => {
         try {
            element.removeEventListener(event, handler, options);
         } catch (e) {
            console.warn('Error removing event listener:', e);
         }
      });
      this.eventListeners = [];

      // 4. RIPRISTINA IL CURSORE DI SISTEMA
      document.body.style.cursor = '';

      // 5. RIMUOVI LE CLASSI CSS
      const body = document.querySelector('body');
      if (body) {
         body.classList.remove('proteus-is-a-fluid');
         body.classList.remove('proteus-is-a-circle');
      }

      // 6. RESET COMPLETO DEGLI ELEMENTI DOM
      if (this.$shape) {
         this.$shape.style.cssText = '';
         this.$shape.style.display = 'none';
         this.$shape.style.opacity = '0';
         this.$shape.style.transform = '';
         this.$shape.style.left = '';
         this.$shape.style.top = '';
         this.$shape.style.width = '';
         this.$shape.style.height = '';
         this.$shape.style.backgroundColor = '';
         this.$shape.style.borderRadius = '';
         this.$shape.style.boxShadow = '';
         this.$shape.textContent = '';
      }

      if (this.$shadow) {
         this.$shadow.style.cssText = '';
         this.$shadow.style.display = 'none';
         this.$shadow.style.opacity = '0';
         this.$shadow.style.transform = '';
         this.$shadow.style.left = '';
         this.$shadow.style.top = '';
         this.$shadow.style.width = '';
         this.$shadow.style.height = '';
         this.$shadow.style.backgroundColor = '';
      }

      // 7. NULLIFICA TUTTI I RIFERIMENTI
      this.$shape = null;
      this.$shadow = null;
      this.boundMouseMove = null;
      this.boundMouseEnter = null;
      this.boundMouseLeave = null;
      this.boundAnimateCircle = null;
      this.boundAnimateFluid = null;

      // 8. RESET DELLE PROPRIETÀ
      this.velocity = 0;
      this._x = 0;
      this._y = 0;
      this.mouseX = 0;
      this.mouseY = 0;
      this.cursorX = 0;
      this.cursorY = 0;
      this.prevMouseX = 0;
      this.prevMouseY = 0;
      this.velocityInitialized = false;

      console.log('✅ ProteusCursor instance completely destroyed');
   }

   /* -------------------------------------------------------------------------------- */
   /* ! Setter */
   /* -------------------------------------------------------------------------------- */
   setShapeSize(width, height, isPermanent = false){
      console.log("setShapeSize executed")
      printAllProperties(this)
      if(isPermanent){
         this.shape_size = width || '20px';
         this.shadow_size = height || '20px';
         this.$shape.style.width = width || '20px';
         this.$shape.style.height = height || '20px';
      } else {
         this.$shape.style.width = width || '20px';
         this.$shape.style.height = height || '20px';
      }
   }
   setShapeColor(color, isPermanent = false){
      if(isPermanent){
         this.shape_color = color;
         this.$shape.style.backgroundColor = color;
      } else {
         this.$shape.style.backgroundColor = color;
      }
   }

   setShadowEnabled(isEnabled, isPermanent = false){
      if(this.shape === 'circle'){
         if(isPermanent){
            this.hasShadow = isEnabled;
            if (this.hasShadow){
               this.$shadow.style.display = 'block';
            } else {
               this.$shadow.style.display = 'none';
            }
         } else{
            if (isEnabled){
               this.$shadow.style.display = 'block';
            } else {
               this.$shadow.style.display = 'none';
            }
         }
      } else if(this.shape === 'fluid'){
         if(isPermanent){
            this.$shape.style.boxShadow = `0 0 ${this.shadow_size} ${this.shadow_color}`;
         } else{

         }
      }

   }
   setShadowSize(width, height){
      this.$shadow.style.width = width || '20px';
      this.$shadow.style.height = height || '20px';
   }
   setShadowColor(hexColor, alpha = 0.5){
      const rgba = hexToRgba(hexColor, alpha);
      this.$shadow.style.backgroundColor = rgba;
   }

   setText(text, isPermanent = false){
      if(isPermanent){
         this.text = text;
         document.querySelector('.proteus-cursor-shape').textContent = this.text;
      } else{
         document.querySelector('.proteus-cursor-shape').textContent = text;
      }
   }
   setTextColor(color, permanent = false){
      if(permanent){
         this.text_color = color;
         document.querySelector('.proteus-cursor-shape').style.color = color;
      } else{
         document.querySelector('.proteus-cursor-shape').style.color = color;
      }

   }
   setTextWeight(weight, isPermanent = false){
      if(isPermanent){
         this.text_weight = weight;
         document.querySelector('.proteus-cursor-shape').style.fontWeight = weight;
      } else{
         document.querySelector('.proteus-cursor-shape').style.fontWeight = weight;
      }
   }
   setTextSize(size, isPermanent = false){
      if(isPermanent){
         this.text_size = size;
         document.querySelector('.proteus-cursor-shape').style.fontSize = size;
      } else{
         document.querySelector('.proteus-cursor-shape').style.fontSize = size;
      }
   }


   /* -------------------------------------------------------------------------------- */
   /* ! Data attribute */
   /* -------------------------------------------------------------------------------- */
   dataAttributeEvents(){
      document.querySelectorAll(
         '[data-proteus-shapeSize], ' +
         '[data-proteus-shapeColor], ' +

         '[data-proteus-text], ' +
         '[data-proteus-textColor], ' +
         '[data-proteus-textSize], ' +
         '[data-proteus-textWeight]'
      )
         .forEach(el => {
            // Modify Proteus
            el.addEventListener('mouseenter', () => {

               // shape
               const shape_size = el.getAttribute('data-proteus-shapeSize');
               const shape_color = el.getAttribute('data-proteus-shapeColor');
               // text
               const text = el.getAttribute('data-proteus-text');
               const text_color = el.getAttribute('data-proteus-textColor');
               const text_size = el.getAttribute('data-proteus-textSize');
               const text_weight = el.getAttribute('data-proteus-textWeight');
               // shadow
               const shadow_isEnabled = el.getAttribute('data-proteus-shadowIsEnabled');

               if (shape_size) this.setShapeSize(shape_size, shape_size);
               if (shape_color) this.setShapeColor(shape_color);
               if (text) this.setText(text);
               if (text_color) this.setTextColor(text_color);
               if (text_size) this.setTextSize(text_size);
               if (text_weight) this.setTextWeight(text_weight);
               if (shadow_isEnabled) this.setShadowEnabled(true);
            });

            // Reset all to defaults settings
            el.addEventListener('mouseleave', () => {

               this.setShapeSize(this.shape_size, this.shape_size);
               this.setShapeColor(this.shape_color);
               this.setText(this.text);
               this.setTextColor(this.text_color);
               this.setTextSize(this.text_size);
               this.setTextWeight(this.text_weight);
            });
         });
   }


   /* -------------------------------------------------------------------------------- */
   /* ! Test mode */
   /* -------------------------------------------------------------------------------- */
   enableTestMode() {
   this.testMode = true;

   this.enableTestMode__generateHTML()
   const panel = document.querySelector("#proteus-panel-test");

   // Now we can select the real DOM element and add the event listener
   const button = document.querySelector("#proteus-button-test");
   button.addEventListener("click", () => {panel.classList.toggle('open')} );

   // type shape
   const buttonTypeShape_dot = document.querySelector("#button-setShape-dot");
   const buttonTypeShape_circle = document.querySelector("#button-setShape-circle");

   // Optional class toggle
   button.classList.add("active");
}

   enableTestMode__generateHTML(){
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
}

   disableTestMode(){
   this.testMode = false;
   document.querySelector('#proteus-button-test').classList.remove('active')
}

}


/* -------------------------------------------------------------------------------- */
/* ! Helper */
/* -------------------------------------------------------------------------------- */
function showButtonTest(){
   document.querySelector('#proteus-button-test').classList.add('active')
}
function hideButtonTest(){
   document.querySelector('#proteus-button-test').classList.remove('active')
}
function printShape(shape){
   console.log('This is the type: ', shape);
}
function hexToRgba(hex, alpha = 1) {
   const r = parseInt(hex.slice(1, 3), 16);
   const g = parseInt(hex.slice(3, 5), 16);
   const b = parseInt(hex.slice(5, 7), 16);
   return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
function printAllProperties(object){
   console.log(object);
}
