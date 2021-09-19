<template>
  <div class="KnowledgeBase">
    <div class="kSearch">
      <input type="text" v-model="search" placeholder="搜索快捷短语" @keyup.enter="searchKnowledgeBase()">
    </div>
    <div class="kContent">
      <div class="knowledgeBaseContent clear" v-for="(item, index) in knowledgeBase" :key="index">
        <div>
          <p>{{item.theKey}}</p>
          <p v-if="item.type == 1">{{item.theValue}}</p>
          <img v-else :src="getImg(item.theValue)" alt="">
        </div>
        <div>
          <button @click="sendQuick(index)">发送</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {request} from 'network/request.js'
export default {
  name: 'KnowledgeBase',
    data() {
    return {
      knowledgeBase: [],
      search: ''
    }
  },
  methods: {
    getImg(fileName) {
      return 'http://l423145x35.oicp.vip/file/' + fileName
    },
    searchKnowledgeBase() {
      request({
        method: 'GET',
        url: 'http://l423145x35.oicp.vip/ad-knowledge/queryReturnPage',
        params: {
          pageNum: 1,
          pageLength: 11,
          namelike: this.search,
          firm_id: this.$store.state.company.firmId, 
        }
      }).then(response => {
        this.knowledgeBase = response.data.data.records
      })
    },
    sendQuick(index) {
      this.$emit('quickReplySend', {
        quickReply: this.knowledgeBase[index].theValue,
        type: this.knowledgeBase[index].type  
      })
    }
  },
  mounted () {
    request({
      method: 'GET',
      url: 'http://l423145x35.oicp.vip/ad-knowledge/queryReturnPage',
      params: {
        pageNum: 1,
        pageLength: 11,
        firm_id: this.$store.state.company.firmId, 
      }
    }).then(response => {
      this.knowledgeBase = response.data.data.records
    })
  },
}
</script>

<style lang="less" scoped>
  .KnowledgeBase {
    position: relative;
    .kSearch { 
      input {
        display: block;
        margin: 12px auto;
        width: 300px;
        height: 30px;
        background: #EDEDED;
        border: 1px solid #E3E3E3;
        border-radius: 5px;
        padding-left: 10px;
      }
      input::-webkit-input-placeholder { 
        font-family: 'SegoeUI';
        background-image: url(~assets/img/chat/search.png);
        background-size: 18px;
        background-repeat: no-repeat;
        background-position-x: 80px;
        background-position-y: 5px;
        text-align: center;
        font-size: 16px;
        color: #707070;
      }
      input:-moz-placeholder { 
        font-family: 'SegoeUI';
        background-image: url(~assets/img/chat/search.png);
        background-size: 18px;
        background-repeat: no-repeat;
        background-position-x: 80px;
        background-position-y: 5px;
        text-align: center;
        font-size: 16px;
        color: #707070;
      } 
      input::-moz-placeholder { 
        font-family: 'SegoeUI';
        background-image: url(~assets/img/chat/search.png);
        background-size: 18px;
        background-repeat: no-repeat;
        background-position-x: 80px;
        background-position-y: 5px;
        text-align: center;
        font-size: 16px;
        color: #707070;
      } 
      input:-ms-input-placeholder { 
        font-family: 'SegoeUI';
        background-image: url(~assets/img/chat/search.png);
        background-size: 18px;
        background-repeat: no-repeat;
        background-position-x: 80px;
        background-position-y: 5px;
        text-align: center;
        font-size: 16px;
        color: #707070;
      }
    }
    .kContent {

      .knowledgeBaseContent {
        width: 360px;
        box-sizing: border-box;
        margin: 10px auto;
        padding: 10px ;
        border: 1px solid #C8C8C8;
        background-color: #fff;
        border-radius: 5px;
        &>div:nth-child(1) {
          float: left;
          width: 250px;
          &>p:nth-child(1) {
            font-size: 16px;
            font-family: 'Segoe UI';
            font-weight: 400;
            line-height: 25px;
          }
          &>p:nth-child(2) {
            margin-top: 5px;
            font-size: 12px;
            font-family: 'Segoe UI';
            font-weight: 400;
            line-height: 21px;
            color: #000;
          }
          img {
            width: 150px;
          }
        }
        &>div:nth-child(2) {
          float: right;
          button {
            margin-top: 10px;
            width: 50px;
            height: 30px;
            background: #5e97e0;
            border-radius: 5px;
            font-size: 14px;
            font-family: 'Segoe UI';
            font-weight: 400;
            line-height: 30px;
            color: #FFFFFF;
            outline: none;
            border: none;
          }
        }
      }
    }
  }
</style>
