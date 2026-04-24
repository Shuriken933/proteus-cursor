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
class S {
  //region 🔹 initialization
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
  //region 🏗️ constructor
  constructor(t = {}) {
    this.testMode = !1, this.shape = t.shape || "default", this.shape_size = t.shape_size || "10px", this.shape_color = t.shape_color || "#fff", this.hasShadow = t.hasShadow ?? !0, this.shadow_delay = this.hasShadow ? t.shadow_delay || "0.3s" : "0s", this.shadow_size = t.shadow_size || "40px", this.shadow_color = t.shadow_color || "#ffffff", this.text = "", this.text_color = "", this.text_weight = "", this.text_size = "", this.speed = 0.9, this.maxVelocity = 10, this.isMagnetic = t.magnetic ?? !1, this.click_animation = t.click_animation || "scale", this.click_duration = t.click_duration ?? 300, this.states = {}, this.eventListeners = [], this.animationIds = [], this.intervals = [], this.timeouts = [], this.isDestroyed = !1, this.boundMouseMove = this.handleMouseMove.bind(this), this.boundMouseEnter = this.handleMouseEnter.bind(this), this.boundMouseLeave = this.handleMouseLeave.bind(this), this.boundAnimateCircle = this.animateCircleShadow.bind(this), this.boundAnimateFluid = this.animateFluidCursor.bind(this), this.init(), this.hasShadow || (this.$shadow.style.display = "none"), this.dataAttributeEvents(), this._initClickAnimation();
  }
  //endregion
  init() {
    this.init_HTMLcursorAndShadow(), this.$shape = document.getElementById("proteus-cursor-shape"), this.$shadow = document.getElementById("proteus-cursor-shadow"), this.$shape.style.width = this.shape_size || "20px", this.$shape.style.height = this.shape_size || "20px", this.$shadow.style.width = this.shadow_size || "40px", this.$shadow.style.height = this.shadow_size || "40px", this.setShape(this.shape);
  }
  init_HTMLcursorAndShadow() {
    if (document.getElementById("proteus-cursor-shape")) return;
    const t = document.createElement("div");
    t.className = "proteus-cursor-shape", t.id = "proteus-cursor-shape";
    const e = document.createElement("div");
    e.className = "proteus-cursor-shadow", e.id = "proteus-cursor-shadow";
    const s = document.body;
    s.prepend(t), s.prepend(e);
  }
  // Metodo helper per aggiungere event listeners tracciabili
  addEventListenerTracked(t, e, s, i = !1) {
    this.isDestroyed || (t.addEventListener(e, s, i), this.eventListeners.push({
      element: t,
      event: e,
      handler: s,
      options: i
    }));
  }
  // Metodo helper per requestAnimationFrame tracciabile
  requestAnimationFrameTracked(t) {
    if (this.isDestroyed) return;
    const e = requestAnimationFrame(t);
    return this.animationIds.push(e), e;
  }
  setShape(t) {
    switch (document.querySelector("body").classList.remove("proteus-is-a-fluid"), document.querySelector("body").classList.remove("proteus-is-a-circle"), this.shape = t, this.shape) {
      case "default":
        break;
      case "circle":
        this.setShape__circle(this.shape);
        break;
      case "fluid":
        this.setShape__fluid();
        break;
    }
  }
  //endregion
  /* -------------------------------------------------------------------------------- */
  /* ! Type Shape */
  /* -------------------------------------------------------------------------------- */
  //region 🧩 Type shape CIRCLE
  setShape__circle(t) {
    this.delay = 8, this._x = 0, this._y = 0, this.endX = window.innerWidth / 2, this.endY = window.innerHeight / 2, this.cursorVisible = !0, this.cursorEnlarged = !1, document.querySelector("body").classList.add("proteus-is-a-circle"), document.body.style.cursor = "none", this.shape__circle__interactions(), this.shape__circle__animateShadow();
  }
  shape__circle__interactions() {
    this.isDestroyed || (document.querySelectorAll("a, button, input").forEach((t) => {
      this.addEventListenerTracked(t, "mouseover", this.boundMouseEnter), this.addEventListenerTracked(t, "mouseout", this.boundMouseLeave);
    }), this.addEventListenerTracked(document, "mousemove", this.boundMouseMove));
  }
  handleMouseMove(t) {
    this.isDestroyed || (this.cursorVisible = !0, this.toggleCursorVisibility(), this.endX = t.pageX, this.endY = t.pageY, this.$shape && (this.$shape.style.top = this.endY + "px", this.$shape.style.left = this.endX + "px"));
  }
  handleMouseEnter() {
    this.isDestroyed || (this.cursorEnlarged = !0, this.toggleCursorSize());
  }
  handleMouseLeave() {
    this.isDestroyed || (this.cursorEnlarged = !1, this.toggleCursorSize());
  }
  // Modifica il metodo di animazione del circle shadow
  animateCircleShadow() {
    this.isDestroyed || (this._x += (this.endX - this._x) / this.delay, this._y += (this.endY - this._y) / this.delay, this.$shadow && (this.$shadow.style.top = this._y + "px", this.$shadow.style.left = this._x + "px"), this.requestAnimationFrameTracked(this.boundAnimateCircle));
  }
  shape__circle__animateShadow() {
    this.animateCircleShadow();
  }
  toggleCursorSize() {
    this.cursorEnlarged ? (this.$shape.style.transform = "translate(-50%, -50%) scale(1.5)", this.$shadow.style.transform = "translate(-50%, -50%) scale(1.5)") : (this.$shape.style.transform = "translate(-50%, -50%) scale(1)", this.$shadow.style.transform = "translate(-50%, -50%) scale(1)");
  }
  toggleCursorVisibility() {
    this.cursorVisible ? (this.$shape.style.opacity = 1, this.$shadow.style.opacity = 1) : (this.$shape.style.opacity = 0, this.$shadow.style.opacity = 0);
  }
  //endregion
  //region 🧩 Type shape FLUID
  setShape__fluid__animateCursor__calcVelocity() {
    const t = (e) => {
      if (this.isDestroyed) return;
      const s = e.clientX - this.prevMouseX, i = e.clientY - this.prevMouseY;
      this.velocity = Math.sqrt(s * s + i * i), this.prevMouseX = this.mouseX, this.prevMouseY = this.mouseY, this.mouseX = e.clientX, this.mouseY = e.clientY;
    };
    this.addEventListenerTracked(document, "mousemove", t);
  }
  setShape__fluid__animateCursor() {
    if (this.isDestroyed) return;
    this.velocityInitialized || (this.setShape__fluid__animateCursor__calcVelocity(), this.velocityInitialized = !0), this.cursorX += (this.mouseX - this.cursorX) * this.speed, this.cursorY += (this.mouseY - this.cursorY) * this.speed;
    const t = Math.min(this.velocity / this.maxVelocity, 1);
    if (t > 0.01) {
      const e = this.mouseX - this.cursorX, s = this.mouseY - this.cursorY, i = Math.sqrt(e * e + s * s);
      if (i > 0) {
        const o = e / i, h = s / i, a = 1 + t * 1.5, r = 1 - t * 0.3, c = o * o * (a - 1) + 1, u = o * h * (a - 1), p = o * h * (a - 1), y = h * h * (a - 1) + 1, l = -h, d = o, f = c + l * l * (r - 1), m = u + l * d * (r - 1), _ = p + l * d * (r - 1), b = y + d * d * (r - 1);
        this.$shape && (this.$shape.style.transform = `matrix(${f}, ${m}, ${_}, ${b}, 0, 0)`);
      } else this.$shape && (this.$shape.style.transform = "matrix(1, 0, 0, 1, 0, 0)");
    } else this.$shape && (this.$shape.style.transform = "matrix(1, 0, 0, 1, 0, 0)");
    this.$shape && (this.$shape.style.left = this.cursorX - this.$shape.offsetWidth / 2 + "px", this.$shape.style.top = this.cursorY - this.$shape.offsetHeight / 2 + "px"), this.velocity *= 0.95, this.requestAnimationFrameTracked(this.boundAnimateFluid);
  }
  animateFluidCursor() {
    this.setShape__fluid__animateCursor();
  }
  setShape__fluid() {
    if (document.querySelector("body").classList.add("proteus-is-a-fluid"), document.body.style.cursor = "none", !this.$shape) {
      console.error("Elemento con id 'cursor' non trovato!");
      return;
    }
    this.$shape.style.position = "fixed", this.$shape.style.width = this.shape_size || "20px", this.$shape.style.height = this.shape_size || "20px", this.$shape.style.backgroundColor = this.shape_color || "#fff", this.$shape.style.borderRadius = "50%", this.$shape.style.pointerEvents = "none", this.$shape.style.zIndex = "9999", this.$shape.style.transition = "all 0.3s cubic-bezier(0.23, 1, 0.320, 1)", this.hasShadow && (this.$shape.style.boxShadow = `0 0 ${this.shadow_size} ${this.shadow_color}`), this.velocityInitialized = !1, this.cursorX = window.innerWidth / 2, this.cursorY = window.innerHeight / 2, this.setShape__fluid__animateCursor();
  }
  //endregion
  //region ❌ destroy Proteus
  destroy() {
    this.isDestroyed = !0, this.animationIds.forEach((e) => {
      cancelAnimationFrame(e);
    }), this.animationIds = [], this.intervals.forEach((e) => clearInterval(e)), this.timeouts.forEach((e) => clearTimeout(e)), this.intervals = [], this.timeouts = [], this.eventListeners.forEach(({ element: e, event: s, handler: i, options: o }) => {
      try {
        e.removeEventListener(s, i, o);
      } catch (h) {
        console.warn("Error removing event listener:", h);
      }
    }), this.eventListeners = [], document.body.style.cursor = "";
    const t = document.querySelector("body");
    t && (t.classList.remove("proteus-is-a-fluid"), t.classList.remove("proteus-is-a-circle")), this.$shape && (this.$shape.style.cssText = "", this.$shape.style.display = "none", this.$shape.style.opacity = "0", this.$shape.style.transform = "", this.$shape.style.left = "", this.$shape.style.top = "", this.$shape.style.width = "", this.$shape.style.height = "", this.$shape.style.backgroundColor = "", this.$shape.style.borderRadius = "", this.$shape.style.boxShadow = "", this.$shape.textContent = ""), this.$shadow && (this.$shadow.style.cssText = "", this.$shadow.style.display = "none", this.$shadow.style.opacity = "0", this.$shadow.style.transform = "", this.$shadow.style.left = "", this.$shadow.style.top = "", this.$shadow.style.width = "", this.$shadow.style.height = "", this.$shadow.style.backgroundColor = ""), this.$shape = null, this.$shadow = null, this.boundMouseMove = null, this.boundMouseEnter = null, this.boundMouseLeave = null, this.boundAnimateCircle = null, this.boundAnimateFluid = null, this.velocity = 0, this._x = 0, this._y = 0, this.mouseX = 0, this.mouseY = 0, this.cursorX = 0, this.cursorY = 0, this.prevMouseX = 0, this.prevMouseY = 0, this.velocityInitialized = !1;
  }
  //endregion
  /* -------------------------------------------------------------------------------- */
  //region 🏷️ Setters
  /* -------------------------------------------------------------------------------- */
  setShapeSize(t, e, s = !1) {
    s ? (this.shape_size = t || "20px", this.shadow_size = e || "20px", this.$shape.style.width = t || "20px", this.$shape.style.height = e || "20px") : (this.$shape.style.width = t || "20px", this.$shape.style.height = e || "20px");
  }
  setShapeColor(t, e = !1) {
    e ? (this.shape_color = t, this.$shape.style.backgroundColor = t) : this.$shape.style.backgroundColor = t;
  }
  setShadowEnabled(t, e = !1) {
    if (this.shape === "circle")
      e ? (this.hasShadow = t, this.hasShadow ? this.$shadow.style.display = "block" : this.$shadow.style.display = "none") : t ? this.$shadow.style.display = "block" : this.$shadow.style.display = "none";
    else if (this.shape === "fluid") {
      const s = t ? `0 0 ${this.shadow_size} ${this.shadow_color}` : "none";
      e && (this.hasShadow = t), this.$shape.style.boxShadow = s;
    }
  }
  setShadowSize(t, e) {
    this.$shadow.style.width = t || "20px", this.$shadow.style.height = e || "20px";
  }
  setShadowColor(t, e = 0.5) {
    const s = x(t, e);
    this.$shadow.style.backgroundColor = s;
  }
  setText(t, e = !1) {
    e ? (this.text = t, document.querySelector(".proteus-cursor-shape").textContent = this.text) : document.querySelector(".proteus-cursor-shape").textContent = t;
  }
  setTextColor(t, e = !1) {
    e && (this.text_color = t), document.querySelector(".proteus-cursor-shape").style.color = t;
  }
  setTextWeight(t, e = !1) {
    e && (this.text_weight = t), document.querySelector(".proteus-cursor-shape").style.fontWeight = t;
  }
  setTextSize(t, e = !1) {
    e && (this.text_size = t), document.querySelector(".proteus-cursor-shape").style.fontSize = t;
  }
  setSpeed(t) {
    this.speed = t;
  }
  setMaxVelocity(t) {
    this.maxVelocity = t;
  }
  //endregion
  /* -------------------------------------------------------------------------------- */
  //region 🖱️ Click Animation
  /* -------------------------------------------------------------------------------- */
  _initClickAnimation() {
    if (this.click_animation === "none") return;
    const t = (e) => {
      this.isDestroyed || (this.click_animation === "scale" && this._clickScale(), this.click_animation === "ripple" && this._clickRipple(e));
    };
    this.addEventListenerTracked(document, "mousedown", t);
  }
  _clickScale() {
    if (!this.$shape) return;
    const t = this.click_duration;
    this.$shape.style.transition = `transform ${t / 2}ms cubic-bezier(.215,.61,.355,1)`, this.$shape.style.transform = "translate(-50%, -50%) scale(0.6)";
    const e = setTimeout(() => {
      this.isDestroyed || !this.$shape || (this.$shape.style.transform = "translate(-50%, -50%) scale(1)");
    }, t / 2);
    this.timeouts.push(e);
  }
  _clickRipple(t) {
    const e = document.createElement("div");
    e.className = "proteus-ripple";
    const s = parseInt(this.shape_size) || 10;
    e.style.cssText = `
         position: fixed;
         left: ${t.clientX}px;
         top: ${t.clientY}px;
         width: ${s}px;
         height: ${s}px;
         border-radius: 50%;
         background: ${this.shape_color};
         opacity: 0.6;
         pointer-events: none;
         z-index: 9999999998;
         transform: translate(-50%, -50%) scale(1);
         transition: transform ${this.click_duration}ms ease-out, opacity ${this.click_duration}ms ease-out;
      `, document.body.appendChild(e), requestAnimationFrame(() => {
      e.style.transform = "translate(-50%, -50%) scale(6)", e.style.opacity = "0";
    });
    const i = setTimeout(() => e.remove(), this.click_duration);
    this.timeouts.push(i);
  }
  //endregion
  /* -------------------------------------------------------------------------------- */
  //region 🔁 State Machine
  /* -------------------------------------------------------------------------------- */
  /**
   * Register a named cursor state. Elements with data-cursor-state="name"
   * will activate it on mouseenter and restore defaults on mouseleave.
   */
  addState(t, e = {}) {
    return this.states[t] = e, this._bindStateElements(t), this;
  }
  removeState(t) {
    return delete this.states[t], this;
  }
  _applyState(t) {
    const e = this.states[t];
    e && (e.shape_size !== void 0 && this.setShapeSize(e.shape_size, e.shape_size), e.shape_color !== void 0 && this.setShapeColor(e.shape_color), e.hasShadow !== void 0 && this.setShadowEnabled(e.hasShadow), e.shadow_size !== void 0 && this.setShadowSize(e.shadow_size, e.shadow_size), e.text !== void 0 && this.setText(e.text), e.text_color !== void 0 && this.setTextColor(e.text_color), e.text_size !== void 0 && this.setTextSize(e.text_size), e.text_weight !== void 0 && this.setTextWeight(e.text_weight));
  }
  _resetState() {
    this.setShapeSize(this.shape_size, this.shape_size), this.setShapeColor(this.shape_color), this.setShadowEnabled(this.hasShadow), this.setText(this.text), this.setTextColor(this.text_color), this.setTextSize(this.text_size), this.setTextWeight(this.text_weight);
  }
  _bindStateElements(t) {
    this.isDestroyed || document.querySelectorAll(`[data-cursor-state="${t}"]`).forEach((e) => {
      this.addEventListenerTracked(e, "mouseenter", () => this._applyState(t)), this.addEventListenerTracked(e, "mouseleave", () => this._resetState());
    });
  }
  //endregion
  /* -------------------------------------------------------------------------------- */
  //region ✨ Data Attribute
  /* -------------------------------------------------------------------------------- */
  dataAttributeEvents() {
    document.querySelectorAll(
      "[data-proteus-shapeSize], [data-proteus-shapeColor], [data-proteus-text], [data-proteus-textColor], [data-proteus-textSize], [data-proteus-textWeight]"
    ).forEach((t) => {
      t.addEventListener("mouseenter", () => {
        const e = t.getAttribute("data-proteus-shapeSize"), s = t.getAttribute("data-proteus-shapeColor"), i = t.getAttribute("data-proteus-text"), o = t.getAttribute("data-proteus-textColor"), h = t.getAttribute("data-proteus-textSize"), a = t.getAttribute("data-proteus-textWeight"), r = t.getAttribute("data-proteus-shadowIsEnabled");
        e && this.setShapeSize(e, e), s && this.setShapeColor(s), i && this.setText(i), o && this.setTextColor(o), h && this.setTextSize(h), a && this.setTextWeight(a), r && this.setShadowEnabled(!0);
      }), t.addEventListener("mouseleave", () => {
        this.setShapeSize(this.shape_size, this.shape_size), this.setShapeColor(this.shape_color), this.setText(this.text), this.setTextColor(this.text_color), this.setTextSize(this.text_size), this.setTextWeight(this.text_weight);
      });
    });
  }
  //endregion
  /* -------------------------------------------------------------------------------- */
  //region 🧪 TEST MODE
  /* -------------------------------------------------------------------------------- */
  enableTestMode() {
    this.testMode = !0, this.enableTestMode__generateHTML();
    const t = document.querySelector("#proteus-panel-test"), e = document.querySelector("#proteus-button-test");
    e.addEventListener("click", () => {
      t.classList.toggle("open");
    }), document.querySelector("#button-setShape-dot"), document.querySelector("#button-setShape-circle"), e.classList.add("active");
  }
  enableTestMode__generateHTML() {
    const t = document.querySelector("body");
    t.insertAdjacentHTML("beforeend", `
         <button id="proteus-button-test">
            <img src="icons/icon-cursor.svg" alt="icon" width="35" height="35" />
         </button>
      `), t.insertAdjacentHTML("beforeend", `
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
      `);
  }
  disableTestMode() {
    this.testMode = !1, document.querySelector("#proteus-button-test").classList.remove("active");
  }
}
function x(n, t = 1) {
  const e = parseInt(n.slice(1, 3), 16), s = parseInt(n.slice(3, 5), 16), i = parseInt(n.slice(5, 7), 16);
  return `rgba(${e}, ${s}, ${i}, ${t})`;
}
export {
  S as default
};
