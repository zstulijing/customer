<template>
  <div class="window clear">
    <div class="dialogue">
      <div class="chatbox clearfix" ref="chatbox">
        <div v-for="(record, index) in records" :key="index">
          <div v-if="record != null">

            <div v-if="judgeDirection(record) == 1">
              <chat-record-left>
                <img :src="imgURL(profileImg)" alt="" slot="head">
                <p v-if="record.content" slot="text">{{record.content}}</p>
                <img v-else-if="record.savePath" :src="imgURL(record.savePath)" alt="" slot="emoji">
              </chat-record-left>
            </div>

            <div v-if="judgeDirection(record) == 2">
              <chat-record-right>
                <img :src="imgURL($store.state.profile.profileImg)" alt="" slot="head">
                <p v-if="record.content" slot="text">{{record.content}}</p>
                <img v-else-if="record.savePath" :src="imgURL(record.savePath)" alt="" slot="emoji">
              </chat-record-right>
            </div>

            <div v-if="judgeDirection(record) == 3">
              <chat-record-center>
                <p v-if="record.systemPrompt" slot="system">{{record.systemPrompt}}</p>
              </chat-record-center>
            </div>

          </div>
        </div>
      </div>
      <div class="send">
        <div class="fun clear">
          <div><img src="~assets/img/chat/emoji.png" alt=""></div>
          <div><img src="~assets/img/chat/screenshot.png" alt=""></div>
          <div><img src="~assets/img/chat/document.png" alt=""></div>
          <div><img src="~assets/img/chat/commonWords.png" alt=""></div>
          <div><img src="~assets/img/chat/history.png" alt=""></div>
        </div>
        <textarea name="" id="" cols="30" rows="10" v-model="sendMessage" @keyup.enter="send()"></textarea>
        <div class="button clear"><button @click="send()">发送(S)</button></div>
      </div>
    </div>

    <div class="chatFunction">
      <div class="cFuntion clear">
        <div @click="userMessage()">
          <p :class="{active: isUserMessage}">用户信息</p>
        </div>
        <div @click="knowledgeBase()">
          <p :class="{active: isKnowledgeBase}">知识库搜索</p></div>
        <div @click="quickReply()">
          <p :class="{active: isQuickReply}">快捷回复</p>
        </div>
      </div>

      <chat-information v-if="isUserMessage"></chat-information>
      <knowledge-base v-if="isKnowledgeBase" @quickReplySend="quickReplySend($event)"></knowledge-base>
      <quick-reply v-if="isQuickReply" @quickReplySend="quickReplySend($event)"></quick-reply>
    </div>

  </div>
</template>

<script>
import {request} from 'network/request.js'

import ChatRecordLeft from 'components/chat/ChatRecordLeft.vue'
import ChatRecordRight from 'components/chat/ChatRecordRight.vue'
import ChatRecordCenter from 'components/chat/ChatRecordCenter.vue'
import ChatInformation from 'components/chat/ChatInformation.vue'
import knowledgeBase from 'components/chat/KnowledgeBase.vue'
import QuickReply from 'components/chat/QuickReply.vue'

