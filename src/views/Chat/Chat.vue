<template>
  <div class="chat">

    <!-- <input type="file" name="" id="file"> -->
    <!-- <button @click="upload()">上传</button> -->
    <!-- <button @click="submit()">发送</button> -->
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

import {request} from 'network/request.js'
import axios from 'axios'


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
    },
    // upload() {
    //   let input = document.getElementById('file')
    //   input.click()
    // },
    // submit() {
    //   let input = document.getElementById('file')
    //   let file = input.files[0]
    //   console.dir(file)
    //   console.log(file)
    //   let params = new FormData()
    //   params.append('file', file)
    //   axios.post('http://l423145x35.oicp.vip/uploadDownload/uploadImage', params, {headers: {'Content-Type': 'multipart/form-data'}}).then(response => {
    //     console.log(response.data);
    //   })
    // }
  },
  beforeCreate () {
    if (Object.keys(this.$store.state.profile).length === 0) {
      alert('您尚未登录，即将返回登录界面')
      this.$router.push('/logon')
    }
  },
  mounted() {
    //   let url ="http://l423145x35.oicp.vip/file/39829059219357696.cpp";
    //   let name ="39829059219357696.cpp";
    //   const downloadRes = async () => {
    //   let response = await fetch(url); // 内容转变成blob地址
    //   let blob = await response.blob();  // 创建隐藏的可下载链接
    //   let objectUrl = window.URL.createObjectURL(blob);
    //   let a = document.createElement('a');
    //   a.href = objectUrl;
    //   a.download = name;
    //   a.click()
    //   a.remove(); 
    // }
    // downloadRes();
  }
}
</script>

<style lang="less" scoped>
  @navBarHeight: 40px;
  
  .chat {
    position: relative;
  }

  // #file {
  //   width: 0px;
  //   opacity: 0;
  // }
</style>
