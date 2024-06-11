/*! ProteusCursor.js - v0.0.1
* A lightweight javascript library to create some amazing effects for the mouse (cursor) on your website
* https://github.com/
* Copyright (c) 2023 Eros A. under MIT license; */



/*
* All possible parameters & values
*

   type                   -> [string] {'default', 'dot'}
   type_size             -> [string] {string + 'px'}                   -> eg '#ffffff'
   type_color            -> [string] {'#' + hexadecimal}               -> eg #ffffff

   background_color     -> [string]    {'#' + hexadecimal}             -> eg #ffffff
   background_opacity   -> [float] {0..1}                               -> eg 0.5

   hasShadow             -> [boolean]   {true/false}
   shadow_delay          -> [float]     {'integer' + 's'}              -> e.g. '0.5s'
   shadow_size           -> [string]    {integer + 'px'}               -> e.g. 20px
   shadow_color          -> [string]    {'#' + hexadecimal}            -> e.g. #ffffff

   text                   -> [string]
   text_color            -> [string] {'#' + hexadecimal}               -> e.g. #ffffff

   isMagnetic            -> [boolean] {true/false}

*
* */


export default class ProteusCursor{

   constructor(){
      this.shape = 'default'
      this.shape_size = ''
      this.shape_color = ''

      this.background_color = '#ffffff'
      this.background_opacity = 0.5

      this.hasShadow = true
      this.shadow_delay = '0.3s'
      this.shadow_size = '20px'
      this.shadow_color = '#ffffff'

      this.text = ''
      this.text_color = ''

      this.isMagnetic = false

   }

   setShape(shape){
      this.shape = shape
      if (this.shape !== 'default'){
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
      }
   }

   init() {
      switch (this.shape) {
         case 'default':
            this.$shape.style.display = 'none';
            break;
         case 'dot':
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
