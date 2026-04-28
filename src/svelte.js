/**
 * Proteus Cursor — Svelte adapter
 *
 * Provides a `useProteusCursor` function that initialises the library
 * inside `onMount` (SSR-safe, runs client-side only) and tears it down
 * in `onDestroy`. Compatible with Svelte 4 and Svelte 5.
 *
 * Usage:
 *   <script>
 *     import { useProteusCursor } from 'proteuscursor/svelte';
 *     import 'proteuscursor/style';
 *
 *     const cursor = useProteusCursor({ shape: 'circle', shape_color: '#fff' });
 *     // cursor.current is the ProteusCursor instance (undefined until mounted)
 *   </script>
 */

import { onMount, onDestroy } from 'svelte';
import ProteusCursor from 'proteuscursor';

/**
 * Initialises a ProteusCursor instance on mount and destroys it on destroy.
 *
 * @param {import('proteuscursor').ProteusCursorOptions} [options]
 * @returns {{ readonly current: import('proteuscursor').default | undefined }}
 *   An object whose `.current` property holds the live instance once mounted.
 */
export function useProteusCursor(options = {}) {
   let instance;

   onMount(() => {
      instance = new ProteusCursor(options);
   });

   onDestroy(() => {
      instance?.destroy();
      instance = undefined;
   });

   return {
      get current() { return instance; }
   };
}
