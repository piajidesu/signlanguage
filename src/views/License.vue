<script>
import { mapState } from "vuex";
export default {
	data() {
		return {};
	},
	computed: {
		...mapState(["theme_is_light"]),
	},
};
</script>
<template>
	<div style="text-align: center">
		<div style="margin: 45px">
			<strong
				class="text"
				style="font-size: 45px"
				:style="{ color: !theme_is_light ? 'white' : 'rgb(71, 71, 71)' }"
				>版权声明与许可证</strong
			>
			<div
				class="text"
				style="font-size: 35px"
				:style="{ color: !theme_is_light ? 'white' : 'rgb(71, 71, 71)' }"
			>
				感谢您选择使用由CCTV小组开发的手语翻译与生成系统
			</div>
		</div>
		<div>
			<div style="margin: 15px">
				<strong
					class="text"
					:style="{ color: !theme_is_light ? 'white' : 'rgb(71, 71, 71)' }"
					>版权声明</strong
				>
				<div
					class="text"
					:style="{ color: !theme_is_light ? 'white' : 'rgb(71, 71, 71)' }"
				>
					本系统由CCTV小组拥有版权。除非取得CCTV小组明确的书面许可，任何个人或机构不得复制、修改、分发或以任何形式进行商业利用
				</div>
			</div>
			<div style="margin: 15px">
				<strong
					class="text"
					:style="{ color: !theme_is_light ? 'white' : 'rgb(71, 71, 71)' }"
					>许可范围</strong
				>
				<div
					class="text"
					:style="{ color: !theme_is_light ? 'white' : 'rgb(71, 71, 71)' }"
				>
					CCTV小组特此授予您一项非专有、不可转让的许可，允许您个人或机构在以下条件下使用本软件：<br />
					您可以在单一设备上使用本系统。<br />
					您可以将本系统用于个人学习、研究或非商业用途。
				</div>
			</div>
			<div style="margin: 15px">
				<strong
					class="text"
					:style="{ color: !theme_is_light ? 'white' : 'rgb(71, 71, 71)' }"
					>限制条件</strong
				>
				<div
					class="text"
					:style="{ color: !theme_is_light ? 'white' : 'rgb(71, 71, 71)' }"
				>
					除非经过CCTV小组的事先书面许可，您不得：<br />
					将本系统用于商业出版、销售或其他盈利活动 ;
					复制、修改、反向工程、逆向编译、分解或试图提取本软件源代码的任何部分。
				</div>
			</div>
		</div>
		<div>
			<img src="../assets/emo.gif" alt="GIF图像" style="width: 115px" />
		</div>
	</div>
</template>

<style>
.text {
	margin: 5px;
	color: rgb(71, 71, 71);
}
</style>
