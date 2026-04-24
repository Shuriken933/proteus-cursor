/** Visual properties that can be applied as a named cursor state */
export interface CursorStateOptions {
  shape_size?: string;
  shape_color?: string;
  hasShadow?: boolean;
  shadow_size?: string;
  text?: string;
  text_color?: string;
  text_weight?: string;
  text_size?: string;
}

export interface ProteusCursorOptions {
  /** Cursor shape. Default: `'default'` */
  shape?: 'circle' | 'fluid' | 'default';
  /** Width and height of the cursor element. Default: `'10px'` */
  shape_size?: string;
  /** Background color of the cursor. Default: `'#fff'` */
  shape_color?: string;

  /** Whether to show the trailing shadow. Default: `true` */
  hasShadow?: boolean;
  /** Transition delay for the shadow (CSS time value). Default: `'0.3s'` */
  shadow_delay?: string;
  /** Width and height of the shadow element. Default: `'40px'` */
  shadow_size?: string;
  /** Color of the shadow element. Default: `'#ffffff'` */
  shadow_color?: string;

  /** Text to display inside the cursor */
  text?: string;
  /** Color of the cursor text */
  text_color?: string;
  /** Font weight of the cursor text */
  text_weight?: string;
  /** Font size of the cursor text */
  text_size?: string;

  /** Easing factor for fluid mode (0–1). Default: `0.9` */
  speed?: number;
  /** Maximum velocity cap for fluid distortion. Default: `10` */
  maxVelocity?: number;

  /** Enable magnetic attraction to interactive elements (coming soon) */
  magnetic?: boolean;

  /** Animation played on mousedown. Default: `'scale'` */
  click_animation?: 'scale' | 'ripple' | 'none';
  /** Duration of the click animation in ms. Default: `300` */
  click_duration?: number;
}

export default class ProteusCursor {
  constructor(options?: ProteusCursorOptions);

  // ── Registered states ────────────────────────────────────────────────────
  states: Record<string, CursorStateOptions>;

  // ── Instance state ───────────────────────────────────────────────────────
  shape: 'circle' | 'fluid' | 'default';
  shape_size: string;
  shape_color: string;
  hasShadow: boolean;
  shadow_delay: string;
  shadow_size: string;
  shadow_color: string;
  text: string;
  text_color: string;
  text_weight: string;
  text_size: string;
  speed: number;
  maxVelocity: number;
  isMagnetic: boolean;
  click_animation: 'scale' | 'ripple' | 'none';
  click_duration: number;
  isDestroyed: boolean;

  // ── Shape ────────────────────────────────────────────────────────────────
  /** Switch cursor shape at runtime */
  setShape(shape: 'circle' | 'fluid' | 'default'): void;

  // ── Size & Color ─────────────────────────────────────────────────────────
  /**
   * Resize the cursor element.
   * @param width  CSS size string (e.g. `'40px'`)
   * @param height CSS size string (e.g. `'40px'`)
   * @param isPermanent When true, updates the stored default so it persists after hover resets
   */
  setShapeSize(width: string, height: string, isPermanent?: boolean): void;

  /**
   * Change the cursor color.
   * @param isPermanent When true, updates the stored default
   */
  setShapeColor(color: string, isPermanent?: boolean): void;

  // ── Shadow ───────────────────────────────────────────────────────────────
  /**
   * Show or hide the shadow element.
   * @param isPermanent When true, updates the stored default
   */
  setShadowEnabled(isEnabled: boolean, isPermanent?: boolean): void;

  /** Resize the shadow element */
  setShadowSize(width: string, height: string): void;

  /**
   * Set shadow color.
   * @param hexColor Hex color string (e.g. `'#ffffff'`)
   * @param alpha    Opacity 0–1. Default: `0.5`
   */
  setShadowColor(hexColor: string, alpha?: number): void;

  // ── Text ─────────────────────────────────────────────────────────────────
  setText(text: string, isPermanent?: boolean): void;
  setTextColor(color: string, isPermanent?: boolean): void;
  setTextWeight(weight: string, isPermanent?: boolean): void;
  setTextSize(size: string, isPermanent?: boolean): void;

  // ── Fluid ────────────────────────────────────────────────────────────────
  /** Set easing speed for fluid mode (0–1) */
  setSpeed(speed: number): void;

  /** Set maximum velocity cap for fluid distortion */
  setMaxVelocity(maxVelocity: number): void;

  // ── State Machine ────────────────────────────────────────────────────────
  /**
   * Register a named cursor state. Elements with `data-cursor-state="name"`
   * will activate it on mouseenter and restore defaults on mouseleave.
   * @returns `this` for chaining
   */
  addState(name: string, options: CursorStateOptions): this;

  /**
   * Remove a previously registered state.
   * @returns `this` for chaining
   */
  removeState(name: string): this;

  // ── Lifecycle ────────────────────────────────────────────────────────────
  /** Remove all event listeners, cancel animations and restore the native cursor */
  destroy(): void;

  /** Enable the built-in debug panel */
  enableTestMode(): void;

  /** Disable the built-in debug panel */
  disableTestMode(): void;
}
