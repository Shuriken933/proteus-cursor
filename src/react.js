/**
 * Proteus Cursor — React adapter
 *
 * Provides a `useProteusCursor` hook that initialises the library on mount
 * and cleans up on unmount. Works with React 16.8+ (hooks) and Next.js
 * (SSR-safe: the constructor runs only inside useEffect, never on the server).
 *
 * Usage:
 *   import { useProteusCursor } from 'proteuscursor/react';
 *   import 'proteuscursor/style';
 *
 *   function App() {
 *     const cursor = useProteusCursor({ shape: 'circle', shape_color: '#fff' });
 *     // cursor.current is the ProteusCursor instance (null until mounted)
 *     return <main>...</main>;
 *   }
 */

import { useEffect, useRef } from 'react';
import ProteusCursor from 'proteuscursor';

/**
 * Initialises a ProteusCursor instance on mount and destroys it on unmount.
 *
 * @param {import('proteuscursor').ProteusCursorOptions} [options]
 * @returns {React.RefObject<import('proteuscursor').default | null>}
 *   A stable ref whose `.current` property holds the live instance once mounted.
 */
export function useProteusCursor(options = {}) {
   const instanceRef = useRef(null);

   useEffect(() => {
      const cursor = new ProteusCursor(options);
      instanceRef.current = cursor;

      return () => {
         cursor.destroy();
         instanceRef.current = null;
      };
      // Options are intentionally captured once at mount time.
      // To reconfigure after mount, call instance methods directly:
      //   instanceRef.current?.setShape('fluid')
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   return instanceRef;
}