export default {
  name: 'ChatWindow',
  components: {
    ChatRecordLeft,
    ChatRecordRight,
    ChatRecordCenter,
    ChatInformation,
    knowledgeBase,
    QuickReply
  },
  props: {
    profileImg: {
      type: String
    }
  },
  data() {
    return {
      records: [],
      myId: this.$store.state.profile.id,
      source_id: this.$route.params.id,
      myPhoto: this.$store.state.profile.profileImg,
      message: {},
      isLeft: true,
      isRight: true,
      sendMessage: '',
      isUserMessage: true,
      isKnowledgeBase: false,
      isQuickReply: false
    }
  },

  methods: {
    imgURL(fileName) {
      return 'http://l423145x35.oicp.vip/file/' + fileName
    },
    judgeDirection(record) {
      if (record.type == 0) { //系统消息
        this.isLeft = false
        this.isRight = false
        return 3

      }
      else if (record.type == 1 || record.type == 2) { //文字消息
        if (record.sendId == this.myId) {
          this.isLeft = false
          this.isRight = true
          return 2

        } else {
          this.isLeft = true
          this.isRight = false
          return 1

        }
      }
    },
    addTag() {
      
    },
    send() {
      let sendMessage = this.sendMessage
      this.sendMessage = ''
      switch (this.$store.state.type) {
        case 1: //单聊
          request({
            method: 'GET',
            url: 'http://l423145x35.oicp.vip/chat/sendInfoInChat',
            params: {
              sendId: this.$store.state.profile.id,
              receiveId: this.$store.state.otherPart.linkUser,
              content: sendMessage,
              type: 1,
              firmId: this.$store.state.company.firmId
            }
          }).then(response => {
            this.$emit('send')
            request({
              method: 'GET',
              url: 'http://l423145x35.oicp.vip/chat/getThreeChatInfo',
              params: {
                source_id: this.source_id,
                type: 1,
                me_id: this.myId
              }
            }).then(response => {
              this.records = response.data.data.records
            })
          })
          break;
        case 3: //群聊

          break;
      }
      

    },
    userMessage() {
      this.isUserMessage = true,
      this.isKnowledgeBase = false,
      this.isQuickReply = false
    },
    knowledgeBase() {
      this.isUserMessage = false,
      this.isKnowledgeBase = true,
      this.isQuickReply = false
    },
    quickReply() {
      this.isUserMessage = false,
      this.isKnowledgeBase = false,
      this.isQuickReply = true
    },
    quickReplySend(quickReply) {
      if (quickReply.type == 1) {
        this.sendMessage = quickReply.quickReply
        this.send()
      }
    },
    update() {

      switch (this.$store.state.type) {
        case 1: //单聊
          request({
            method: 'GET',
            url: 'http://l423145x35.oicp.vip/chatOne/hasReadHistory',
            params: {
              relative_id: this.$store.state.otherPart.relative,
              type: 1
            }
          }).then(response => {
            request({
              method: 'GET',
              url: 'http://l423145x35.oicp.vip/chat/getThreeChatInfo',
              params: {
                source_id: this.source_id,
                type: 1,
                me_id: this.myId
              }
            }).then(response => {
              this.records = response.data.data.records
            })
          })
          break;

        case 2: //客服
          request({
            method: 'GET',
            url: 'http://l423145x35.oicp.vip/chatOne/hasReadHistory',
            params: {
              relative_id: this.$store.state.otherPart.relative,
              type: 3
            }
          }).then(response => {
            request({
              method: 'GET',
              url: 'http://l423145x35.oicp.vip/chat/getThreeChatInfo',
              params: {
                source_id: this.source_id,
                type: 3,
                me_id: this.myId
              }
            }).then(response => {
              this.records = response.data.data.history.records
            })
            
          })
          break;

        case 3: //群聊

          break;
      }
    }
  },
  mounted() {
    if (this.source_id != null) {
      switch (this.$store.state.type) {
        case 1: //单聊
          request({
            method: 'GET',
            url: 'http://l423145x35.oicp.vip/chat/getThreeChatInfo',
            params: {
              source_id: this.source_id,
              type: 1,
              me_id: this.myId
            }
          }).then(response => {
            this.records = response.data.data.records
          })
          break;
        case 2: //客服
          request({
            method: 'GET',
            url: 'http://l423145x35.oicp.vip/chat/getThreeChatInfo',
            params: {
              source_id: this.source_id,
              type: 3,
              me_id: this.myId
            }
          }).then(response => {
            this.records = response.data.data.history.records
          })
          break;
        case 3: //群聊
          break;
      }
    }
  },
  updated() {
    this.$refs.chatbox.scrollTop = this.$refs.chatbox.scrollHeight
  }
}
</script>

<style lang="less" scoped>
  .window {
    height: 100%;
  }
  .dialogue {
    float: left;
    margin-right: 15px;
    width: 100%;
    height: calc(100vh - 100px);
    box-sizing: border-box;
    border: 1px solid rgba(112, 112, 112, 0.3);
    border-radius: 0px 10px 0px 0px;
    .chatbox {
      box-sizing: border-box;
      padding: 0 45px 0 50px;
      width: 100%;
      height: 450px;
      background: rgb(248, 248, 248);
      overflow: auto;
    }
    .send {
      padding: 20px 30px 5px 30px;
      background-color: #fafafa;
      .fun {
        div {
          float: left;
          margin-right: 23px;
          img {
            width: 20px;
          }
        }
        &>div:last-child {
          float: right;
          margin-right: 0;
        }
      }
      textarea {
        padding-top: 10px;
        width: 100%;
        height: 100px;
        border: none;
        resize: none;
        font-size: 22px;
        background-color: #fafafa;
      }
      .button {
        button {
          float: right;
          width: 80px;
          height: 40px;
          background: #F5F5F5;
          border: 1px solid #707070;
          opacity: 0.5;
          font-size: 16px;
        }
      }
    }
  }
  .chatFunction {
    height: calc(100vh - 100px);
    overflow: auto;
    box-sizing: border-box;
    float: left;
    width: 395px;
    border: 1px solid rgba(112, 112, 112, 0.3);
    border-radius: 10px;
    .cFuntion {
      &>div {
        text-align: center;
        float: left;
        width: 125px;
        height: 20px;
        font-size: 16px;
        font-family: 'Segoe UI';
        font-weight: bold;
        padding: 10px 0;
        color: #000000;
        opacity: 1;
        border-bottom: 1px solid #c8c8c8;
        p {
          cursor: pointer;
        }
        .active {
          color: #3875C5;
        }
      }
      &>div:nth-child(2) {
        p {
          border-left: 1px solid #c8c8c8;
          border-right: 1px solid #c8c8c8;
        }
      }
    }
  }
  
</style>