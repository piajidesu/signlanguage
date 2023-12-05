<script>
import { mapState } from "vuex";
import axios from 'axios';
const MediaRecorder = window.MediaRecorder;
const URL = window.URL || window.webkitURL;

export default {
	data() {
		return {
      collectImgURL: '../assets/收藏.jpg',
			isPlaying: false, // 标识视频是否正在播放
			videoSrc: "../assets/video1.mp4", // 视频文件路径
			mediaRecorder: null, // 媒体录制对象
			recordedBlob: null, // 录制的音频文件Blob对象
			audioURL: null, // 用于在左侧div框内展示录制音频
			recording: false, // 标识是否正在录制
			speechResult: "", // 存储生成的文字内容
			counter: 0, // 记录当前生成到第几个字
			recognition: null, // 语音识别对象
			recordedMediaRecorder: null, // 用于存储录制的音频
			is_focus:false,
			pending_gen_text:"",
			tmp_txt:'',
      searchQuery: '',
      searchHistory: [], // 存储搜索记录的数组
      HistoryShowed: [],//展示出来的历史记录
      searchHistory_collected: [],
      collectedQuery: [],
      res: '无',
      isGetting: false,
      dialogVisible: false,
      CollectVisible: false,
      isHovered: false,
      isManage: false,
		};
	},
	computed: {
		...mapState(["theme_is_light"]),
	},
	methods: {
		setFocus(){
			this.is_focus = true;
		},
		setBlur(){
			if(this.tmp_txt.length==0)
			this.is_focus = false;
			else{
				this.pending_gen_text = this.tmp_txt
			}
			console.log(this.pending_gen_text)
		},
    startTextGeneration() {
      this.counter = 0; // 初始化计数器
      this.text = ""; // 清空生成的文字内容

      // 每隔一段时间（这里设置500毫秒）执行一次生成文字的操作
      this.textGenerationInterval = setInterval(() => {
        // 获取完整的文字内容
        const fullText = this.speechResult;
        // console.log("111");
        // 每次生成一个字
        this.text += fullText[this.counter];

        // 更新计数器
        this.counter++;

        // 如果计数器超过文字长度，停止生成文字
        if (this.counter >= fullText.length) {
          clearInterval(this.textGenerationInterval);
        }
      }, 150);
    },
		startRecording() {
			navigator.mediaDevices
				.getUserMedia({ audio: true })
				.then((stream) => {
					this.mediaRecorder = new MediaRecorder(stream);
					this.chunks = [];

					this.mediaRecorder.addEventListener("dataavailable", (event) => {
						if (event.data.size > 0) {
							this.chunks.push(event.data);
						}
					});

					this.mediaRecorder.addEventListener("stop", () => {
						this.recordedBlob = new Blob(this.chunks, { type: "audio/webm" });
						this.audioURL = URL.createObjectURL(this.recordedBlob);
					});

					this.mediaRecorder.start();
					this.recording = true;

					// Add speech recognition code here
					this.recognition = new webkitSpeechRecognition();
					this.recognition.lang = "zh-CN";

					this.recognition.onresult = (event) => {
						this.speechResult = event.results[0][0].transcript;
						this.pending_gen_text = this.speechResult;
						//this.startTextGeneration();
						console.log(this.speechResult);
					};

					this.recognition.onerror = (event) => {
						if (event.error === 'no-speech') {
							console.log('No speech detected');
							// Handle the case where no speech is detected
						} else {
							console.error(event.error);
						}
					};

					this.recognition.start();
				})
				.catch((error) => {
					console.error("Error accessing microphone:", error);
				});
		},
		stopRecording() {
			if (this.mediaRecorder && this.recording) {
				this.mediaRecorder.stop();
				this.recording = false;
				        // 在停止录制音频后开始语音识别
				//this.startSpeechRecognition();
			}
		},

		playVideo() {
      if(this.isGetting == true){
        console.log("正在获取视频");
        return;
      }
      this.saveSearchQuery();
      this.isGetting = true;
			if(this.tmp_txt.length>0) this.pending_gen_text = this.tmp_txt
      if(this.tmp_txt.length==0 || this.tmp_txt == ""){
        alert("文本不能为空哦");
        return;
      }
			// axios.post('http://your-server-endpoint', {
			// text: this.text,
			// })
			// .then(response => {
			// console.log(response.data); // 处理服务器响应
			// })
			// .catch(error => {
			// console.error('Error sending text to server:', error);
			// });
			fetch('/generator',{
				method:'POST',
				headers:{
					'Content-Type':'application/json'
				},
				body:JSON.stringify({
					sentence:this.pending_gen_text
				})
			}).then(response=>response.blob())
			.then(async(blob)=>{
				this.isPlaying = true;
				let videoUrl = URL.createObjectURL(blob)
        this.isGetting = false;
				// await new Promise(resolve=>{setTimeout(resolve,100)})
				if (this.$refs.videoPlayer) {
					console.log(videoUrl);
					console.log(this.$refs.videoPlayer);
					this.$refs.videoPlayer.src = videoUrl;
        			// 调用play()方法开始播放
        			this.$refs.videoPlayer.play();

			}})

		},

    isExisit(){
      for(var i = 0; i < this.searchHistory.length; i++){
        // console.log("aasdsadsad");
        // console.log(this.tmp_txt);
        // console.log(this.searchHistory[i].search_query);
        if(this.searchHistory[i].search_query == this.tmp_txt)
          return true;
      }
      for(var i = 0; i < this.searchHistory_collected.length; i++){
        if(this.searchHistory_collected[i].search_query == this.tmp_txt)
          return true;
      }
      return false;

    },


    saveSearchQuery() {
      if(this.isExisit()){
        console.log("已存在，无需保存");
        return;
      }
       // console.log("hhh");
      //console.log(document.cookie);
      //console.log(this.tmp_txt);
      const data = {
        query: this.tmp_txt,
      };

      fetch('/api/save', {
        method: 'POST',
        //mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
          .then(response => {
            if (response.ok) {
              console.log('搜索记录已保存');
            } else {
              console.error('保存搜索记录时出现错误');
            }
          })
          .catch(error => {
            console.error('保存搜索记录时出现错误:', error);
          });
      this.getSearchQuery();
    },

    deletSearchQuery(query) {
      // console.log("hhh");
      const data = {
        query: query,
      };
      fetch('/api/delete', {
        method: 'POST',
        //mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
          .then(response => {
            if (response.ok) {
              console.log('已删除');
            } else {
              console.error('删除时出现错误');
            }
          })
          .catch(error => {
            console.error('删除时出现错误:', error);
          });
      this.getSearchQuery();
      console.log(this.searchHistory)
    },

    deletAllSearchQuery() {
      // console.log("hhh");
      const data = {
        query: "delete all",
      };
      fetch('/api/delete_all', {
        method: 'POST',
        //mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
          .then(response => {
            if (response.ok) {
              console.log('已全部删除');
            } else {
              console.error('全部删除时出现错误');
            }
          })
          .catch(error => {
            console.error('全部删除时出现错误:', error);
          });
      this.getSearchQuery();
      console.log(this.searchHistory)
    },


    collectSearchQuery(query) {
      // console.log("hhh");
      const data = {
        query: query,
      };
      fetch('/api/collect', {
        method: 'POST',
        //mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
          .then(response => {
            if (response.ok) {
              console.log('成功');
            } else {
              console.error('收藏时出现错误');
            }
          })
          .catch(error => {
            console.error('收藏时出现错误:', error);
          });
      //this.getSearchQuery();
      //console.log(this.searchHistory)
    },

    getSearchQuery() {
      this.searchHistory = [];
      this.searchHistory_collected = [];
      this.searchHistory = [];
      fetch('/api/get_history', {
        method: 'POST',
        //mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({ query: "1"})
      }).then(response => response.json())
          .then(data => {
            console.log(data);
            this.searchHistory.push(data);
            this.searchHistory = this.searchHistory[0];
            this.set_HistoryShowed();
            console.log(this.searchHistory)
            console.log("获取成功");
          })
          .catch(error => {
            console.error('获取失败:', error);
          });

    },
    //获取收藏
    getCollectedQuery() {
      this.collectedQuery = [];
      fetch('/api/getCollect', {
        method: 'POST',
        //mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({ query: "1"})
      }).then(response => response.json())
          .then(data => {
            console.log(data);
            this.collectedQuery.push(data);
            this.collectedQuery = this.collectedQuery[0];
            console.log(this.collectedQuery)
            console.log("获取成功");
          })
          .catch(error => {
            console.error('获取失败:', error);
          });

    },


    generateUUID() {
      // 生成唯一标识符
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },

    setCookie(name, value, days) {
      var expires = '';
      if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toUTCString();
      }
      document.cookie = name + '=' + value + expires + '; path=/';
    },

    getCookie(name) {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
          return cookie.substring(name.length + 1);
        }
      }
      return null;
    },

    set_HistoryShowed(KeyValuePairs){
      this.HistoryShowed = [];
      for(var i = this.searchHistory.length - 1; i >= Math.max(this.searchHistory.length - 4,0) ; i--) {
        this.HistoryShowed.push(this.searchHistory[i]);
      }
    },
    openDialog() {
      console.log("打开");
      this.dialogVisible = true;
    },
    closeDialog() {
      this.dialogVisible = false;
    },

    openCollect() {
      console.log("打开");
      this.CollectVisible = true;
    },
    closeCollect() {
      this.CollectVisible = false;
    },

  },

  created() {
    var userId = this.getCookie('userId');
    if (!userId) {
      userId = this.generateUUID();
      this.setCookie('userId', userId, 365);
      console.log('New user ID created:', userId);
    } else {
      console.log('Existing user ID:', userId);
    }
    this.getSearchQuery();
    this.getCollectedQuery();
  }
};
</script>

<template onload="getSearchQuery">
	<div style="text-align: center">
		<div style="margin: 30px;min-width: 1100px">
			<strong
				class="text"
				style="font-size: 55px"
				:style="{ color: !theme_is_light ? 'white' : 'rgb(71, 71, 71)' }"
			>
				手语生成
			</strong>
			<div
				class="text"
				style="font-size: 15px; letter-spacing: 10px; margin: 5px"
				:style="{ color: !theme_is_light ? 'white' : 'rgb(71, 71, 71)' }"
			>
				SIGN LANGUAGE GENERATION
			</div>
			<div style="display: flex; justify-content: center">
				<button
					class="sign"
					style="background-image: linear-gradient(to right, #81dcf8, #187fdc);
						color: white;"
					@click="startRecording"
					:disabled="recording"
					v-if="!recording"
				>
					开始录音
				</button>
				<button
					class="sign"
					style="
						background-image: linear-gradient(to right, #81dcf8, #187fdc);
						color: white;
					"
					@click="stopRecording"
					:disabled="!recording"
					v-else
				>
					结束录音
				</button>
			</div>
		</div>
		<div style="display: flex">
			<div
				style="
					display: flex;
					justify-content: center;
					align-items: center;
					width: 46%;
					height: auto;
					aspect-ratio: 16/9;
					padding: 20px;
					min-width: 533px;
					min-height: 300px;
				"
			>
				<div
					id="video-placeholder"
					class="bk_linear"
					style="width: 80%; aspect-ratio: 16/9; margin-top: 25px; position: relative"
					:style="{
						boxShadow: this.$store.state.theme_is_light
							? '0 10px 50px 0 #bfbfbf'
							: '0 10px 50px 0 #000',
					}"
				>
					<div>
						<!-- <div style="margin-top: 20px; color: rgb(123, 123, 123)">
							这里是录制的音频
						</div> -->
						<div class="audio-player-container">
							<div style="width: 80%; height: 100%" class="audio-player">
								<audio style="width: 100%; height: 100%" controls :src="audioURL"></audio>
								<div class="play-button"></div>
								<div class="pause-button"></div>
							</div>
						</div>
					</div>
					<div style="height: 10%;display: flex; justify-content: center">
						<button
							class="sign"
							style="
								background-image: linear-gradient(to right, #81dcf8, #187fdc);
								color: white;
								margin: 1%;
								width: 40%;
								height: 100%;
								white-space: nowrap;
								text-overflow: ellipsis;
							"
							@click="startTextGeneration"
						>
							语音转文字
						</button>
					</div>
          <div>

          </div>
					<div style="margin-bottom: 3% ;margin-top: 3%;display: flex; justify-content: center">
					<div
						style="
							background-color: rgba(255, 255, 255, 0.5);
									width: 80%;
									aspect-ratio: 16/7;
									border-radius: 2.5%;
						"
					>
						<div
							style="
								display: flex;
									align-items: center;
									justify-content: center;
									color: rgb(123, 123, 123);
									height: 100%;
							"
							v-if="!counter"
						>
							{{ is_focus ? "" : '现在还没有转成文本的音频哦~' }}

                <textarea @focus="setFocus" @blur="setBlur" rows="5" cols="20" v-model="tmp_txt" style="
                position: absolute;
                width: 75%;
								aspect-ratio: 16/7;
								background-color: transparent;
								border: none;
								resize: none;
								outline: none;
                font-size: 20px;
                "
                ></textarea>

						</div>
						<div style="text-align: left; padding: 10px 20px" v-else>
							{{ pending_gen_text }}
						</div>
            <div class="op-favor-container">
              <a href="javascript:void(0);"
                 class=""
                 data-hover-tip-text="添加到收藏夹"
                 title="添加到收藏夹"
                 style="display: inline"
              >
              <span class="icon-favo" @click="collectSearchQuery(tmp_txt)">
                收藏
              </span>
              </a>
            </div>

					</div>
				</div>

				</div>
			</div>
			<div
				style="
					display: flex;
					justify-content: center;
					align-items: center;
					width: 8%;
					height: 80%;
					min-width: 100px;
				"
			>
				<button
					class="circle-button"
					style="
						background-image: linear-gradient(to right, #81dcf8, #187fdc);
						color: white;
						cursor: pointer;
						position: absolute;
            margin-top: max(292px,25%);
					"
					@click="playVideo"
				>
					开始生成
				</button>
			</div>
			<div
				style="
					display: flex;
					justify-content: center;
					align-items: center;
					width: 46%;
					height: auto;
					aspect-ratio: 16/9;
					padding: 20px;
					min-width: 533px;
					min-height: 300px;
				"
			>
				<div
					class="bk_linear"
					style="width: 80%; aspect-ratio: 16/9; margin-top: 25px; position: relative"
					:style="{
						boxShadow: this.$store.state.theme_is_light
							? '0 10px 50px 0 #bfbfbf'
							: '0 10px 50px 0 #000',
					}"
				>
					<div class="video-placeholder" v-show="!isPlaying">
						<img
							class="video_sign"
							src="../assets/video_sign.png"
							alt="png图像"
							style="width: 15%;
              position: absolute;
              top: 0;
              bottom: 0;
              left: 0;
              right: 0;
              margin: auto;"
						/>
						<div style="color: rgb(123, 123, 123);margin-top: 35%">现在还没有生成的视频哦~</div>
					</div>
					<!-- 视频元素 -->
					<div
						style="
							overflow: hidden;
							width: 100%;
							height: 100%;
							border-radius: 20px;
						"
						v-show="isPlaying"
					>
						<video
							ref="videoPlayer"
							class="video-player"
							style="
								width: 100%;
								height: 100%;
								object-fit: cover;
							"
						></video>
					</div>

				</div>
			</div>
		</div>
	</div>
  <div class="history-warp" id="history-warp" style="display: block">
    <div class="history-container">
      <span class="history-new-item" @click="()=>{
                                                  tmp_txt = history.search_query;
                                                  is_focus = true;
                                                   }"
            v-for="history in HistoryShowed">{{history.search_query}}</span>
      <span class="history-btn" @click="openDialog"><i class="history-btn-icon">"历史记录"</i></span>
    </div>
  </div>

  <div>
    <!-- 对话框 -->
    <el-dialog
        v-model="dialogVisible"
        title="搜索记录"
        @close="closeDialog"
        style="height: 50%"
        @closed="() => {isHovered = false;isManage = false}"

    >
      <div class="history-warp-dialog" id="history-warp" style="display: flex">
        <div>
           <span class="history-modal-item"
                 @click="()=>{
                              if(!isManage)
                              {tmp_txt = history.search_query;
                              is_focus = true;
                              closeDialog();}
                               }"
            v-for="history in searchHistory">
             <span v-show="isHovered" class="cross" @click="deletSearchQuery(history.search_query)">X</span>
             {{ history.search_query }}

           </span>
        </div>
      </div>
      <el-button class = "history-manage-btn" @click="()=>{isHovered = !isHovered;isManage = !isManage}">
        管理
      </el-button>
      <el-button class = "history-clear-btn" @click="()=>{deletAllSearchQuery()}">
        清空
      </el-button>
    </el-dialog>
  </div>


</template>

<style scoped>
.sign {
	display: flex;
	margin: auto 10px;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	background: none;
	border: none;
	box-sizing: border-box;
	padding: 0px 30px;
	border-radius: 13px;
	font-weight: bold;
	font-size: 16px;
	height: 25px;
	width: 124px;
	line-height: 17px;
	margin-top: 3px;
	transform: scale(0.95);
	transition: transform 0.3s ease;
}
.sign:hover {
	transform: scale(1.02);
}
.bk_linear {
	background: linear-gradient(135deg, #f4fcff, #e3f2ff, #e3e7ff);
	background-size: 200% 200%;
	animation: gradient-move 10s ease infinite;
	border-radius: 20px;
}

@keyframes gradient-move {
	0% {
		background-position: 0% 0%;
	}
	50% {
		background-position: 100% 100%;
	}
	100% {
		background-position: 0% 0%;
	}
}
.circle-button {
	display: flex;
	justify-content: center;
	align-items: center;
	background: none;
	border: none;
	box-sizing: border-box;
	border-radius: 50%;
	font-weight: bold;
	font-size: 16px;
	padding: 0 20px;
	height: 80px;
	width: 80px;
	line-height: 17px;
	transform: scale(1);
	transition: transform 0.3s ease;
}
.circle-button:hover {
	transform: scale(1.1);
}
.audio-player-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 3%;
  height: 20px;
}

.audio-player {
	position: relative;
	width: 80%;
	height: 60px;
	background-color: transparent;
	overflow: hidden;
	display: flex;
	align-items: center;
}

.audio-player audio {
	flex: 1;
	height: 100%;
	outline: none;
	background-color: transparent;
}

.play-button,
.pause-button {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	font-size: 30px;
	color: white;
}
.history-container{
  margin-left: 5%;
  display: flex;
  width: 100%;
}
.history-new-item{
  position: relative;
  background: #e7eaf5;
  border-radius: 10px;
  margin-left: 10px;
  box-sizing: border-box;
  color: #999;
  cursor: pointer;
  font-family: PingFang SC;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  height: 28px;
  line-height: 28px;
  max-width: 10%;
  overflow: hidden;
  padding: 0 10px;
  text-overflow: ellipsis;
  transition: all .16s;
  white-space: nowrap;
}
.history-modal-item {
  background: #f2f3fa;
  border-radius: 10px;
  box-sizing: border-box;
  cursor: pointer;
  float: left;
  margin-bottom: 10px;
  margin-right: 10px;
  max-width: 100%;
  padding: 8px 14px;
  position: relative;
}
.history-wrap {
  color: #999;
  display: none;
  font-size: 14px;
  margin-top: 20px;
}
.history-wrap-dialog {
  color: #999;
  display: none;
  font-size: 14px;
  margin-top: 20px;
  height: 500px;
}
.history-btn {
  margin-left: 1%;
  align-items: center;
  background: #e7eaf5;
  border-radius: 10px;
  color: #666;
  cursor: pointer;
  display: flex;
  font-family: PingFang SC;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  justify-content: center;
  padding: 5px 0;
  width: 100px;
}
.history-manage-btn{
  position: absolute;
  right: 1%;
  bottom: 1%;
}
.history-clear-btn{
  position: absolute;
  right: 11%;
  bottom: 1%;
}
.cross {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 10px;
  height: 10px;
  background-color: #ccc;
  color: #fff;
  border-radius: 50%;
  text-align: center;
  line-height: 20px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s ease;
}

/* 鼠标悬停时叉的背景颜色变深 */
.cross:hover {
  background-color: #999;
}

.op-favor-container {
  align-items: center;
  display: flex;
  float: right;
  height: 30px;
  justify-content: center;
  margin-right: 9px;
  overflow: visible;
  position: relative;
  width: 30px;
}
.icon-favo {
  background-position: 0 -133px;
  background-repeat: no-repeat;
  height: 20px;
  width: 20px;
  margin-left: -4px;
  margin-top: 7px;
  width: 14px;
}
</style>
