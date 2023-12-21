<script>
import { mapState } from "vuex";
import axios from 'axios';
const MediaRecorder = window.MediaRecorder;
const URL = window.URL || window.webkitURL;


export default {
  data() {
    return {
      collectedQuery: [],
      favorites: [],
      collectionShowed: [],
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

    getCollectionsByFavorite(favoriteID){
      this.collectionShowed = [];
      fetch('/api/getCollectionByFavorite', {
        method: 'POST',
        //mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({ query: favoriteID.toString()})
      }).then(response => response.json())
          .then(data => {
            console.log(data);
            this.collectionShowed.push(data);
            this.collectionShowed = this.collectionShowed[0];
            console.log(this.collectionShowed)
            console.log("获取成功");
          })
          .catch(error => {
            console.error('获取失败:', error);
          });
    },


    getFavorites(){
        this.favorites = [];
        fetch('/api/getFavorites', {
          method: 'POST',
          //mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({ query: "1"})
        }).then(response => response.json())
            .then(data => {
              console.log(data);
              this.favorites.push(data);
              this.favorites = this.favorites[0];
              console.log(this.favorites)
              console.log("获取收藏夹成功");
            })
            .catch(error => {
              console.error('获取收藏夹失败:', error);
            });

    },

  },
  created() {
  this.getCollectedQuery();
  this.getFavorites();
  this.getCollectionsByFavorite(1);
  },
};
</script>






<template>
<div>
  <div class="favorite-container">
    <div class="card" v-for="collection in collectionShowed">
      <span style="width: 100%;height: 100%">{{collection.collect_query}}</span>

    </div>

  </div>
  <div class="collection-bar-container">
    <div class="collection-bar-inner">
      <div class="collection-title">我的收藏</div>
    </div>
    <div class="all-group-container">
      <div class="coll-group">
        <a href="javascript:">
          <span style="width: 100%;height: 100%">全部</span>
        </a>
      </div>
      <div class="coll-group">
          <div style="float: left">我创建的收藏夹</div>
          <button class="custom-button" style="float: right">新建收藏夹</button>
      </div>
      <div class="coll-group">
        <a href="javascript:" v-for="favor in favorites">
          <span style="width: 100%;height: 100%" @click="getCollectionsByFavorite(favor.favorite_id)">{{favor.favorite_name}}</span>
        </a>
      </div>
    </div>
  </div>

</div>


</template>

<style scoped>
.collection-bar-container{
  width: 280px;
  background-color: white;
}
.collection-bar-inner {
  width: 280px;
  height: 100%;
  margin: 0 20px;
  position: relative;
}
.collection-title {
  width: 280px;
  border-bottom: 1px solid #d8d8d8;
  color: #333;
  font-size: 16px;
  height: 59px;
  line-height: 58px;
  padding-left: 4px;
}
.all-group-container {
  font-size: 14px;
  margin-top: 2px;
  width: 280px;
}
.coll-group {
  color: #333;
  height: 34px;
  width: 200px;
  line-height: 26px;
  padding-top: 4px;
  margin-left: 25px;
}
.coll-group a span {
  display: inline-block;
  max-width: 100%;
  color: black;
  overflow: hidden;
  position: relative;
  text-overflow: ellipsis;
  vertical-align: top;
  white-space: nowrap;
}
.coll-group a span:hover{
  background-color: #999;
  color: white;
}
.custom-button {
  font-weight: bold;
  color: #fff;
  background-color: #3498db;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
.favorite-container{
  width: 70%;
  position: relative;
  display: flex;
  float: right;
}
.card {
  border-image-source: initial;
  border-image-slice: initial;
  border-image-width: initial;
  border-image-outset: initial;
  border-image-repeat: initial;
  border-radius: 15px;
  cursor: pointer;
  display: inline-block;
  font-size: 14px;
  height: 200px;
  margin-bottom: 10px;
  margin-left: 5px;
  margin-right: 5px;
  position: relative;
  text-align: left;
  vertical-align: top;
  width: 150px;
  background-color: #81dcf8;
}
</style>