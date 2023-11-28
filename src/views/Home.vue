<script>
import { mapState } from "vuex";
export default {
	data() {
		return {};
	},
	computed: {
		...mapState(["theme_is_light"]),
	},
	methods: {
		gowhere(path) {
			this.$router.push("/" + path);
		},
	},
};
</script>
<template>
	<div>
		<div class="name" :style="{ color: !theme_is_light ? 'white' : 'black' }">
			中文手语实时翻译与生成系统
		</div>
		<div class="eng" :style="{ color: !theme_is_light ? 'white' : 'black' }">
			Chinese Sign Language Real-time Translation and Generation System
		</div>
	</div>
	<div class="butt" style="display: flex">
		<button
			class="sign"
			:style="{
				// color: !theme_is_light ? 'black' : 'white',
				// backgroundColor: !theme_is_light ? 'white' : '#a5a5a5',
			}"
			style="
				background-image: linear-gradient(to right, #81dcf8, #187fdc);
				color: white;
			"
			@click="gowhere('translator')"
		>
			手语翻译
		</button>
		<button
			class="sign"
			:style="{
				// color: !theme_is_light ? 'black' : 'white',
				// backgroundColor: !theme_is_light ? 'white' : '#a5a5a5',
			}"
			style="
				background-image: linear-gradient(to right, #81dcf8, #187fdc);
				color: white;
			"
			@click="gowhere('generator')"
		>
			手语生成
		</button>
	</div>
</template>

<style scoped>
.name {
	padding-top: 67px;
	padding-left: 45px;
	font-weight: bold;
	font-size: 88px;
}
.eng {
	padding-left: 45px;
	font-weight: bold;
	font-size: 40px;
}
.butt {
	margin: 12px 32px;
}
.sign {
	display: flex;
	justify-content: center;
	align-items: center;
	background: none;
	border: none;
	box-sizing: border-box;
	margin: 0 15px;
	padding: 0px 30px;
	border-radius: 16px;
	/* font: inherit; */
	cursor: pointer;
	outline: inherit;
	font-weight: bold;
	font-size: 25px;
	margin-right: 20px;
	height: 33px;
	width: 162px;
	line-height: 14.5px;
	transform: scale(0.95);
	transition: transform 0.3s ease;
}
.sign:hover {
	transform: scale(1.02);
}
</style>
