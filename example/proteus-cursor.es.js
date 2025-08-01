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
class v {
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
  constructor(t = {}) {
    this.testMode = !1, this.shape = t.shape || "default", this.shape_size = t.shape_size || "10px", this.shape_color = t.shape_color || "#fff", this.hasShadow = t.hasShadow ?? !0, this.hasShadow ? (this.shadow_delay = t.shadow_delay || "0.3s", this.shadow_size = t.shadow_size || "40px", this.shadow_color = t.shadow_color || "#ffffff") : (this.shadow_delay = "0s", document.querySelector(".proteus-cursor-shadow").style.display = "none"), this.text = "", this.text_color = "", this.text_weight = "", this.text_size = "", this.isMagnetic = !1, this.eventListeners = [], this.animationIds = [], this.intervals = [], this.timeouts = [], this.isDestroyed = !1, this.boundMouseMove = this.handleMouseMove.bind(this), this.boundMouseEnter = this.handleMouseEnter.bind(this), this.boundMouseLeave = this.handleMouseLeave.bind(this), this.boundAnimateCircle = this.animateCircleShadow.bind(this), this.boundAnimateFluid = this.animateFluidCursor.bind(this), this.init(), this.dataAttributeEvents();
  }
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
    switch (document.querySelector("body").classList.remove("proteus-is-a-fluid"), document.querySelector("body").classList.remove("proteus-is-a-circle"), console.log("setShape executed"), this.shape = t, this.shape) {
      case "default":
        break;
      case "circle":
        this.setShape__circle(this.shape);
        break;
      case "fluid":
        this.setShape__fluid();
        break;
    }
    S(this.shape);
  }
  /* -------------------------------------------------------------------------------- */
  /* ! Type Shape */
  /* -------------------------------------------------------------------------------- */
  /* ! - type 1) CIRCLE */
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
  /* ! - type 2) FLUID */
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
    this.velocityInitialized || (this.setShape__fluid__animateCursor__calcVelocity(), this.velocityInitialized = !0);
    const t = 0.9;
    this.cursorX += (this.mouseX - this.cursorX) * t, this.cursorY += (this.mouseY - this.cursorY) * t;
    const s = Math.min(this.velocity / 10, 1);
    if (s > 0.01) {
      const i = this.mouseX - this.cursorX, h = this.mouseY - this.cursorY, a = Math.sqrt(i * i + h * h);
      if (a > 0) {
        const r = i / a, n = h / a, l = 1 + s * 1.5, u = 1 - s * 0.3, p = r * r * (l - 1) + 1, y = r * n * (l - 1), f = r * n * (l - 1), m = n * n * (l - 1) + 1, d = -n, c = r, _ = p + d * d * (u - 1), b = y + d * c * (u - 1), $ = f + d * c * (u - 1), w = m + c * c * (u - 1);
        this.$shape && (this.$shape.style.transform = `matrix(${_}, ${b}, ${$}, ${w}, 0, 0)`);
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
  destroy() {
    console.log("🔴 Destroying ProteusCursor instance..."), this.isDestroyed = !0, this.animationIds.forEach((e) => {
      cancelAnimationFrame(e);
    }), this.animationIds = [], this.intervals.forEach((e) => clearInterval(e)), this.timeouts.forEach((e) => clearTimeout(e)), this.intervals = [], this.timeouts = [], this.eventListeners.forEach(({ element: e, event: s, handler: i, options: h }) => {
      try {
        e.removeEventListener(s, i, h);
      } catch (a) {
        console.warn("Error removing event listener:", a);
      }
    }), this.eventListeners = [], document.body.style.cursor = "";
    const t = document.querySelector("body");
    t && (t.classList.remove("proteus-is-a-fluid"), t.classList.remove("proteus-is-a-circle")), this.$shape && (this.$shape.style.cssText = "", this.$shape.style.display = "none", this.$shape.style.opacity = "0", this.$shape.style.transform = "", this.$shape.style.left = "", this.$shape.style.top = "", this.$shape.style.width = "", this.$shape.style.height = "", this.$shape.style.backgroundColor = "", this.$shape.style.borderRadius = "", this.$shape.style.boxShadow = "", this.$shape.textContent = ""), this.$shadow && (this.$shadow.style.cssText = "", this.$shadow.style.display = "none", this.$shadow.style.opacity = "0", this.$shadow.style.transform = "", this.$shadow.style.left = "", this.$shadow.style.top = "", this.$shadow.style.width = "", this.$shadow.style.height = "", this.$shadow.style.backgroundColor = ""), this.$shape = null, this.$shadow = null, this.boundMouseMove = null, this.boundMouseEnter = null, this.boundMouseLeave = null, this.boundAnimateCircle = null, this.boundAnimateFluid = null, this.velocity = 0, this._x = 0, this._y = 0, this.mouseX = 0, this.mouseY = 0, this.cursorX = 0, this.cursorY = 0, this.prevMouseX = 0, this.prevMouseY = 0, this.velocityInitialized = !1, console.log("✅ ProteusCursor instance completely destroyed");
  }
  /* -------------------------------------------------------------------------------- */
  /* ! Setter */
  /* -------------------------------------------------------------------------------- */
  setShapeSize(t, e, s = !1) {
    console.log("setShapeSize executed"), g(this), s ? (this.shape_size = t || "20px", this.shadow_size = e || "20px", this.$shape.style.width = t || "20px", this.$shape.style.height = e || "20px") : (this.$shape.style.width = t || "20px", this.$shape.style.height = e || "20px");
  }
  setShapeColor(t, e = !1) {
    e ? (this.shape_color = t, this.$shape.style.backgroundColor = t) : this.$shape.style.backgroundColor = t;
  }
  setShadowEnabled(t, e = !1) {
    this.shape === "circle" ? e ? (this.hasShadow = t, this.hasShadow ? this.$shadow.style.display = "block" : this.$shadow.style.display = "none") : t ? this.$shadow.style.display = "block" : this.$shadow.style.display = "none" : this.shape === "fluid" && e && (this.$shape.style.boxShadow = `0 0 ${this.shadow_size} ${this.shadow_color}`);
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
  /* -------------------------------------------------------------------------------- */
  /* ! Data attribute */
  /* -------------------------------------------------------------------------------- */
  dataAttributeEvents() {
    document.querySelectorAll(
      "[data-proteus-shapeSize], [data-proteus-shapeColor], [data-proteus-text], [data-proteus-textColor], [data-proteus-textSize], [data-proteus-textWeight]"
    ).forEach((t) => {
      t.addEventListener("mouseenter", () => {
        const e = t.getAttribute("data-proteus-shapeSize"), s = t.getAttribute("data-proteus-shapeColor"), i = t.getAttribute("data-proteus-text"), h = t.getAttribute("data-proteus-textColor"), a = t.getAttribute("data-proteus-textSize"), r = t.getAttribute("data-proteus-textWeight"), n = t.getAttribute("data-proteus-shadowIsEnabled");
        e && this.setShapeSize(e, e), s && this.setShapeColor(s), i && this.setText(i), h && this.setTextColor(h), a && this.setTextSize(a), r && this.setTextWeight(r), n && this.setShadowEnabled(!0);
      }), t.addEventListener("mouseleave", () => {
        this.setShapeSize(this.shape_size, this.shape_size), this.setShapeColor(this.shape_color), this.setText(this.text), this.setTextColor(this.text_color), this.setTextSize(this.text_size), this.setTextWeight(this.text_weight);
      });
    });
  }
  /* -------------------------------------------------------------------------------- */
  /* ! Test mode */
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
function S(o) {
  console.log("This is the type: ", o);
}
function x(o, t = 1) {
  const e = parseInt(o.slice(1, 3), 16), s = parseInt(o.slice(3, 5), 16), i = parseInt(o.slice(5, 7), 16);
  return `rgba(${e}, ${s}, ${i}, ${t})`;
}
function g(o) {
  console.log(o);
}
export {
  v as default
};
