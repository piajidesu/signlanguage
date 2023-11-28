<template>
	<div>
		<div class="title">手语翻译</div>
		<div
			style="border: 1px solid #a2d9f0; width: 75%; height: 300px; margin: auto"
			class="video-container"
		>
			<video ref="videoElement" autoplay></video>
		</div>
		<div style="display: flex; align-items: center; justify-content: center">
			<button class="submit" @click="startRecording" v-if="!isRecording">
				开始录制
			</button>
			<button class="submit" @click="stopRecording" v-if="isRecording">
				结束录制
			</button>
		</div>
		<div class="result">翻译结果</div>
		<div
			style="border: 1px solid #a2d9f0; width: 75%; height: 100px; margin: auto"
		></div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			isRecording: false,
			recognitionResult: "",
			mediaRecorder: null,
			recordedChunks: [],
		};
	},
	methods: {
		startRecording() {
			this.isRecording = true;
			navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
				this.$refs.videoElement.srcObject = stream;
				this.$refs.videoElement.play();

				this.recordedChunks = [];
				this.mediaRecorder = new MediaRecorder(stream);
				this.mediaRecorder.ondataavailable = (event) => {
					if (event.data && event.data.size > 0) {
						this.recordedChunks.push(event.data);
					}
				};
				this.mediaRecorder.start();
			});
		},
		stopRecording() {
			this.isRecording = false;
			this.mediaRecorder.stop();
			this.$refs.videoElement.srcObject
				.getTracks()
				.forEach((track) => track.stop());
			this.$refs.videoElement.srcObject = null;

			const blob = new Blob(this.recordedChunks, {
				type: "video/mp4",
			});

			// 发送录制的视频数据到服务器进行保存
			const formData = new FormData();
			formData.append("file", blob, "recorded_video.webm");
			fetch("/save-video", {
				method: "POST",
				body: formData,
			})
				.then((response) => response.json())
				.then((data) => {
					console.log("录制的视频已保存");
					console.log(data); // 这里可以处理服务器返回的结果
				})
				.catch((error) => {
					console.error("保存录制视频时出错", error);
				});
		},
	},
};
</script>

<style scoped>
.title {
	margin-bottom: 10px;
}
.video-container {
	width: 500px; /* 设置固定的宽度 */
	height: 300px; /* 设置固定的高度 */
	overflow: hidden; /* 隐藏溢出的部分 */
}
.submit {
	width: 70px;
	height: 25px;
	color: #2a6c9c;
	margin: 5px;
	border: 1px solid #a2d9f0;
	background-color: #e8f3f7;
	border-radius: 10px;
}

.result {
	padding: 10px;
}
</style>
