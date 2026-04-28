/**
 * Proteus Cursor — Vue 3 adapter
 *
 * Provides a `useProteusCursor` composable that initialises the library
 * inside `onMounted` (SSR-safe) and tears it down in `onUnmounted`.
 * Requires Vue 3 with the Composition API.
 *
 * Usage:
 *   import { useProteusCursor } from 'proteuscursor/vue';
 *   import 'proteuscursor/style';
 *
 *   // inside <script setup> or setup()
 *   const cursor = useProteusCursor({ shape: 'circle', shape_color: '#fff' });
 *   // cursor.value is the ProteusCursor instance (null until mounted)
 */

import { ref, onMounted, onUnmounted } from 'vue';
import ProteusCursor from 'proteuscursor';

/**
 * Initialises a ProteusCursor instance on mount and destroys it on unmount.
 *
 * @param {import('proteuscursor').ProteusCursorOptions} [options]
 * @returns {import('vue').Ref<import('proteuscursor').default | null>}
 *   A reactive ref whose `.value` holds the live instance once mounted.
 */
export function useProteusCursor(options = {}) {
   const instance = ref(null);

   onMounted(() => {
      instance.value = new ProteusCursor(options);
   });

   onUnmounted(() => {
      instance.value?.destroy();
      instance.value = null;
   });

   return instance;
}
