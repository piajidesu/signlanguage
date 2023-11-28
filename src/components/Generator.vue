<template>
	<div>
		<div class="title">手语生成</div>
		<div>
			<input class="text-input" v-model="inputText" placeholder="请输入文字" />
			<button class="confirm" @click="generateVideo">确认</button>
		</div>
		<div
			style="
				display: flex;
				align-items: center;
				justify-content: center;
				margin: 5px;
			"
		>
			<button class="submit" @click="startRecording" :disabled="recording">
				输入语音
			</button>
			<button class="submit" @click="stopRecording" :disabled="!recording">
				结束输入
			</button>
			<audio
				ref="audioPlayer"
				:src="recordedAudioSrc"
				controls
				style="height: 25px"
			></audio>
		</div>
		<div class="result">翻译结果</div>
		<div
			style="border: 1px solid #a2d9f0; width: 75%; height: 300px; margin: auto"
		>
			<video
				:src="generatedVideoSrc"
				controls
				style="width: 100%; height: 100%"
			></video>
		</div>
	</div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      recognition: null,
      transcribedText: "",
      recording: false,
      chunks: [],
    };
  },
  methods: {
    startRecording() {
      this.recording = true;
      this.chunks = [];

      this.recognition = new window.webkitSpeechRecognition();
      this.recognition.lang = "zh-CN";
      this.recognition.continuous = true;
      this.recognition.interimResults = true;

      this.recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.trim();
        this.transcribedText = transcript;
      };

      this.recognition.onend = () => {
        console.log("语音录入结束");
      };

      this.recognition.onerror = (event) => {
        console.error("语音录入错误：", event.error);
      };

      this.recognition.ondataavailable = (event) => {
        this.chunks.push(event.data);
      };

      this.recognition.start();
    },
    stopRecording() {
      this.recording = false;
      if (this.recognition) {
        this.recognition.stop();
      }
    },
    startRecognition() {
      if (this.chunks.length === 0) {
        console.warn("没有录入的语音数据");
        return;
      }

      const audioBlob = new Blob(this.chunks, { type: "audio/webm" });
      const audioUrl = URL.createObjectURL(audioBlob);

      // 在这里，您可以将 `audioUrl` 发送到语音识别服务进行识别

      // 重置识别结果
      this.transcribedText = "";
    },
  },
  beforeDestroy() {
    this.stopRecording();
  },
};
</script>

<style scoped>
.title {
	margin-bottom: 10px;
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
.confirm {
	width: 50px;
	height: 25px;
	color: #2a6c9c;
	margin: 5px;
	border: 1px solid #a2d9f0;
	background-color: #e8f3f7;
	border-radius: 10px;
}
.text-input {
	height: 24px;
	border: 1px solid #a2d9f0;
}
.result {
	margin-top: 20px;
	padding: 10px;
}
</style>
