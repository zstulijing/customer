<template>
  <div class="contactsDetail">
    <div class="cHeader clear">
      <img :src="imgURL($store.state.otherPart.profileImg)" alt="">
      <p>{{message.name}}</p>
    </div>
    <div class="cMessage">

      <div class="clear inf">
        <p>ID:</p>
        <p>{{message.id}}</p>
      </div>

      <div class="clear inf">
        <p>手机:</p>
        <p>{{message.mobile}}</p>
      </div>

      <div class="clear inf">
        <p>备注:</p>
        <p>{{message.remark}}</p>
      </div>

      <div class="clear inf">
        <p>分组:</p>
        <p>默认分组</p>
      </div>

      <div class="clear inf">
        <p>性别:</p>
        <p>{{message.gender}}</p>
      </div>

      <div class="clear inf tag">
        <p class="first">标签:</p>
        <p v-for="(item, index) in message.tag" :key="index">{{item.key}}</p>
      </div>

    </div>


    <div class="cButton">
      <button @click="toSendMessage()">发送消息</button>
    </div>
  </div>
</template>

<script>
import {request} from 'network/request.js'
export default {
  name: 'ContactsDetail',
  data() {
    return {
      message: {}
    }
  },
  methods: {
    imgURL(fileName) {
      return 'http://l423145x35.oicp.vip/file/' + fileName
    },
    toSendMessage() {
      this.$router.push('/chat/' + this.$store.state.otherPart.linkUser)
    }
  },
  mounted () {
    request({
      method: 'GET',
      url: 'http://l423145x35.oicp.vip/chatOne/otherIsEmployeeInChat',
      params: {
        relative_id: this.$store.state.otherPart.relative
      }
    }).then(response => {

      if (response.data.data) {
        console.log(1);
        //员工
        request({
          method: 'GET',
          url: 'http://l423145x35.oicp.vip/chatOne/getManInfo',
          params: {
            people_id: this.$store.state.otherPart.linkUser,
            roleType: 2,
            firm_id: this.$store.state.company.firmId,
            me_id: this.$store.state.profile.id
          }
        }).then(response => {
          this.message = response.data.data
        })

      } else {
        console.log(2);
        //客户
        request({
          method: 'GET',
          url: 'http://l423145x35.oicp.vip/chatOne/getManInfo',
          params: {
            people_id: this.$store.state.otherPart.linkUser,
            roleType: 1,
            firm_id: this.$store.state.company.firmId,
            me_id: this.$store.state.profile.id
          }
        }).then(response => {
          this.message = response.data.data
        })
      }
    })
  }
}
</script>

<style lang="less" scoped>
  .contactsDetail {
    margin: 0 auto;
    padding-top: 100px;
    width: 600px;
    .cHeader {
      padding: 20px;
      img {
        width: 60px;
        float: left;
        border-radius: 5px;
      }
      p {
        float: right;
        font-size: 24px;
        font-family: 'Segoe UI';
        font-weight: bold;
        line-height: 60px;

      }
    }
    
    
    .cMessage {
      border-top: 1px solid rgba(112, 112, 112, 0.5);
      border-bottom: 1px solid rgba(112, 112, 112, 0.5);
      
      padding: 0 40px;
      .inf {
        line-height: 36px;
        margin: 10px 0;
        p {
          float: left;
          font-size: 18px;
          font-family: 'Segoe UI';
        } 
        &>p:nth-child(1) {
          width: 50px;
          text-align: right;
          margin-right: 20px;
        }
      }
      .tag {
        &>p:not(.first) {
          background-color: #1492e631;
          padding: 1px 10px;
          border-radius: 10px;
          margin-right: 10px;
        }
        &>p:last-child {
          cursor: pointer;
        }
      }

    }

    .cButton {
      width: 140px;
      margin: 20px auto;
      button {
        font-size: 20px;
        width: 140px;
        height: 30px;
        background: #3875c580;
        border-radius: 5px;
        border: none;
      }
    }
  }
</style>
