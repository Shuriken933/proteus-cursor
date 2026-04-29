import type { Ref } from 'vue';
import type ProteusCursor from 'proteuscursor';
import type { ProteusCursorOptions } from 'proteuscursor';

/**
 * Vue 3 composable — initialises a ProteusCursor inside `onMounted` (SSR-safe)
 * and destroys it in `onUnmounted`. Use inside `<script setup>` or `setup()`.
 *
 * @param options ProteusCursor configuration options
 * @returns A reactive ref whose `.value` holds the live instance (null until mounted)
 *
 * @example
 * // <script setup>
 * const cursor = useProteusCursor({ shape: 'circle', shape_color: '#fff' });
 * </script>
 */
export declare function useProteusCursor(
   options?: ProteusCursorOptions
): Ref<ProteusCursor | null>;
