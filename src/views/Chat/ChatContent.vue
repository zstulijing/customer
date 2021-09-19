<template>
  <div class="chat clear">

    <session-list class="chatLeft" ref="sessionList" @update="chatUpdate($event)" @prompt="prompt($event)"></session-list>
    <div class="chatRight">
      <div class="chatHome" v-if="isHome">
          <img src="~assets/img/salesman/transparent.png" alt="">
      </div>

      <div class="chatContent" v-else>
        <div class="chatTitle"><p>{{$store.state.otherPart.talkName}}</p></div>
        <chat-window :key="key" :profileImg="$store.state.otherPart.profileImg" @send="send()" ref="chatwindow"></chat-window>
      </div>
    </div>
  </div>  
</template>

<script>
import SessionList from 'components/chat/SessionList.vue'
import ChatWindow from 'components/chat/ChatWindow.vue'

export default {
  name: 'ChatContent',
  components: {
    SessionList,
    ChatWindow,
  },
  methods: {
    send() {
      switch (this.$store.state.type) {
        case 1: //单聊
          this.$refs.sessionList.friendListUpdate()
          break;
        case 2: //客服
          this.$refs.sessionList.serviceListUpdate()
          break;

        case 3: //群聊
          
          break;

      }
    },
    chatUpdate() {
      this.$refs.chatwindow.update()
    },
    prompt(broadcast) {
      this.$emit('prompt', broadcast)
    }
  },
  computed: {
    key() {
      return this.$route.path + Math.random() 
    },
    isHome() {
      if (this.$route.path == '/chat') {
        return true
      } else {
        return false
      }
    }
  }

}
</script>

<style lang="less" scoped>

  @sessionListWidth: 300px;
  @chatTitleHeight: 56px;

  .chatRight {
    margin-left: @sessionListWidth;
    height: calc(100vh - 40px);
    box-sizing: border-box;
    background-color: rgb(250, 250, 250);
    .chatHome {
      padding-top: 250px;
      margin: 0 auto;
      width: 200px;
      img {
        width: 200px;
      }
    }
  }

  .chatTitle {
    height: @chatTitleHeight;
    p {
      font-family: 'Segoe UI';
      font-size: 22px;
      font-weight: 400;
      line-height: 60px;
      margin-left: 30px;
    }
  }
</style>
