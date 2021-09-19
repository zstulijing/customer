<template>
  <div class="content">
    <div v-if="broadcast">
      <Prompt v-for="(item, index) in broadcast" :key="index" :messageTpye="item.type">
        <p slot="name">{{item.name}}</p>
        <img :src="getImg(item.profileImg)" alt="" slot="profileImg">
      </Prompt>
    </div>
    <slot></slot>
  </div>
</template>

<script>
import Prompt from 'components/public/Prompt.vue'
export default {
  name: 'Content',
  components: {
    Prompt
  },
  props: {
    broadcast: {
      type: Array,
      default: null
    }
  },
  methods: {
    getImg(filename) {
      return 'http://l423145x35.oicp.vip/file/' + filename
    }
  },
}
</script>

<style lang="less" scoped>
  @navBarHeight: 40px;
  @funBarWidth: 60px;

  .content {
    margin-left: @funBarWidth;
  }
</style>
