/*! Proteus Cursor v2.0.0 | https://github.com/Shuriken933/proteus-cursor | MIT */
//#region src/proteus-cursor.js
var e = class e {
	velocity = 0;
	smoothDirX = 0;
	smoothDirY = 0;
	_x = 0;
	_y = 0;
	mouseX = 0;
	mouseY = 0;
	cursorX = 0;
	cursorY = 0;
	_baseShape = "default";
	constructor(t = {}) {
		this.testMode = !1, this.shape = t.shape || "default", this._baseShape = this.shape, this.shape_size = t.shape_size || "10px", this.shape_color = t.shape_color || "#fff", this.hasShadow = t.hasShadow ?? !0, this.shadow_delay = this.hasShadow ? t.shadow_delay || "0.3s" : "0s", this.shadow_size = t.shadow_size || "40px", this.shadow_color = t.shadow_color || "#ffffff", this.text = "", this.text_color = "", this.text_weight = "", this.text_size = "", this.speed = .9, this.maxVelocity = 10, this.isMagnetic = t.magnetic ?? !1, this.blend_mode = t.blend_mode || "normal", this.click_animation = t.click_animation || "scale", this.click_duration = t.click_duration ?? 300, this.states = {}, this.eventListeners = [], this.animationIds = [], this.intervals = [], this.timeouts = [], this.isDestroyed = !1, this.isTouch = e.isTouchOnly(), !this.isTouch && (this.respectReducedMotion = t.respectReducedMotion ?? !0, this.isReducedMotion = this.respectReducedMotion && e.prefersReducedMotion(), !this.isReducedMotion && (this.boundMouseMove = this.handleMouseMove.bind(this), this.boundMouseEnter = this.handleMouseEnter.bind(this), this.boundMouseLeave = this.handleMouseLeave.bind(this), this.boundAnimateCircle = this.animateCircleShadow.bind(this), this.boundAnimateFluid = this.animateFluidCursor.bind(this), this.init(), this.hasShadow || (this.$shadow.style.display = "none"), this.dataAttributeEvents(), this._initClickAnimation()));
	}
	static isTouchOnly() {
		return typeof window > "u" ? !1 : window.matchMedia("(pointer: coarse)").matches;
	}
	static prefersReducedMotion() {
		return typeof window > "u" ? !1 : window.matchMedia("(prefers-reduced-motion: reduce)").matches;
	}
	_isActive() {
		return !this.isDestroyed && !this.isTouch && !this.isReducedMotion;
	}
	init() {
		this.init_HTMLcursorAndShadow(), this.$shape = document.getElementById("proteus-cursor-shape"), this.$shadow = document.getElementById("proteus-cursor-shadow"), this.$shape.style.width = this.shape_size || "20px", this.$shape.style.height = this.shape_size || "20px", this.$shadow.style.width = this.shadow_size || "40px", this.$shadow.style.height = this.shadow_size || "40px", this.setShape(this.shape), this.blend_mode && this.blend_mode !== "normal" && (this.$shape.style.mixBlendMode = this.blend_mode);
	}
	init_HTMLcursorAndShadow() {
		if (document.getElementById("proteus-cursor-shape")) return;
		let e = document.createElement("div");
		e.className = "proteus-cursor-shape", e.id = "proteus-cursor-shape";
		let t = document.createElement("div");
		t.className = "proteus-cursor-shadow", t.id = "proteus-cursor-shadow";
		let n = document.body;
		n.prepend(e), n.prepend(t);
	}
	addEventListenerTracked(e, t, n, r = !1) {
		this.isDestroyed || (e.addEventListener(t, n, r), this.eventListeners.push({
			element: e,
			event: t,
			handler: n,
			options: r
		}));
	}
	requestAnimationFrameTracked(e) {
		if (this.isDestroyed) return;
		let t = requestAnimationFrame(e);
		return this.animationIds.push(t), t;
	}
	setShape(e) {
		this._isActive() && (this._baseShape = e, this._activateShape(e));
	}
	_activateShape(e) {
		if (this._isActive()) switch (document.querySelector("body").classList.remove("proteus-is-a-fluid"), document.querySelector("body").classList.remove("proteus-is-a-circle"), this.shape = e, this.shape) {
			case "default": break;
			case "circle":
				this.setShape__circle(this.shape);
				break;
			case "fluid":
				this.setShape__fluid();
				break;
		}
	}
	setShape__circle(e) {
		this.animationIds.forEach((e) => cancelAnimationFrame(e)), this.animationIds = [], this.delay = 8, this._x = 0, this._y = 0, this.endX = this.mouseX > 0 ? this.mouseX : window.innerWidth / 2, this.endY = this.mouseY > 0 ? this.mouseY : window.innerHeight / 2, this._x = this.endX, this._y = this.endY, this.cursorVisible = !0, this.cursorEnlarged = !1, document.querySelector("body").classList.add("proteus-is-a-circle"), document.body.style.cursor = "none", this.$shadow && (this.$shadow.style.display = this.hasShadow ? "" : "none", this.$shadow.style.transform = "translate(-50%, -50%) scale(1)"), this.$shape && (this.$shape.style.transform = "translate(-50%, -50%) scale(1)", this.$shape.style.transition = ""), this.shape__circle__interactions(), this.shape__circle__animateShadow();
	}
	shape__circle__interactions() {
		this.isDestroyed || (document.querySelectorAll("a, button, input").forEach((e) => {
			this.addEventListenerTracked(e, "mouseover", this.boundMouseEnter), this.addEventListenerTracked(e, "mouseout", this.boundMouseLeave);
		}), this.addEventListenerTracked(document, "mousemove", this.boundMouseMove));
	}
	handleMouseMove(e) {
		this.isDestroyed || (this.cursorVisible = !0, this.toggleCursorVisibility(), this.endX = e.pageX, this.endY = e.pageY, this.$shape && (this.$shape.style.top = this.endY + "px", this.$shape.style.left = this.endX + "px"));
	}
	handleMouseEnter() {
		this.isDestroyed || (this.cursorEnlarged = !0, this.toggleCursorSize());
	}
	handleMouseLeave() {
		this.isDestroyed || (this.cursorEnlarged = !1, this.toggleCursorSize());
	}
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
	setShape__fluid__animateCursor__calcVelocity() {
		this.addEventListenerTracked(document, "mousemove", (e) => {
			if (this.isDestroyed) return;
			let t = e.clientX - this.mouseX, n = e.clientY - this.mouseY, r = .25;
			this.smoothDirX = this.smoothDirX * (1 - r) + t * r, this.smoothDirY = this.smoothDirY * (1 - r) + n * r, this.mouseX = e.clientX, this.mouseY = e.clientY, this.endX = e.clientX + (window.scrollX || 0), this.endY = e.clientY + (window.scrollY || 0);
		});
	}
	setShape__fluid__animateCursor() {
		if (this.isDestroyed) return;
		this.velocityInitialized ||= (this.setShape__fluid__animateCursor__calcVelocity(), !0), this.cursorX += (this.mouseX - this.cursorX) * this.speed, this.cursorY += (this.mouseY - this.cursorY) * this.speed;
		let e = .88;
		this.smoothDirX *= e, this.smoothDirY *= e;
		let t = Math.sqrt(this.smoothDirX * this.smoothDirX + this.smoothDirY * this.smoothDirY), n = Math.min(t / this.maxVelocity, 1);
		if (n > .015 && t > .05) {
			let e = this.smoothDirX / t, r = this.smoothDirY / t, i = 1 + n * 1.5, a = 1 - n * .3, o = e * e * (i - 1) + 1, s = e * r * (i - 1), c = e * r * (i - 1), l = r * r * (i - 1) + 1, u = -r, d = e, f = o + u * u * (a - 1), p = s + u * d * (a - 1), m = c + u * d * (a - 1), h = l + d * d * (a - 1);
			this.$shape && (this.$shape.style.transform = `matrix(${f}, ${p}, ${m}, ${h}, 0, 0)`);
		} else this.$shape && (this.$shape.style.transform = "matrix(1, 0, 0, 1, 0, 0)");
		this.$shape && (this.$shape.style.left = this.cursorX - this.$shape.offsetWidth / 2 + "px", this.$shape.style.top = this.cursorY - this.$shape.offsetHeight / 2 + "px"), this.requestAnimationFrameTracked(this.boundAnimateFluid);
	}
	animateFluidCursor() {
		this.setShape__fluid__animateCursor();
	}
	setShape__fluid() {
		if (this.animationIds.forEach((e) => cancelAnimationFrame(e)), this.animationIds = [], document.querySelector("body").classList.add("proteus-is-a-fluid"), document.body.style.cursor = "none", !this.$shape) {
			console.error("Elemento con id 'cursor' non trovato!");
			return;
		}
		this.$shape.style.position = "fixed", this.$shape.style.width = this.shape_size || "20px", this.$shape.style.height = this.shape_size || "20px", this.$shape.style.backgroundColor = this.shape_color || "#fff", this.$shape.style.borderRadius = "50%", this.$shape.style.pointerEvents = "none", this.$shape.style.zIndex = "9999", this.$shape.style.transition = "none", this.$shape.style.transform = "none", this.$shadow && (this.$shadow.style.display = "none"), this.hasShadow ? this.$shape.style.boxShadow = `0 0 ${this.shadow_size} ${this.shadow_color}` : this.$shape.style.boxShadow = "none";
		let e = window.scrollX || 0, t = window.scrollY || 0;
		this.velocityInitialized = !1, this.smoothDirX = 0, this.smoothDirY = 0, this.cursorX = this.endX > 0 ? this.endX - e : this.mouseX || window.innerWidth / 2, this.cursorY = this.endY > 0 ? this.endY - t : this.mouseY || window.innerHeight / 2;
		let n = parseInt(this.shape_size) / 2 || 5;
		this.$shape.style.left = this.cursorX - n + "px", this.$shape.style.top = this.cursorY - n + "px", this.setShape__fluid__animateCursor();
	}
	destroy() {
		if (this.isTouch || this.isReducedMotion) return;
		this.isDestroyed = !0, this.animationIds.forEach((e) => {
			cancelAnimationFrame(e);
		}), this.animationIds = [], this.intervals.forEach((e) => clearInterval(e)), this.timeouts.forEach((e) => clearTimeout(e)), this.intervals = [], this.timeouts = [], this.eventListeners.forEach(({ element: e, event: t, handler: n, options: r }) => {
			try {
				e.removeEventListener(t, n, r);
			} catch (e) {
				console.warn("Error removing event listener:", e);
			}
		}), this.eventListeners = [], document.body.style.cursor = "";
		let e = document.querySelector("body");
		e && (e.classList.remove("proteus-is-a-fluid"), e.classList.remove("proteus-is-a-circle")), this.$shape && (this.$shape.style.cssText = "", this.$shape.style.display = "none", this.$shape.style.opacity = "0", this.$shape.style.transform = "", this.$shape.style.left = "", this.$shape.style.top = "", this.$shape.style.width = "", this.$shape.style.height = "", this.$shape.style.backgroundColor = "", this.$shape.style.borderRadius = "", this.$shape.style.boxShadow = "", this.$shape.textContent = ""), this.$shadow && (this.$shadow.style.cssText = "", this.$shadow.style.display = "none", this.$shadow.style.opacity = "0", this.$shadow.style.transform = "", this.$shadow.style.left = "", this.$shadow.style.top = "", this.$shadow.style.width = "", this.$shadow.style.height = "", this.$shadow.style.backgroundColor = ""), this.$shape = null, this.$shadow = null, this.boundMouseMove = null, this.boundMouseEnter = null, this.boundMouseLeave = null, this.boundAnimateCircle = null, this.boundAnimateFluid = null, this.velocity = 0, this.smoothDirX = 0, this.smoothDirY = 0, this._x = 0, this._y = 0, this.mouseX = 0, this.mouseY = 0, this.cursorX = 0, this.cursorY = 0, this.velocityInitialized = !1;
	}
	setShapeSize(e, t, n = !1) {
		this._isActive() && (n ? (this.shape_size = e || "20px", this.shadow_size = t || "20px", this.$shape.style.width = e || "20px", this.$shape.style.height = t || "20px") : (this.$shape.style.width = e || "20px", this.$shape.style.height = t || "20px"));
	}
	setShapeColor(e, t = !1) {
		this._isActive() && (t && (this.shape_color = e), this.$shape.style.backgroundColor = e);
	}
	setShadowEnabled(e, t = !1) {
		if (this._isActive()) {
			if (this.shape === "circle") t ? (this.hasShadow = e, this.hasShadow ? this.$shadow.style.display = "block" : this.$shadow.style.display = "none") : e ? this.$shadow.style.display = "block" : this.$shadow.style.display = "none";
			else if (this.shape === "fluid") {
				let n = e ? `0 0 ${this.shadow_size} ${this.shadow_color}` : "none";
				t && (this.hasShadow = e), this.$shape.style.boxShadow = n;
			}
		}
	}
	setShadowSize(e, t) {
		this._isActive() && (this.$shadow.style.width = e || "20px", this.$shadow.style.height = t || "20px");
	}
	setShadowColor(e, n = .5) {
		if (!this._isActive()) return;
		let r = t(e, n);
		this.$shadow.style.backgroundColor = r;
	}
	setText(e, t = !1) {
		this._isActive() && (t ? (this.text = e, document.querySelector(".proteus-cursor-shape").textContent = this.text) : document.querySelector(".proteus-cursor-shape").textContent = e);
	}
	setTextColor(e, t = !1) {
		this._isActive() && (t && (this.text_color = e), document.querySelector(".proteus-cursor-shape").style.color = e);
	}
	setTextWeight(e, t = !1) {
		this._isActive() && (t && (this.text_weight = e), document.querySelector(".proteus-cursor-shape").style.fontWeight = e);
	}
	setTextSize(e, t = !1) {
		this._isActive() && (t && (this.text_size = e), document.querySelector(".proteus-cursor-shape").style.fontSize = e);
	}
	setSpeed(e) {
		this.speed = e;
	}
	setMaxVelocity(e) {
		this.maxVelocity = e;
	}
	setBlendMode(e, t = !1) {
		this._isActive() && (t && (this.blend_mode = e), this.$shape.style.mixBlendMode = e);
	}
	_applyShadowColor(e) {
		this._isActive() && (this.shadow_color = e, this.shape === "circle" ? this.$shadow.style.backgroundColor = e : this.shape === "fluid" && this.hasShadow && (this.$shape.style.boxShadow = `0 0 ${this.shadow_size} ${e}`));
	}
	loadPreset(t, n = {}) {
		if (!this._isActive()) return this;
		let r = e.PRESETS[t];
		if (!r) return console.warn(`[ProteusCursor] Unknown preset: "${t}". Available: ${Object.keys(e.PRESETS).join(", ")}`), this;
		let i = {
			...r,
			...n
		};
		return i.shape !== void 0 && i.shape !== this.shape && this.setShape(i.shape), i.shape_size !== void 0 && this.setShapeSize(i.shape_size, i.shape_size, !0), i.shape_color !== void 0 && this.setShapeColor(i.shape_color, !0), i.hasShadow !== void 0 && this.setShadowEnabled(i.hasShadow, !0), i.shadow_size !== void 0 && this.setShadowSize(i.shadow_size, i.shadow_size), i.shadow_color !== void 0 && this._applyShadowColor(i.shadow_color), i.blend_mode !== void 0 && this.setBlendMode(i.blend_mode, !0), i.click_animation !== void 0 && (this.click_animation = i.click_animation), this;
	}
	static getPreset(t) {
		return e.PRESETS[t];
	}
	_initClickAnimation() {
		this.click_animation !== "none" && this.addEventListenerTracked(document, "mousedown", (e) => {
			this.isDestroyed || (this.click_animation === "scale" && this._clickScale(), this.click_animation === "ripple" && this._clickRipple(e));
		});
	}
	_clickScale() {
		if (!this.$shape) return;
		let e = this.click_duration;
		if (this.shape === "fluid") {
			this.$shape.style.opacity = "0.35";
			let t = setTimeout(() => {
				!this.isDestroyed && this.$shape && (this.$shape.style.opacity = "1");
			}, e / 3);
			this.timeouts.push(t);
			return;
		}
		this.$shape.style.transition = `transform ${e / 2}ms cubic-bezier(.215,.61,.355,1)`, this.$shape.style.transform = "translate(-50%, -50%) scale(0.6)";
		let t = setTimeout(() => {
			this.isDestroyed || !this.$shape || (this.$shape.style.transform = "translate(-50%, -50%) scale(1)");
		}, e / 2);
		this.timeouts.push(t);
	}
	_clickRipple(e) {
		let t = document.createElement("div");
		t.className = "proteus-ripple";
		let n = parseInt(this.shape_size) || 10;
		t.style.cssText = `
         position: fixed;
         left: ${e.clientX}px;
         top: ${e.clientY}px;
         width: ${n}px;
         height: ${n}px;
         border-radius: 50%;
         background: ${this.shape_color};
         opacity: 0.6;
         pointer-events: none;
         z-index: 9999999998;
         transform: translate(-50%, -50%) scale(1);
         transition: transform ${this.click_duration}ms ease-out, opacity ${this.click_duration}ms ease-out;
      `, document.body.appendChild(t), requestAnimationFrame(() => {
			t.style.transform = "translate(-50%, -50%) scale(6)", t.style.opacity = "0";
		});
		let r = setTimeout(() => t.remove(), this.click_duration);
		this.timeouts.push(r);
	}
	addState(e, t = {}) {
		return this.isTouch || this.isReducedMotion ? this : (this.states[e] = t, this._bindStateElements(e), this);
	}
	removeState(e) {
		return this.isTouch || this.isReducedMotion || delete this.states[e], this;
	}
	_applyState(e) {
		let t = this.states[e];
		t && (t.shape !== void 0 && t.shape !== this.shape && this._activateShape(t.shape), t.shape_size !== void 0 && this.setShapeSize(t.shape_size, t.shape_size), t.shape_color !== void 0 && this.setShapeColor(t.shape_color), t.hasShadow !== void 0 && this.setShadowEnabled(t.hasShadow), t.shadow_size !== void 0 && this.setShadowSize(t.shadow_size, t.shadow_size), t.text !== void 0 && this.setText(t.text), t.text_color !== void 0 && this.setTextColor(t.text_color), t.text_size !== void 0 && this.setTextSize(t.text_size), t.text_weight !== void 0 && this.setTextWeight(t.text_weight), t.blend_mode !== void 0 && this.setBlendMode(t.blend_mode));
	}
	_resetState() {
		this.shape !== this._baseShape && this._activateShape(this._baseShape), this.setShapeSize(this.shape_size, this.shape_size), this.setShapeColor(this.shape_color), this.setShadowEnabled(this.hasShadow), this.setText(this.text), this.setTextColor(this.text_color), this.setTextSize(this.text_size), this.setTextWeight(this.text_weight), this.setBlendMode(this.blend_mode);
	}
	_bindStateElements(e) {
		this.isDestroyed || document.querySelectorAll(`[data-cursor-state="${e}"]`).forEach((t) => {
			this.addEventListenerTracked(t, "mouseenter", () => this._applyState(e)), this.addEventListenerTracked(t, "mouseleave", () => this._resetState());
		});
	}
	dataAttributeEvents() {
		document.querySelectorAll("[data-proteus-shapeSize], [data-proteus-shapeColor], [data-proteus-text], [data-proteus-textColor], [data-proteus-textSize], [data-proteus-textWeight]").forEach((e) => {
			e.addEventListener("mouseenter", () => {
				let t = e.getAttribute("data-proteus-shapeSize"), n = e.getAttribute("data-proteus-shapeColor"), r = e.getAttribute("data-proteus-text"), i = e.getAttribute("data-proteus-textColor"), a = e.getAttribute("data-proteus-textSize"), o = e.getAttribute("data-proteus-textWeight"), s = e.getAttribute("data-proteus-shadowIsEnabled");
				t && this.setShapeSize(t, t), n && this.setShapeColor(n), r && this.setText(r), i && this.setTextColor(i), a && this.setTextSize(a), o && this.setTextWeight(o), s && this.setShadowEnabled(!0);
			}), e.addEventListener("mouseleave", () => {
				this.setShapeSize(this.shape_size, this.shape_size), this.setShapeColor(this.shape_color), this.setText(this.text), this.setTextColor(this.text_color), this.setTextSize(this.text_size), this.setTextWeight(this.text_weight);
			});
		});
	}
	enableTestMode() {
		this.testMode = !0, this.enableTestMode__generateHTML();
		let e = document.querySelector("#proteus-panel-test"), t = document.querySelector("#proteus-button-test");
		t.addEventListener("click", () => {
			e.classList.toggle("open");
		}), document.querySelector("#button-setShape-dot"), document.querySelector("#button-setShape-circle"), t.classList.add("active");
	}
	enableTestMode__generateHTML() {
		let e = document.querySelector("body");
		e.insertAdjacentHTML("beforeend", "\n         <button id=\"proteus-button-test\">\n            <img src=\"icons/icon-cursor.svg\" alt=\"icon\" width=\"35\" height=\"35\" />\n         </button>\n      "), e.insertAdjacentHTML("beforeend", "\n         <div id=\"proteus-panel-test\">\n            <p>Type cursor</p>\n            <ul>\n               <li><button id=\"button-setShape-circle\">circle</button></li>\n               <li><button id=\"button-setShape-dot\">dot</button></li>\n               <li><button></button></li>\n               <li><button></button></li>\n            </ul>\n            \n            <p>Modifiers</p>\n            <ul>\n               <li><button>magnetic</button></li>\n               <li><button>parallax hover</button></li>\n               <li><button>text</button></li>\n            </ul>\n         </div>\n      ");
	}
	disableTestMode() {
		this.testMode = !1, document.querySelector("#proteus-button-test").classList.remove("active");
	}
};
e.PRESETS = {
	ghost: {
		shape: "circle",
		shape_size: "12px",
		shape_color: "rgba(255,255,255,0.55)",
		hasShadow: !0,
		shadow_size: "44px",
		shadow_color: "rgba(255,255,255,0.10)",
		blend_mode: "normal",
		click_animation: "scale"
	},
	neon: {
		shape: "circle",
		shape_size: "10px",
		shape_color: "#00D4AA",
		hasShadow: !0,
		shadow_size: "52px",
		shadow_color: "rgba(0,212,170,0.30)",
		blend_mode: "normal",
		click_animation: "ripple"
	},
	minimal: {
		shape: "circle",
		shape_size: "6px",
		shape_color: "#ffffff",
		hasShadow: !1,
		blend_mode: "normal",
		click_animation: "none"
	},
	chrome: {
		shape: "circle",
		shape_size: "48px",
		shape_color: "#ffffff",
		hasShadow: !1,
		blend_mode: "difference",
		click_animation: "scale"
	},
	ink: {
		shape: "fluid",
		shape_size: "24px",
		shape_color: "#e8e8e8",
		hasShadow: !0,
		shadow_size: "60px",
		shadow_color: "rgba(232,232,232,0.18)",
		blend_mode: "normal",
		click_animation: "ripple"
	}
};
function t(e, t = 1) {
	return `rgba(${parseInt(e.slice(1, 3), 16)}, ${parseInt(e.slice(3, 5), 16)}, ${parseInt(e.slice(5, 7), 16)}, ${t})`;
}
//#endregion
export { e as default };
