<template>
  <div class="cContent">
    <contacts-list></contacts-list>
    <div class="cRight">
      <div class="cHome" v-if="isHome">
        <img src="~assets/img/salesman/transparent.png" alt="">
      </div>
      <div class="cFriendDetail" v-else>
        <contacts-detail :key="key"></contacts-detail>
      </div>
    </div>
  </div>
</template>

<script>
import ContactsList from 'components/contacts/ContactsList.vue'
import ContactsDetail from 'components/contacts/ContactsDetail.vue'
export default {
  name: 'ContactsContent',
  components: {
    ContactsList,
    ContactsDetail
  },
  computed: {
    isHome() {
      if (this.$route.path == '/contacts') {
        return true
      } else {
        return false
      }
    },
    key() {
      return this.$route.path + Math.random() 
    }
  }
}
</script>

<style lang="less" scoped>

  @contactsListWidth: 300px;
  
  .cRight {
     margin-left: @contactsListWidth;
    height: calc(100vh - 40px);
    box-sizing: border-box;
    background-color: rgb(250, 250, 250);
    .cHome {
      padding-top: 250px;
      margin: 0 auto;
      width: 200px;
      img {
        width: 200px;
      }
    }
  }
</style>