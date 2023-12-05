<script>
import { mapState } from "vuex";
import axios from 'axios';
const MediaRecorder = window.MediaRecorder;
const URL = window.URL || window.webkitURL;


export default {
  data() {
    return {
      favorites: [
        {
          sourceLanguage: '英语',
          targetLanguage: '中文',
          originalText: 'Hello',
          translatedText: '你好'
        },
        // 可以添加更多的收藏项目
      ],
      collectedQuery: [],




    };
  },
  methods: {
    removeFavorite(index) {
      this.favorites.splice(index, 1);
    },
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


  },
  created() {
  this.getCollectedQuery();



  },
};
</script>






<template>
  <div>
    <h1>收藏夹</h1>
    <div v-if="favorites.length === 0">
      <p>您的收藏夹为空。</p>
    </div>
    <div v-else>
      <ul>
        <li v-for="(favorite, index) in favorites" :key="index">
          <div>{{ favorite.sourceLanguage }} → {{ favorite.targetLanguage }}</div>
          <div>{{ favorite.originalText }} → {{ favorite.translatedText }}</div>
          <button @click="removeFavorite(index)">删除</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>

</style>