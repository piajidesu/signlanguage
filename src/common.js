export default {
	loadResource: (name) => {
		return new URL("./assets/" + name, import.meta.url).href;
	},
};
