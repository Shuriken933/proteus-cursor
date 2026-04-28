/** Names of the five built-in presets */
export type PresetName = 'ghost' | 'neon' | 'minimal' | 'chrome' | 'ink';

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
  /**
   * CSS `mix-blend-mode` applied to the cursor shape element.
   * Use `'difference'` for an automatic color-inversion effect (works best with
   * a white `shape_color`). Use `'normal'` to remove blending.
   */
  blend_mode?: 'normal' | 'difference' | 'exclusion' | 'multiply' | 'screen' | 'overlay' | string;
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

  /**
   * When `true` (default), the library skips initialization if the user has
   * enabled "reduce motion" at the OS level (`prefers-reduced-motion: reduce`).
   * Set to `false` to opt-out of this behaviour.
   * Default: `true`
   */
  respectReducedMotion?: boolean;

  /**
   * CSS `mix-blend-mode` applied to the cursor shape element.
   * `'difference'` gives the classic automatic color-inversion effect —
   * works best with `shape_color: '#ffffff'`.
   * Default: `'normal'`
   */
  blend_mode?: 'normal' | 'difference' | 'exclusion' | 'multiply' | 'screen' | 'overlay' | string;
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
  blend_mode: string;
  click_animation: 'scale' | 'ripple' | 'none';
  click_duration: number;
  isDestroyed: boolean;
  /**
   * `true` when the library detected a touch-only device and skipped
   * initialization. All API methods are safe to call — they are no-ops.
   */
  readonly isTouch: boolean;
  /**
   * `true` when `respectReducedMotion` is enabled and the user's OS has
   * `prefers-reduced-motion: reduce` set. Initialization was skipped;
   * all API methods are safe to call as no-ops.
   */
  readonly isReducedMotion: boolean;
  /** Whether the library will respect the reduced-motion OS preference. Default: `true` */
  respectReducedMotion: boolean;

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

  // ── Blend mode ───────────────────────────────────────────────────────────
  /**
   * Apply a CSS `mix-blend-mode` to the cursor shape element at runtime.
   * @param mode      Any valid CSS mix-blend-mode value (e.g. `'difference'`)
   * @param isPermanent When true, persists across state machine resets
   */
  setBlendMode(mode: string, isPermanent?: boolean): void;

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

  // ── Preset system ────────────────────────────────────────────────────────
  /**
   * Apply a named built-in preset to the live cursor instance.
   * Optionally pass `overrides` to customise individual properties.
   * @returns `this` for chaining
   *
   * @example
   * cursor.loadPreset('neon');
   * cursor.loadPreset('chrome', { shape_size: '64px' });
   */
  loadPreset(name: PresetName | string, overrides?: ProteusCursorOptions): this;

  /**
   * Return the raw configuration object for a named preset.
   * Useful for using a preset as a base in the constructor:
   *
   * @example
   * const cursor = new ProteusCursor({
   *   ...ProteusCursor.getPreset('neon'),
   *   shape_color: '#ff4444',
   * });
   */
  static getPreset(name: PresetName | string): ProteusCursorOptions | undefined;

  /**
   * All built-in preset configurations, keyed by name.
   */
  static readonly PRESETS: Record<PresetName, ProteusCursorOptions>;

  // ── Device & accessibility detection ────────────────────────────────────
  /**
   * Returns `true` when the primary pointing device is coarse (touch/finger).
   * ProteusCursor calls this automatically; you can use it for your own
   * conditional logic.
   *
   * @example
   * if (!ProteusCursor.isTouchOnly()) {
   *   const cursor = new ProteusCursor({ shape: 'circle' });
   * }
   */
  static isTouchOnly(): boolean;

  /**
   * Returns `true` when the user has enabled "reduce motion" at the OS level
   * (`prefers-reduced-motion: reduce`). ProteusCursor calls this automatically;
   * you can use it for your own conditional logic.
   *
   * @example
   * if (!ProteusCursor.prefersReducedMotion()) {
   *   cursor.addState('hero', { shape_size: '80px' });
   * }
   */
  static prefersReducedMotion(): boolean;

  // ── Lifecycle ────────────────────────────────────────────────────────────
  /** Remove all event listeners, cancel animations and restore the native cursor */
  destroy(): void;

  /** Enable the built-in debug panel */
  enableTestMode(): void;

  /** Disable the built-in debug panel */
  disableTestMode(): void;
}
