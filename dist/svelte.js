import e from "proteuscursor";
import { onDestroy as t, onMount as n } from "svelte";
//#region src/svelte.js
function r(r = {}) {
	let i;
	return n(() => {
		i = new e(r);
	}), t(() => {
		i?.destroy(), i = void 0;
	}), { get current() {
		return i;
	} };
}
//#endregion
export { r as useProteusCursor };
