<template>
  <div class="contactsList">
    <div class="search clearfix clear">
      <input type="text" name="search" placeholder="搜索" @keyup.enter="submit(search)" v-model="search">
    </div>
    <div class="list clearfix clear">
      <div class="cManage">
        <button>通讯录管理</button>
      </div>
      <div class="cFun">
        <div class="newFriend clear" @click="newFriend()">
          <img src="~assets/img/contacts/newFriend.png" alt="">
          <p>新朋友</p>
        </div>
        <div class="enterprise clear">
          <img src="~assets/img/contacts/enterprise.png" alt="">
          <p>企业通讯录</p>
        </div>
      </div>
      <div class="grouping">
        <p>分组</p>
        <div class="default">
          <div class="title clear" @click="expand()">
            <img src="~assets/img/contacts/expand.png" alt="expand" height="6px" v-if="isExpand">
            <img src="~assets/img/contacts/collapse.png" alt="collapse" width="6px" v-else>
            <div class="name">
              <p>默认分组</p>
            </div>
            <div class="status">
              <p>{{onlineSituation}}</p>
            </div>
          </div>
        </div>
        <div v-if="isExpand">
          <div v-for="(item, index) in contacts" :key="index" class="fList clear" @click="toContacts(index)">
            <div class="fPhoto">
              <img :src="getImg(item.profileImg)" alt="">
            </div>
            <div class="fName">
              <p>{{item.name}}</p>
            </div>
            <div class="fStatus">
              <p>{{status(item.online_status)}}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import {request} from 'network/request.js'
export default {
  name: 'ContactsList',
  methods: {
    submit(search) {
      
    },
    expand() {
      this.isExpand = !this.isExpand
    },
    getImg(filename) {
      return 'http://l423145x35.oicp.vip/file/' + filename
    },
    status(onlineStatus) {
      if (onlineStatus == 'true') {
        return '在线'
      } else {
        return '离线'
      }
    },
    toContacts(index) {
      if (this.$route.path.indexOf(this.contacts[index].peer_id) == -1) {
        this.$store.commit('setOtherPart', {
          talkName: this.contacts[index].name,
          linkUser: this.contacts[index].peer_id,
          profileImg: this.contacts[index].profileImg,
          relative: this.contacts[index].relativeId
        })
        this.$router.push('/contacts/' + this.contacts[index].peer_id)
      }
    },
    newFriend() {
      this.$router.push('/contacts/newfriend')
    }
  },
  data() {
    return {
      search: '',
      contacts: [],
      isExpand: false,
      onlineSituation: ''
    }
  },
  mounted () {
    request({
      method: 'GET',
      url: 'http://l423145x35.oicp.vip/chatOne/getFriendAndGroupList',
      params: {
        user_id: this.$store.state.profile.id,
        type: 1
      }
    }).then(response => {
      this.contacts = response.data.data
      let onlineCount = 0, totalCount = 0
      for (let i of this.contacts) {
        if (i.online_status == 'true') {
          onlineCount++
        }
        totalCount++
      }
      this.onlineSituation = onlineCount + '/' + totalCount
    })
  },
}
</script>

<style lang="less" scoped>

  @contactsListWidth: 300px;

  .contactsList {
    overflow: auto;
    position: absolute;
    height: calc(100vh - 40px);
    width: @contactsListWidth;
    border-right: 1px solid #e7e7e7;
  }
  .search {
    background-color: #FAFAFA;
    input {
      display: block;
      margin: 12px auto;
      width: 243px;
      height: 30px;
      background: #7070702c;
      border: 0px;
      border-radius: 10px;
    }
    input::-webkit-input-placeholder { 
      font-family: 'SegoeUI';
      background-image: url(~assets/img/chat/search.png);
      background-size: 18px;
      background-repeat: no-repeat;
      background-position-x: 80px;
      background-position-y: 5px;
      text-align: center;
      font-size: 16px;
      color: #707070;
    }
    input:-moz-placeholder { 
      font-family: 'SegoeUI';
      background-image: url(~assets/img/chat/search.png);
      background-size: 18px;
      background-repeat: no-repeat;
      background-position-x: 80px;
      background-position-y: 5px;
      text-align: center;
      font-size: 16px;
      color: #707070;
    } 
    input::-moz-placeholder { 
      font-family: 'SegoeUI';
      background-image: url(~assets/img/chat/search.png);
      background-size: 18px;
      background-repeat: no-repeat;
      background-position-x: 80px;
      background-position-y: 5px;
      text-align: center;
      font-size: 16px;
      color: #707070;
    } 
    input:-ms-input-placeholder { 
      font-family: 'SegoeUI';
      background-image: url(~assets/img/chat/search.png);
      background-size: 18px;
      background-repeat: no-repeat;
      background-position-x: 80px;
      background-position-y: 5px;
      text-align: center;
      font-size: 16px;
      color: #707070;
    }
  }
  .list {
    background-color: rgb(237, 237, 237);
    .cManage {
      width: 280px;
      margin: 20px auto;
      button {
        width: 280px;
        height: 50px;
        background: rgb(249, 249, 249);
        border: 1px solid rgba(112, 112, 112, 0.30);
        border-radius: 10px;
        font-size: 18px;
        
      }
    }
    .cFun {
      &>div {
        height: 50px;
        border-bottom: 1px solid rgb(212, 212, 212);
        img {
          margin: 10px 10px 10px 30px;
          width: 30px;
          float: left;
          
        }
        p {
          float: left;
          line-height: 50px;
        }
      }
      .newFriend {
        cursor: pointer;
      }
    }
    .grouping {
      &>p {
        margin-top: 20px;
        padding-left: 30px;
        padding-bottom: 5px;
        font-size: 16px;
        font-family: 'Segoe UI';
        font-weight: 400;
        line-height: 24px;
        border-bottom: 1px solid rgb(212, 212, 212);
      }
      .default {
        border-bottom: 1px solid rgb(212, 212, 212);
        .title {
          cursor: pointer;
          height: 30px;
          padding-left: 30px;
          padding-right: 20px;
          img {
            float: left;
            vertical-align: middle;
            margin: 10px 0;
            margin-right: 10px;
          }
          .name {
            float: left;
            p {
              font-size: 16px;
              line-height: 30px;
              font-family: 'Segoe UI';
            }
          }
          .status {
            float: right;
            p {
              font-size: 12px;
              line-height: 30px;
              font-family: 'Segoe UI';
              color: rgba(0, 0, 0, 0.6);
            }
          }
        }
      }
    }
    .fList {
      background-color: #f5f5f5;
      padding: 0 20px 0 30px;
      cursor: pointer;
      .fPhoto {
        float: left;
        img {
          width: 40px;
          border-radius: 5px;
          margin: 5px 5px 5px 0;
        }
      }

      .fName {
        float: left;
        line-height: 50px;
        
      }

      .fStatus {
        float: right;
        line-height: 50px;
        font-size: 12px;
        color: rgba(0, 0, 0, 0.6);
      }
    }
  }
  
</style>