<template> 
  <div class="information">
    <div class="profile">
      <div class="photo clear">
        <img :src="imgURL($store.state.otherPart.profileImg)" alt="">
        <p>{{message.name}}</p>
      </div>
      <div class="personInformation">
        <div class="inf clear">
          <p>ID:</p>
          <p>{{message.id}}</p>
        </div>
        <div class="inf clear">
          <p>手机:</p>
          <p>{{message.mobile}}</p>
        </div>
        <div class="inf clear">
          <p>备注:</p>
          <p>{{message.remark}}</p>
        </div>
        <div class="inf clear">
          <p>分组:</p>
          <p>默认分组</p>
        </div>
        <div class="inf clear">
          <p>性别:</p>
          <p>{{message.gender}}</p>
        </div>
        <div class="inf clear tag">
          <p class="first">标签:</p>
          <p v-for="(item, index) in message.tag" :key="index">{{item.key}}</p>
          <p @click="addTag()">+</p>
        </div>
      </div>
    </div>
    <div class="manage">
      <div class="clear bar">
        <img src="~assets/img/chat/nodisturb.png" alt="">
        <div class="border clear">
          <p>消息免打扰</p>
          <div class="newButton">
            <new-button></new-button>
          </div>
        </div>
      </div>

      <div class="clear bar">
        <img src="~assets/img/chat/topping.png" alt="">
        <div class="border clear">
          <p>置顶聊天</p>
          <div class="newButton">
            <new-button></new-button>
          </div>
        </div>
      </div>

      <div class="clear bar">
        <img src="~assets/img/chat/blacklist.png" alt="">
        <div class="border clear">
          <p>加入黑名单</p>
          <div class="newButton">
            <new-button></new-button>
          </div>
        </div>
      </div>

      <div class="clear bar">
        <img src="~assets/img/chat/disturb.png" alt="">
        <div class="border clear">
          <p>设置AI提醒时间</p>
          <div class="newButton">
            <new-button></new-button>
          </div>
        </div>
      </div>

      <div class="clear bar textarea">
        <img src="~assets/img/chat/remarks.png" alt="">
        <p>添加备注：</p>
        <textarea name="" id="" cols="30" rows="10"></textarea>
      </div>

      <div class="delete">
        <button>删除好友</button>
      </div>
    </div>
  </div>
</template>

<script>
import {request} from 'network/request.js'
import NewButton from 'components/chat/NewButton.vue'
export default {
  name: 'ChatInformation',
  components: {
    NewButton,
  },
  data() {
    return {
      message: {}
    }
  },
  methods: {
    imgURL(fileName) {
      return 'http://l423145x35.oicp.vip/file/' + fileName
    }
  },
  mounted () {
    switch (this.$store.state.type) {
      case 1: //单聊
        request({
          method: 'GET',
          url: 'http://l423145x35.oicp.vip/chatOne/otherIsEmployeeInChat',
          params: {
            relative_id: this.$store.state.otherPart.relative
          }
        }).then(response => {
          if (response.data.data) {
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
        break;
      case 2: //客服
      
        request({
          method: 'GET',
          url: 'http://l423145x35.oicp.vip/chatOne/getManInfo',
          params: {
            people_id: this.$store.state.otherPart.clientId,
            roleType: 1,
            firm_id: this.$store.state.company.firmId,
            me_id: this.$store.state.profile.id
          }
        }).then(response => {

          this.message = response.data.data
        })
        break;
      case 3: //群聊

        break;
    }
    
  },
}
</script>

<style lang="less" scoped>
  .information {
    width: 380px;
    .profile {
      padding: 0 28px;
      height: 280px;
      background: #FBFBFB;
      .photo {
        img {
          float: left;
          width: 40px;
          height: 40px;
          margin: 15px 25px;
        }
        p {
          float: right;
          font-size: 20px;
          line-height: 60px;
          font-family: 'Segoe UI';
          margin-right: 25px;
        }
        border-bottom: 1px solid rgba(112, 112, 112, 0.3);
      }
      .personInformation {
        .inf {

          line-height: 26px;
          p {
            float: left;
            font-size: 14px;
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
    }
    .manage {
      height: 320px;
      background: #FBFBFB;

      .bar {
        margin: 7px 20px;
        .border {
          margin-left: 30px;
          border-bottom: 1px solid rgba(112, 112, 112, 0.3);
          padding-bottom: 5px;
        }
        img {
          float: left;
          width: 16px;
        }
        p {
          font-size: 14px;
          line-height: 16px;
          float: left;
        }
        .newButton {
          float: right;
        }
      }
      .textarea {
        p {
          margin-left: 18px;
        }
        textarea {
          margin-top: 10px;
          resize: none;
          width: 330px;
          height: 80px;
          background: #FFFFFF;
          border: 1px solid rgba(112, 112, 112, 0.3);
          border-radius: 10px;
        }
      }
      .delete {
        width: 300px;
        margin: 0 auto;
        button {
          width: 300px;
          height: 35px;
          border: 1px solid rgba(112, 112, 112, 0.1);
          border-radius: 10px;
          font-size: 16px;
          font-family: 'Segoe UI';
          color: #FF3737;
        }
      }
    }
  }
</style>