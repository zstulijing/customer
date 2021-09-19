<template>
  <div id="bar">
    <div class="logo">
      <img src="~assets/img/narbar/logo.png" alt="">
      <p>信易萃学</p>
    </div>
    <div class="personal">
      <img :src="getIMG(profile.profileImg)" alt="">
      <p>{{profile.username}}</p>
    </div>
    <div class="icon">
      <span @click="logout()">登出</span>
      <img src="~assets/img/narbar/search.png" alt="">
      <img src="~assets/img/narbar/message.png" alt="">
      <img src="~assets/img/narbar/notice.png" alt="">
    </div>
    
  </div>
</template>

<script>
import {request} from 'network/request.js'
export default {
  name: 'NavBar',
  data() {
    return {
      profile: this.$store.state.profile
    }
  },
  methods: {
    getIMG(filename) {
      return 'http://l423145x35.oicp.vip/file/' + filename
    },
    logout() {
      request({
        method: 'GET',
        url: 'http://l423145x35.oicp.vip/bs-people/leave',
        params: {
          people_id: this.$store.state.profile.id
        }
      }).then(response => {
        this.$store.commit('setProfile', null)
        this.$router.push('/logon')
      })
    }
  }
}
</script>

<style lang="less" scoped>

  @navBarHeight: 40px;
  
  #bar {
    width: 80%;
    z-index: 10;
    // position: fixed;
    background-color: #fff;
    width: 100%;
    height: @navBarHeight;
    top: 0px;
  }
  .logo {
    float: left;
    p {
      float: left;
      font-family: Microsoft YaHei;
      font-size: 20px;
      line-height: 40px;
      color: #3C3F41;
    }
    img {
      float: left;
      width: 20px;
      border: 1px solid #7070702f;
      margin: 9px 40px;
      border-radius: 5px;
    }
  }
  .icon {
    float: right;
    margin: 10px 0;
    span {
      font-size: 16px;
      margin-right: 20px;
      color: #3875C5;
      cursor: pointer;
    }
    img {
      height: 20px;
      margin-right: 20px;
    }
  }
  .personal {
    float: right;
    
    img {
      margin: 7px 0;
      float: left;
      width: 25px;
      border-radius: 5px;
      margin-right: 10px;
    }
    p {
      margin: 10px 0;
      float: left;
      line-height: 20px;
      color: #575C5F;
      font-size: 16px;
      font-family: Microsoft YaHei;
    }
  }
</style>
