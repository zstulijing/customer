<template>
  <div class="quickReply">
    <div class="qSearch">
      <input type="text" v-model="search" placeholder="搜索快捷短语" @keyup.enter="searchQuickReply()">
    </div>
    <div class="qContent">
      <div class="quickReplyContent clear" v-for="(item, index) in quickReply" :key="index">
        <div>
          <p v-if="item.type == 1">{{item.quickReply}}</p>
          <img v-else :src="getImg(item.quickReply)" alt="">

          <p>{{item.keyword}}</p>
        </div>
        <div>
          <button @click="sendQuick(index)">发送</button>
        </div>
      </div>
    </div>

    <div class="qSetting">
      <div class="clear">
        <img src="~assets/img/chat/setting.png" alt="">
        <p>设置快捷短语</p>
      </div>
    </div>
  </div>
</template>

<script>
import {request} from 'network/request.js'
export default {
  name: 'QuickReply',
  data() {
    return {
      quickReply: [],
      search: ''
    }
  },
  methods: {
    getImg(fileName) {
      return 'http://l423145x35.oicp.vip/file/' + fileName
    },
    searchQuickReply() {
      request({
        method: 'GET',
        url: 'http://l423145x35.oicp.vip/ad-quickreply/query',
        params: {
          keywordlike: this.search,
          firm_id: this.$store.state.company.firmId, 
          pageStart: 1,
          pageLength: 11
        }
      }).then(response => {
        this.quickReply = response.data.data.records
      })
    },
    sendQuick(index) {
      this.$emit('quickReplySend', {
        quickReply: this.quickReply[index].quickReply,
        type: this.quickReply[index].type  
      })
    }
  },
  mounted () {
    request({
      method: 'GET',
      url: 'http://l423145x35.oicp.vip/ad-quickreply/query',
      params: {
        firm_id: this.$store.state.company.firmId, 
        pageStart: 1,
        pageLength: 11
      }
    }).then(response => {
      this.quickReply = response.data.data.records
    })
  },
}
</script>

<style lang="less" scoped>
  .quickReply {
    position: relative;
    .qSearch { 
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
    .qContent {

      .quickReplyContent {
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
            color: #3875C5;
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
    .qSetting {
      position: fixed;
      bottom: 0px;
      width: 393px;
      height: 50px;
      border-top: 1px solid #C8C8C8;
      background-color: #fff;
      &>div {
        width: 200px;
        margin: 0 auto;
        img {
          height: 22px;
          margin-top: 14px;
          margin-right: 5px;
          float: left;
        }
        p {
          line-height: 50px;
          float: left;
          font-size: 20px;
          font-family: Segoe UI;
          font-weight: 400;
        }
      }
    }
  }
</style>
