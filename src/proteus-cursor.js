/*!
 * Proteus Cursor v2.0.0
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

   //region 🔹 initialization
   // internal state
   velocity = 0;
   smoothDirX = 0;
   smoothDirY = 0;
   _x = 0;
   _y = 0;
   mouseX = 0;
   mouseY = 0;
   cursorX = 0;
   cursorY = 0;
   _baseShape = 'default';

   //region 🏗️ constructor
   constructor(options = {}){

      this.testMode = false;

      // shape
      this.shape = options.shape || 'default';
      this._baseShape = this.shape;
      this.shape_size = options.shape_size || '10px';
      this.shape_color = options.shape_color || '#fff';

      // shadow
      this.hasShadow = options.hasShadow ?? true;
      this.shadow_delay = this.hasShadow ? (options.shadow_delay || '0.3s') : '0s';
      this.shadow_size = options.shadow_size || '40px';
      this.shadow_color = options.shadow_color || '#ffffff';

      // text
      this.text = ''
      this.text_color = ''
      this.text_weight = ''
      this.text_size = ''

      this.speed = 0.9;
      this.maxVelocity = 10;

      this.isMagnetic = options.magnetic ?? false;

      // blend mode
      this.blend_mode = options.blend_mode || 'normal';

      // trail
      this.trail_length = options.trail_length || 0;
      this.trail_opacity = options.trail_opacity ?? 0.3;
      this._trailElements = [];
      this._trailPositions = [];

      // click animation
      this.click_animation = options.click_animation || 'scale';
      this.click_duration = options.click_duration ?? 300;

      // state machine
      this.states = {};

      // events
      this.eventListeners = [];
      this.animationIds = [];
      this.intervals = [];
      this.timeouts = [];
      this.isDestroyed = false;

      // Touch-only devices: skip DOM creation and event binding entirely.
      // The native cursor works fine on touch; injecting overlay elements
      // wastes resources and serves no purpose.
      this.isTouch = ProteusCursor.isTouchOnly();
      if (this.isTouch) return;

      // Reduced-motion: respect the user's OS-level accessibility preference.
      // When prefers-reduced-motion: reduce is active we skip initialization
      // entirely so no animations, RAF loops or overlay elements are created.
      // Can be opted-out by passing respectReducedMotion: false.
      this.respectReducedMotion = options.respectReducedMotion ?? true;
      this.isReducedMotion = this.respectReducedMotion && ProteusCursor.prefersReducedMotion();
      if (this.isReducedMotion) return;

      // Bind dei metodi per poterli rimuovere correttamente
      this.boundMouseMove = this.handleMouseMove.bind(this);
      this.boundMouseEnter = this.handleMouseEnter.bind(this);
      this.boundMouseLeave = this.handleMouseLeave.bind(this);
      this.boundAnimateCircle = this.animateCircleShadow.bind(this);
      this.boundAnimateFluid = this.animateFluidCursor.bind(this);

      this.init();
      if (!this.hasShadow) {
         this.$shadow.style.display = 'none';
      }
      if (this.trail_length > 0) this._initTrail();
      this.dataAttributeEvents();
      this._initClickAnimation();

   }

   /**
    * Returns true when the primary pointing device is coarse (touch / finger).
    * Uses the CSS pointer media feature which is the most reliable heuristic:
    * - phones, tablets without a paired mouse  → true  (skip cursor)
    * - laptops with touchscreen                → false (primary pointer is mouse)
    * - iPad/Surface with paired mouse/stylus   → false (fine pointer available)
    */
   static isTouchOnly() {
      if (typeof window === 'undefined') return false;
      return window.matchMedia('(pointer: coarse)').matches;
   }

   /**
    * Returns true when the user has requested reduced motion at the OS level
    * (`prefers-reduced-motion: reduce`). ProteusCursor calls this automatically;
    * you can use it for your own conditional logic.
    */
   static prefersReducedMotion() {
      if (typeof window === 'undefined') return false;
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
   }

   /** @private — returns true when the cursor is active (not destroyed, not touch, not reduced-motion). */
   _isActive() {
      return !this.isDestroyed && !this.isTouch && !this.isReducedMotion;
   }
   //endregion

   init(){
      this.init_HTMLcursorAndShadow()

      this.$shape = document.getElementById('proteus-cursor-shape');
      this.$shadow = document.getElementById('proteus-cursor-shadow');
      this.$shape.style.width = this.shape_size || '20px';
      this.$shape.style.height = this.shape_size || '20px';
      this.$shape.style.backgroundColor = this.shape_color;
      this.$shadow.style.width = this.shadow_size || '40px';
      this.$shadow.style.height = this.shadow_size || '40px';
      this.$shadow.style.backgroundColor = this.shadow_color;
      this.setShape(this.shape);
      if (this.blend_mode && this.blend_mode !== 'normal') {
         this.$shape.style.mixBlendMode = this.blend_mode;
      }
   }

   init_HTMLcursorAndShadow(){

      if(document.getElementById('proteus-cursor-shape')) return;

      // Create HTML cursor
      const proteusCursorShape = document.createElement('div');
      proteusCursorShape.className = 'proteus-cursor-shape';
      proteusCursorShape.id = 'proteus-cursor-shape';

      // Create HTML shadow
      const proteusCursorShadow = document.createElement('div');
      proteusCursorShadow.className = 'proteus-cursor-shadow';
      proteusCursorShadow.id = 'proteus-cursor-shadow';

      const body = document.body;

      // Add the elements to the body
      body.prepend(proteusCursorShape);
      body.prepend(proteusCursorShadow);
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
      if (!this._isActive()) return;
      this._baseShape = shape;
      this._activateShape(shape);
   }

   /** @private — switch mode without updating _baseShape (used by state machine). */
   _activateShape(shape) {
      if (!this._isActive()) return;
      document.querySelector('body').classList.remove('proteus-is-a-fluid');
      document.querySelector('body').classList.remove('proteus-is-a-circle');
      this.shape = shape;
      switch (this.shape) {
         case 'default':
            break;
         case 'circle':
            this.setShape__circle(this.shape);
            break;
         case 'fluid':
            this.setShape__fluid();
            break;
      }
   }
   //endregion

   /* -------------------------------------------------------------------------------- */
   /* ! Type Shape */
   /* -------------------------------------------------------------------------------- */

   //region 🧩 Type shape CIRCLE
   setShape__circle(shape){
      // Stop any running animation frames (e.g. fluid loop) before starting circle.
      this.animationIds.forEach(id => cancelAnimationFrame(id));
      this.animationIds = [];

      this.delay = 8;
      this._x = 0;
      this._y = 0;
      // Seed circle shadow at current mouse position (clientX = viewport coords).
      // Falls back to centre only when the mouse has never moved.
      this.endX = this.mouseX > 0 ? this.mouseX : (window.innerWidth / 2);
      this.endY = this.mouseY > 0 ? this.mouseY : (window.innerHeight / 2);
      // Seed the shadow tracking position so it doesn't jump from 0,0.
      this._x = this.endX;
      this._y = this.endY;
      this.cursorVisible = true;
      this.cursorEnlarged = false;
      document.querySelector('body').classList.add('proteus-is-a-circle');

      document.body.style.cursor = 'none';

      // Ensure shadow is visible in circle mode (may have been hidden by fluid mode).
      if (this.$shadow) {
         this.$shadow.style.display = this.hasShadow ? '' : 'none';
         this.$shadow.style.transform = 'translate(-50%, -50%) scale(1)';
      }
      // Reset fluid transform so shape returns to a circle.
      if (this.$shape) {
         this.$shape.style.transform = 'translate(-50%, -50%) scale(1)';
         this.$shape.style.transition = '';
      }

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

      this._updateTrail(this.endX, this.endY);

      this.requestAnimationFrameTracked(this.boundAnimateCircle);
   }

   shape__circle__animateShadow() {
      this.animateCircleShadow();
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

   //endregion

   //region 🧩 Type shape FLUID
   setShape__fluid__animateCursor__calcVelocity() {
      const fluidMouseHandler = (e) => {
         if (this.isDestroyed) return;
         const deltaX = e.clientX - this.mouseX;
         const deltaY = e.clientY - this.mouseY;
         // EMA smoothing (alpha=0.25): accumulates many events into a stable direction,
         // preventing the axis-bias from physical mouse encoding (often fires (dx,0)/(0,dy)
         // alternately rather than (dx,dy) together when moving diagonally).
         const alpha = 0.25;
         this.smoothDirX = this.smoothDirX * (1 - alpha) + deltaX * alpha;
         this.smoothDirY = this.smoothDirY * (1 - alpha) + deltaY * alpha;
         this.mouseX = e.clientX;
         this.mouseY = e.clientY;
         // Keep endX/endY in page-coords so mode switching back to circle is smooth.
         this.endX = e.clientX + (window.scrollX || 0);
         this.endY = e.clientY + (window.scrollY || 0);
      };
      this.addEventListenerTracked(document, 'mousemove', fluidMouseHandler);
   }
   setShape__fluid__animateCursor() {

         if (this.isDestroyed) return;

         if (!this.velocityInitialized) {
            this.setShape__fluid__animateCursor__calcVelocity();
            this.velocityInitialized = true;
         }

         this.cursorX += (this.mouseX - this.cursorX) * this.speed;
         this.cursorY += (this.mouseY - this.cursorY) * this.speed;

         // Decay the smoothed direction every RAF frame so it fades when mouse stops.
         const decay = 0.88;
         this.smoothDirX *= decay;
         this.smoothDirY *= decay;

         const mag = Math.sqrt(this.smoothDirX * this.smoothDirX + this.smoothDirY * this.smoothDirY);
         const normalizedVelocity = Math.min(mag / this.maxVelocity, 1);

         if (normalizedVelocity > 0.015 && mag > 0.05) {
            const dirX = this.smoothDirX / mag;
            const dirY = this.smoothDirY / mag;
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

         if (this.$shape) {
            this.$shape.style.left = this.cursorX - this.$shape.offsetWidth / 2 + 'px';
            this.$shape.style.top = this.cursorY - this.$shape.offsetHeight / 2 + 'px';
         }

         this.requestAnimationFrameTracked(this.boundAnimateFluid);

   }

   animateFluidCursor() {
      this.setShape__fluid__animateCursor();
   }
   setShape__fluid() {
      // Stop any running animation frames (e.g. circle shadow loop) before starting fluid.
      this.animationIds.forEach(id => cancelAnimationFrame(id));
      this.animationIds = [];

      document.querySelector('body').classList.add('proteus-is-a-fluid');
      // hide cursor system
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
      // CSS transitions on left/top/transform conflict with the RAF loop — disable.
      this.$shape.style.transition = 'none';
      // Reset the stretch matrix so the shape starts as a circle.
      this.$shape.style.transform = 'none';

      // Hide the circle-mode shadow element — fluid uses box-shadow on $shape instead.
      if (this.$shadow) this.$shadow.style.display = 'none';

      if (this.hasShadow) {
         this.$shape.style.boxShadow = `0 0 ${this.shadow_size} ${this.shadow_color}`;
      } else {
         this.$shape.style.boxShadow = 'none';
      }

      // Seed fluid cursor at the current mouse position so there's no jump.
      // endX/endY are page-coordinates; fluid uses fixed (viewport) coordinates.
      const scrollX = window.scrollX || 0;
      const scrollY = window.scrollY || 0;
      this.velocityInitialized = false;
      this.smoothDirX = 0;
      this.smoothDirY = 0;
      this.cursorX = this.endX > 0 ? (this.endX - scrollX) : (this.mouseX || window.innerWidth / 2);
      this.cursorY = this.endY > 0 ? (this.endY - scrollY) : (this.mouseY || window.innerHeight / 2);

      // Set position synchronously so there is no single-frame flash at a wrong position.
      const halfW = parseInt(this.shape_size) / 2 || 5;
      this.$shape.style.left = (this.cursorX - halfW) + 'px';
      this.$shape.style.top  = (this.cursorY - halfW) + 'px';

      // start animation
      this.setShape__fluid__animateCursor();
   }
   //endregion


   //region ❌ destroy Proteus
   destroy() {

      // No-op on touch or reduced-motion: nothing was created, nothing to tear down.
      if (this.isTouch || this.isReducedMotion) return;

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

      // 7. RIMUOVI TRAIL ELEMENTS
      this._destroyTrail();

      // 8. NULLIFICA TUTTI I RIFERIMENTI
      this.$shape = null;
      this.$shadow = null;
      this.boundMouseMove = null;
      this.boundMouseEnter = null;
      this.boundMouseLeave = null;
      this.boundAnimateCircle = null;
      this.boundAnimateFluid = null;

      // 9. RESET DELLE PROPRIETÀ
      this.velocity = 0;
      this.smoothDirX = 0;
      this.smoothDirY = 0;
      this._x = 0;
      this._y = 0;
      this.mouseX = 0;
      this.mouseY = 0;
      this.cursorX = 0;
      this.cursorY = 0;
      this.velocityInitialized = false;

   }
   //endregion


   /* -------------------------------------------------------------------------------- */
   //region ✨ Trail
   /* -------------------------------------------------------------------------------- */

   _initTrail() {
      this._destroyTrail();
      if (this.trail_length <= 0) return;
      const size = parseInt(this.shape_size) || 10;
      for (let i = 0; i < this.trail_length; i++) {
         const el = document.createElement('div');
         el.style.cssText = [
            'position:fixed',
            'pointer-events:none',
            'border-radius:50%',
            `width:${size}px`,
            `height:${size}px`,
            `background:${this.shape_color}`,
            'transform:translate(-50%,-50%)',
            'opacity:0',
            'will-change:left,top',
            `z-index:${9997 - i}`,
         ].join(';');
         document.body.appendChild(el);
         this._trailElements.push(el);
      }
      this._trailPositions = new Array(this.trail_length).fill(null);
   }

   _updateTrail(x, y) {
      if (!this._trailElements.length) return;
      this._trailPositions.unshift({ x, y });
      if (this._trailPositions.length > this.trail_length) {
         this._trailPositions.length = this.trail_length;
      }
      const n = this.trail_length;
      this._trailElements.forEach((el, i) => {
         const pos = this._trailPositions[i];
         if (!pos) { el.style.opacity = '0'; return; }
         el.style.left = pos.x + 'px';
         el.style.top = pos.y + 'px';
         el.style.opacity = String(this.trail_opacity * (1 - i / n));
      });
   }

   _destroyTrail() {
      this._trailElements.forEach(el => el.parentNode && el.parentNode.removeChild(el));
      this._trailElements = [];
      this._trailPositions = [];
   }

   /**
    * Set the number of trail dots following the cursor. Pass 0 to disable.
    * @param {number} n
    * @returns {this}
    */
   setTrailLength(n) {
      if (!this._isActive()) return this;
      this.trail_length = Math.max(0, n);
      this._initTrail();
      return this;
   }

   //endregion


   /* -------------------------------------------------------------------------------- */
   //region 🏷️ Setters
   /* -------------------------------------------------------------------------------- */
   setShapeSize(width, height, isPermanent = false){
      if (!this._isActive()) return;
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
      if (!this._isActive()) return;
      if(isPermanent){
         this.shape_color = color;
         this.$shape.style.backgroundColor = color;
      } else {
         this.$shape.style.backgroundColor = color;
      }
   }

   setShadowEnabled(isEnabled, isPermanent = false){
      if (!this._isActive()) return;
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
         const shadow = isEnabled ? `0 0 ${this.shadow_size} ${this.shadow_color}` : 'none';
         if(isPermanent) this.hasShadow = isEnabled;
         this.$shape.style.boxShadow = shadow;
      }

   }
   setShadowSize(width, height, isPermanent = false){
      if (!this._isActive()) return;
      if (isPermanent) this.shadow_size = width || '20px';
      this.$shadow.style.width = width || '20px';
      this.$shadow.style.height = height || '20px';
   }
   setShadowColor(hexColor, alpha = 0.5, isPermanent = false){
      if (!this._isActive()) return;
      const rgba = hexToRgba(hexColor, alpha);
      if (isPermanent) this.shadow_color = rgba;
      this.$shadow.style.backgroundColor = rgba;
   }

   setText(text, isPermanent = false){
      if (!this._isActive()) return;
      if(isPermanent){
         this.text = text;
         document.querySelector('.proteus-cursor-shape').textContent = this.text;
      } else{
         document.querySelector('.proteus-cursor-shape').textContent = text;
      }
   }
   setTextColor(color, permanent = false){
      if (!this._isActive()) return;
      if(permanent){
         this.text_color = color;
         document.querySelector('.proteus-cursor-shape').style.color = color;
      } else{
         document.querySelector('.proteus-cursor-shape').style.color = color;
      }

   }
   setTextWeight(weight, isPermanent = false){
      if (!this._isActive()) return;
      if(isPermanent){
         this.text_weight = weight;
         document.querySelector('.proteus-cursor-shape').style.fontWeight = weight;
      } else{
         document.querySelector('.proteus-cursor-shape').style.fontWeight = weight;
      }
   }
   setTextSize(size, isPermanent = false){
      if (!this._isActive()) return;
      if(isPermanent){
         this.text_size = size;
         document.querySelector('.proteus-cursor-shape').style.fontSize = size;
      } else{
         document.querySelector('.proteus-cursor-shape').style.fontSize = size;
      }
   }

   setSpeed(speed){
      this.speed = speed;
   }
   setMaxVelocity(maxVelocity){
      this.maxVelocity = maxVelocity;
   }

   /**
    * Apply a CSS mix-blend-mode to the cursor shape element.
    * @param {'normal'|'difference'|'exclusion'|string} mode  Any valid CSS mix-blend-mode value.
    * @param {boolean} [isPermanent=false]  When true, persists across state resets.
    */
   setBlendMode(mode, isPermanent = false) {
      if (!this._isActive()) return;
      if (isPermanent) this.blend_mode = mode;
      this.$shape.style.mixBlendMode = mode;
   }

   /**
    * Apply a shadow color given as a direct CSS color string (rgb, rgba, hex, keyword…).
    * Works for both circle (backgroundColor on $shadow) and fluid (boxShadow on $shape).
    * @private
    */
   _applyShadowColor(cssColor, isPermanent = false) {
      if (!this._isActive()) return;
      if (isPermanent) this.shadow_color = cssColor;
      if (this.shape === 'circle') {
         this.$shadow.style.backgroundColor = cssColor;
      } else if (this.shape === 'fluid') {
         if (this.hasShadow) {
            this.$shape.style.boxShadow = `0 0 ${this.shadow_size} ${cssColor}`;
         }
      }
   }

   // ── Preset system ──────────────────────────────────────────────────────────

   /**
    * Apply a named built-in preset to the live cursor instance.
    * Optionally pass an `overrides` object to customise individual properties.
    *
    * @param {keyof typeof ProteusCursor.PRESETS | string} name
    * @param {import('./proteus-cursor.d.ts').ProteusCursorOptions} [overrides]
    * @returns {this}
    *
    * @example
    * cursor.loadPreset('neon');
    * cursor.loadPreset('chrome', { shape_size: '64px' });
    */
   loadPreset(name, overrides = {}) {
      if (!this._isActive()) return this;
      const base = ProteusCursor.PRESETS[name];
      if (!base) {
         console.warn(`[ProteusCursor] Unknown preset: "${name}". Available: ${Object.keys(ProteusCursor.PRESETS).join(', ')}`);
         return this;
      }
      const preset = { ...base, ...overrides };

      if (preset.shape       !== undefined && preset.shape !== this.shape) this.setShape(preset.shape);
      if (preset.shape_size  !== undefined) this.setShapeSize(preset.shape_size, preset.shape_size, true);
      if (preset.shape_color !== undefined) this.setShapeColor(preset.shape_color, true);
      if (preset.hasShadow   !== undefined) this.setShadowEnabled(preset.hasShadow, true);
      if (preset.shadow_size !== undefined) this.setShadowSize(preset.shadow_size, preset.shadow_size, true);
      if (preset.shadow_color !== undefined) this._applyShadowColor(preset.shadow_color, true);
      if (preset.blend_mode  !== undefined) this.setBlendMode(preset.blend_mode, true);
      if (preset.click_animation !== undefined) this.click_animation = preset.click_animation;
      if (preset.trail_length !== undefined) { this.trail_length = preset.trail_length; this._initTrail(); }
      if (preset.trail_opacity !== undefined) this.trail_opacity = preset.trail_opacity;

      return this;
   }

   /**
    * Return the raw configuration object for a named preset.
    * Useful for constructing a cursor with a preset as a base and then overriding
    * individual properties:
    *
    * @example
    * const cursor = new ProteusCursor({
    *   ...ProteusCursor.getPreset('neon'),
    *   shape_color: '#ff4444',
    * });
    *
    * @param {string} name
    * @returns {import('./proteus-cursor.d.ts').ProteusCursorOptions | undefined}
    */
   static getPreset(name) {
      return ProteusCursor.PRESETS[name];
   }

   //endregion


   /* -------------------------------------------------------------------------------- */
   //region 🖱️ Click Animation
   /* -------------------------------------------------------------------------------- */
   _initClickAnimation() {
      if (this.click_animation === 'none') return;

      const handler = (e) => {
         if (this.isDestroyed) return;
         if (this.click_animation === 'scale') this._clickScale();
         if (this.click_animation === 'ripple') this._clickRipple(e);
      };
      this.addEventListenerTracked(document, 'mousedown', handler);
   }

   _clickScale() {
      if (!this.$shape) return;
      const duration = this.click_duration;
      if (this.shape === 'fluid') {
         // In fluid mode the RAF loop owns transform — setting a CSS transition on it
         // causes persistent jitter. Use opacity pulse instead.
         this.$shape.style.opacity = '0.35';
         const tid = setTimeout(() => {
            if (!this.isDestroyed && this.$shape) this.$shape.style.opacity = '1';
         }, duration / 3);
         this.timeouts.push(tid);
         return;
      }
      this.$shape.style.transition = `transform ${duration / 2}ms cubic-bezier(.215,.61,.355,1)`;
      this.$shape.style.transform = 'translate(-50%, -50%) scale(0.6)';
      const tid = setTimeout(() => {
         if (this.isDestroyed || !this.$shape) return;
         this.$shape.style.transform = 'translate(-50%, -50%) scale(1)';
      }, duration / 2);
      this.timeouts.push(tid);
   }

   _clickRipple(e) {
      const ripple = document.createElement('div');
      ripple.className = 'proteus-ripple';
      const size = parseInt(this.shape_size) || 10;
      ripple.style.cssText = `
         position: fixed;
         left: ${e.clientX}px;
         top: ${e.clientY}px;
         width: ${size}px;
         height: ${size}px;
         border-radius: 50%;
         background: ${this.shape_color};
         opacity: 0.6;
         pointer-events: none;
         z-index: 9999999998;
         transform: translate(-50%, -50%) scale(1);
         transition: transform ${this.click_duration}ms ease-out, opacity ${this.click_duration}ms ease-out;
      `;
      document.body.appendChild(ripple);

      // Trigger animation on next frame so transition fires
      requestAnimationFrame(() => {
         ripple.style.transform = 'translate(-50%, -50%) scale(6)';
         ripple.style.opacity = '0';
      });

      const tid = setTimeout(() => ripple.remove(), this.click_duration);
      this.timeouts.push(tid);
   }
   //endregion


   /* -------------------------------------------------------------------------------- */
   //region 🔁 State Machine
   /* -------------------------------------------------------------------------------- */

   /**
    * Register a named cursor state. Elements with data-cursor-state="name"
    * will activate it on mouseenter and restore defaults on mouseleave.
    */
   addState(name, options = {}) {
      if (this.isTouch || this.isReducedMotion) return this;
      this.states[name] = options;
      this._bindStateElements(name);
      return this;
   }

   removeState(name) {
      if (this.isTouch || this.isReducedMotion) return this;
      delete this.states[name];
      return this;
   }

   _applyState(name) {
      const state = this.states[name];
      if (!state) return;
      if (state.shape       !== undefined && state.shape !== this.shape) this._activateShape(state.shape);
      if (state.shape_size  !== undefined) this.setShapeSize(state.shape_size, state.shape_size);
      if (state.shape_color !== undefined) this.setShapeColor(state.shape_color);
      if (state.hasShadow   !== undefined) this.setShadowEnabled(state.hasShadow);
      if (state.shadow_size !== undefined) this.setShadowSize(state.shadow_size, state.shadow_size);
      if (state.shadow_color !== undefined) this._applyShadowColor(state.shadow_color);
      if (state.text        !== undefined) this.setText(state.text);
      if (state.text_color  !== undefined) this.setTextColor(state.text_color);
      if (state.text_size   !== undefined) this.setTextSize(state.text_size);
      if (state.text_weight !== undefined) this.setTextWeight(state.text_weight);
      if (state.blend_mode  !== undefined) this.setBlendMode(state.blend_mode);
   }

   _resetState() {
      if (this.shape !== this._baseShape) this._activateShape(this._baseShape);
      this.setShapeSize(this.shape_size, this.shape_size);
      this.setShapeColor(this.shape_color);
      this.setShadowEnabled(this.hasShadow);
      this.setShadowSize(this.shadow_size, this.shadow_size);
      this._applyShadowColor(this.shadow_color);
      this.setText(this.text);
      this.setTextColor(this.text_color);
      this.setTextSize(this.text_size);
      this.setTextWeight(this.text_weight);
      this.setBlendMode(this.blend_mode);
   }

   _bindStateElements(name) {
      if (this.isDestroyed) return;
      document.querySelectorAll(`[data-cursor-state="${name}"]`).forEach(el => {
         this.addEventListenerTracked(el, 'mouseenter', () => this._applyState(name));
         this.addEventListenerTracked(el, 'mouseleave', () => this._resetState());
      });
   }

   //endregion


   /* -------------------------------------------------------------------------------- */
   //region ✨ Data Attribute
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
   //endregion


   /* -------------------------------------------------------------------------------- */
   //region 🧪 TEST MODE
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
//endregion


/* -------------------------------------------------------------------------------- */
//region 🎨 Built-in Presets
/* -------------------------------------------------------------------------------- */

/**
 * Five ready-to-use cursor presets.
 * Access them via:
 *   - `cursor.loadPreset('neon')`           — apply to a live instance
 *   - `ProteusCursor.getPreset('neon')`     — get the raw config object
 *   - `import { PRESETS } from 'proteuscursor'` — named export
 */
ProteusCursor.PRESETS = {
   /**
    * Subtle translucent circle — blends into any design without demanding attention.
    */
   ghost: {
      shape:           'circle',
      shape_size:      '12px',
      shape_color:     'rgba(255,255,255,0.55)',
      hasShadow:       true,
      shadow_size:     '44px',
      shadow_color:    'rgba(255,255,255,0.10)',
      blend_mode:      'normal',
      click_animation: 'scale',
   },

   /**
    * Vibrant teal dot with a glowing halo — great for dark, creative sites.
    */
   neon: {
      shape:           'circle',
      shape_size:      '10px',
      shape_color:     '#00D4AA',
      hasShadow:       true,
      shadow_size:     '52px',
      shadow_color:    'rgba(0,212,170,0.30)',
      blend_mode:      'normal',
      click_animation: 'ripple',
      trail_length:    8,
      trail_opacity:   0.3,
   },

   /**
    * Bare-minimum dot, no shadow, no animation — zero visual noise.
    */
   minimal: {
      shape:           'circle',
      shape_size:      '6px',
      shape_color:     '#ffffff',
      hasShadow:       false,
      blend_mode:      'normal',
      click_animation: 'none',
   },

   /**
    * Large white circle with mix-blend-mode: difference — automatically inverts
    * the colors underneath, creating perfect contrast on any background.
    */
   chrome: {
      shape:           'circle',
      shape_size:      '48px',
      shape_color:     '#ffffff',
      hasShadow:       false,
      blend_mode:      'difference',
      click_animation: 'scale',
   },

   /**
    * Fluid morphing blob — dynamic shape that stretches and squeezes with movement.
    * Best used when the cursor is initialised with shape: 'fluid'.
    */
   ink: {
      shape:           'fluid',
      shape_size:      '24px',
      shape_color:     '#e8e8e8',
      hasShadow:       true,
      shadow_size:     '60px',
      shadow_color:    'rgba(232,232,232,0.18)',
      blend_mode:      'normal',
      click_animation: 'ripple',
   },
};

//endregion


/* -------------------------------------------------------------------------------- */
//region 🔹 Helper
/* -------------------------------------------------------------------------------- */
function hexToRgba(hex, alpha = 1) {
   const r = parseInt(hex.slice(1, 3), 16);
   const g = parseInt(hex.slice(3, 5), 16);
   const b = parseInt(hex.slice(5, 7), 16);
   return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
//endregion

