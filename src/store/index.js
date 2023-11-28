import { createStore } from "vuex";

export default createStore({
	state: {
		theme_is_light: true,
		bgc_url: "light.jpg",
	},
	mutations: {
		changetheme(state, newTheme) {
			state.theme_is_light = newTheme;
		},
		change_bgc_url(state, isIndex) {
			let bgc_url = "";
			if (state.theme_is_light) bgc_url += "light";
			else bgc_url += "night";
			if (!isIndex) bgc_url += "1";
			state.bgc_url = bgc_url + ".jpg";
		},
	},
	actions: {},
});

