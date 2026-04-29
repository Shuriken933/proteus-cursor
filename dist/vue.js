import e from "proteuscursor";
import { onMounted as t, onUnmounted as n, ref as r } from "vue";
//#region src/vue.js
function i(i = {}) {
	let a = r(null);
	return t(() => {
		a.value = new e(i);
	}), n(() => {
		a.value?.destroy(), a.value = null;
	}), a;
}
//#endregion
export { i as useProteusCursor };
