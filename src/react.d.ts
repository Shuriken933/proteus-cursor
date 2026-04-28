import type { RefObject } from 'react';
import type ProteusCursor from 'proteuscursor';
import type { ProteusCursorOptions } from 'proteuscursor';

/**
 * React hook — initialises a ProteusCursor on mount and destroys it on unmount.
 * SSR-safe: the constructor runs only inside useEffect, never on the server.
 *
 * @param options ProteusCursor configuration options
 * @returns A stable ref whose `.current` holds the live instance (null until mounted)
 *
 * @example
 * function App() {
 *   const cursor = useProteusCursor({ shape: 'circle', shape_color: '#fff' });
 *   return <main>...</main>;
 * }
 */
export declare function useProteusCursor(
   options?: ProteusCursorOptions
): RefObject<ProteusCursor | null>;
