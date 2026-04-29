import { useEffect as e, useRef as t } from "react";
import n from "proteuscursor";
//#region src/react.js
function r(r = {}) {
	let i = t(null);
	return e(() => {
		let e = new n(r);
		return i.current = e, () => {
			e.destroy(), i.current = null;
		};
	}, []), i;
}
//#endregion
export { r as useProteusCursor };
