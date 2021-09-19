<template>
  <div class="body">
    <nav-bar></nav-bar>
    <div class="contentArea clear">
      <fun-bar></fun-bar>
      <Content>
        <contacts-content></contacts-content>
      </Content>
    </div>
  </div>
</template>

<script>
import NavBar from 'components/public/NavBar.vue'
import FunBar from 'components/public/FunBar.vue'
import Content from 'components/public/Content.vue'
import ContactsContent from './ContactsContent.vue'
export default {
  name: 'Contacts',
  components: {
    FunBar,
    NavBar,
    Content,
    ContactsContent
  },
}
</script>

<style lang="less" scoped>
  @navBarHeight: 40px;
  .contentArea {
    margin-top: @navBarHeight;
  }
</style>
