<template>
  <div>
    <nav-bar></nav-bar>
    <div class="contentArea clear">
      <fun-bar></fun-bar>
      <Content :broadcast="broadcast">
        <chat-content @prompt="prompt($event)"></chat-content>
      </Content>
    </div>
  </div>
</template>

<script>
import NavBar from 'components/public/NavBar.vue'
import FunBar from 'components/public/FunBar.vue'
import Content from 'components/public/Content.vue'
import ChatContent from './ChatContent.vue'
export default {
  name: 'Chat',
  components: {
    FunBar,
    NavBar,
    Content,
    ChatContent
  },
  data() {
    return {
      broadcast: []
    }
  },
  methods: {
    prompt(broadcast) {
      this.broadcast = broadcast
    }
  },
  beforeCreate () {
    if (Object.keys(this.$store.state.profile).length === 0) {
      alert('您尚未登录，即将返回登录界面')
      this.$router.push('/logon')
    }
  }
}
</script>

<style lang="less" scoped>
  @navBarHeight: 40px;
  .contentArea {
    margin-top: @navBarHeight;
  }
</style>
