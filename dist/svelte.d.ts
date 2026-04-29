import type ProteusCursor from 'proteuscursor';
import type { ProteusCursorOptions } from 'proteuscursor';

/**
 * Svelte lifecycle helper — initialises a ProteusCursor inside `onMount`
 * (SSR-safe, client-only) and destroys it in `onDestroy`.
 * Compatible with Svelte 4 and Svelte 5.
 *
 * @param options ProteusCursor configuration options
 * @returns An object whose `.current` holds the live instance (undefined until mounted)
 *
 * @example
 * <script>
 *   const cursor = useProteusCursor({ shape: 'circle', shape_color: '#fff' });
 *   // later: cursor.current?.addState('hero', { shape_size: '60px' });
 * </script>
 */
export declare function useProteusCursor(
   options?: ProteusCursorOptions
): { readonly current: ProteusCursor | undefined };
