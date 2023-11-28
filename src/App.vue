<template>
	<div
		class="background-container"
		:style="{ backgroundImage: `url(${'./src/assets/' + bgc_url})` }"
	>
		<div
			class="nav"
			style="
				display: flex;
				justify-content: space-between;
				font-weight: bold;
				margin: 25px 30px;
			"
			:style="{ color: !isLight ? 'white' : 'black' }"
		>
			<div>@CCTV</div>
			<div class="nav_main" style="text-align: right; margin-right: 15px">
				<button
					class="text-button"
					@click="switchBackgroundImage"
					:style="{ color: !isLight ? 'white' : 'black' }"
				>
					Theme
				</button>
				<button
					class="text-button"
					@click="gohome"
					:style="{ color: !isLight ? 'white' : 'black' }"
				>
					Home
				</button>
				<button
					class="text-button"
					:style="{ color: !isLight ? 'white' : 'black' }"
					@click="gowhere('license')"
				>
					License
				</button>
			</div>
		</div>
		<div><router-view></router-view></div>
	</div>
</template>

<script>
import { mapState } from "vuex";
export default {
	data() {
		return {
			imageUrl: "light.jpg", // 初始图片路径
			alternativeImageUrl: "night.jpg", // 替换图片路径
			isLight: true,
			btn_color: "",
		};
	},
	methods: {
		switchBackgroundImage() {
			this.isLight = !this.isLight;
			this.$store.commit("changetheme", this.isLight);
			console.log(this.$route.path);
			this.$store.commit(
				"change_bgc_url",
				this.$route.path == "/home" ? true : false
			);
		},
		gohome() {
			this.$router.push("/");
		},
		gowhere(path) {
			this.$router.push("/" + path);
		},
	},
	computed: {
		...mapState(["bgc_url"]),
	},
};
</script>

<style>
.background-container {
	/* 添加其他样式 */
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	box-sizing: border-box;
	background-size: cover;
	background-repeat: no-repeat;
	background-position: center;
}

.text-button {
	margin: auto 15px;
	padding: 0;
	background: none;
	font: inherit;
	border: none;
	outline: inherit;
	cursor: pointer;
	border-bottom: 2px solid transparent;
}
.text-button:hover {
	border-bottom: 2px solid #187fdc;
}
</style>
