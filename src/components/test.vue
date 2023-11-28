<template>
	<div class="container">
		<header class="header">手语翻译与生成系统</header>
		<main class="main">
			<section class="translation-section"><Translator /></section>
			<section class="generation-section"><Generator /></section>
		</main>
		<footer class="footer">@著作权归cctv小组所有</footer>
	</div>
</template>

<script setup>
import Translator from "./components/Translator.vue";
import Generator from "./components/Generator.vue";
</script>

<style scoped>
.container {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
}

.header {
	padding: 15px;
	font-size: 25px;
	color: #2a6c9c;
	letter-spacing: 1px;
	background-color: #e8f3f7;
	text-align: center;
}

.main {
	flex-grow: 1;
	display: flex;
	justify-content: center;
	align-items: center;
}
.translation-section {
	width: 50%;
	text-align: center;
	margin-right: 20px;
}

.generation-section {
	width: 50%;
	text-align: center;
	margin-left: 20px;
}

.footer {
	padding: 20px;
	font-size: 13px;
	color: #8b8b8b;
	text-align: right;
	/* background-color: #f0f0f0; */
}
</style>
