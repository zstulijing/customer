<template>
  <div class="sessionList">
    <div class="search clearfix clear">
      <input type="text" name="search" placeholder="搜索" @keyup.enter="submit(search)" v-model="search">
    </div>
    <div class="list clearfix clear">
      <div class="button clear">
        <button @click="choose(1)" :class="isActive(1)">消息</button> 
        <button @click="choose(3)" :class="isActive(3)">群聊</button>
      </div>
      <div class="session">
        <div v-if="show[0]">

        </div>
        <div v-else-if="show[1]">
          <div class="briefList ai">
            <div v-if="ai != null" class="clear" @click="toAi()">
              <p class="newMessage" v-if="ai.newsLength != 0">{{ai.newsLength}}</p>
              <div class="briefList_photo">
                <img :src="imgURL(ai.aiProfileImg)" alt="">
              </div>
              <div class="briefList_talk">
                <p>{{ai.aiName}}</p>
                <p v-if="!ai.isnew">{{ai.talkMessage | cutMessage}}</p>
              </div>
              <div class="briefList_time">
                <p v-if="!ai.isnew">{{ai.talkTime | showDate}}</p>
              </div>
            </div>
          </div>

          <div class="briefList" v-for="(item, index) in friendList" :key="index">
            <div v-if="item != null" class="clear" @click="chatContent(index)">

              <p class="newMessage" v-if="item.data.data.news_length != 0">{{item.data.data.news_length}}</p>
              <div class="briefList_photo">
                <img :src="imgURL(item.data.data.profile_img)" alt="">
              </div>
              <div class="briefList_talk">
                <p>{{item.data.data.talk_name}}</p>
                <p>{{item.data.data.messege | cutMessage}}</p>
              </div>
              <div class="briefList_time">
                <p>{{item.data.data.create_time | showDate}}</p>
              </div>
            </div>

          </div>
        </div>
        
        <div v-else-if="show[3]">
          <div class="briefList" v-for="(item, index) in groupList" :key="index">
            <div v-if="item != null" class="clear" @click="chatContent(index)">

              <p class="newMessage" v-if="item.data.data.news_length != 0">{{item.data.data.news_length}}</p>
              <div class="briefList_photo">
                <img :src="imgURL(item.data.data.profile_img)" alt="">
              </div>
              <div class="briefList_talk">
                <p>{{item.data.data.talk_name}}</p>
                <p>{{item.data.data.messege | cutMessage}}</p>
              </div>
              <div class="briefList_time">
                <p>{{item.data.data.create_time | showDate}}</p>
              </div>
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
  name: 'SessionList',
  filters: {
    showDate(date) {
      if (date == null) {
        return ''
      }
      let YMD = date.split('T')[0].split('-')
  
      let now = new Date().toLocaleDateString().split('/')
      let num = 0; 
      for (let i = 0; i < YMD.length; i++){
        if (parseInt(YMD[i]) == parseInt(now[i])) {
          num ++;
        } 
      }
      if (num == YMD.length) {
        return date.split('T')[1].split(':')[0] + ':' +  date.split('T')[1].split(':')[1]
      } else if (parseInt(YMD[0]) != parseInt(now[0])){
        return date.split('T')[0].split('-')[0]
      } else {
        return date.split('T')[0].split('-')[1] + '-' + date.split('T')[0].split('-')[2]
      }
    },
    cutMessage(message) {
      if (message == null) {
        return ''
      }
      if (message.length >= 13) {
        return message.substring(0, 13) + '...'
      } else {
        return message
      }
    }
  },
  data() {
    return {
      show: [false, true, false, false],
      search: '',

      friendList: [],
      friendRelativeId: [],

      groupList: [],
      groupRelativeId: [],

      chooseNow: 1,

      intervalNum: 0,
      
      ai: {}
    }
  },
  methods: {
    submit(search) {
      
    },
    choose(num) {
      this.chooseNow = num
      this.$store.commit('setType', num)
      for (let i = 0; i < this.show.length; i++) {
        if (i == num) {
          this.show[i] = true
        } else {
          this.show[i] = false
        }
      }
    },
    isActive(num) {
      if (num == this.chooseNow) {
        return {active: true}
      } else {
        return {active: false}
      }
    },
    imgURL(fileName) {
      // return 'http://l423145x35.oicp.vip/file/' + fileName
      return `http://l423145x35.oicp.vip/config/download?annexName=${fileName}&type=%E7%BC%A9%E7%95%A5%E5%9B%BE`
    },
    chatContent(index) {
      switch (this.chooseNow) {
        case 0:
          
          break;

        case 1: //好友
          if (this.$route.path.indexOf(this.friendList[index].data.data.link_user) == -1) {
            this.$store.state.type = 1
            this.$store.commit('setOtherPart', {
              talkName: this.friendList[index].data.data.talk_name,
              linkUser: this.friendList[index].data.data.link_user,
              profileImg: this.friendList[index].data.data.profile_img,
              relative: this.friendRelativeId[index]
            })
            request({
              method: 'GET',
              url: 'http://l423145x35.oicp.vip/chatOne/hasReadHistory',
              params: {
                relative_id: this.friendRelativeId[index],
                type: 1
              }
            }).then(response => {
              this.friendList[index].data.data.news_length = 0
              this.$router.push('/chat/' + this.friendList[index].data.data.link_user)
            })
          }
          break;

        case 3: //群聊
          if (this.$route.path.indexOf(this.groupList[index].data.data.peer_id) == -1) {
            this.$store.commit('setOtherPart', {
              talkName: this.groupList[index].data.data.talk_name,
              linkUser: this.groupList[index].data.data.peer_id,
              profileImg: this.groupList[index].data.data.profile_img,
              relative: this.groupRelativeId[index]
            })
            request({
              method: 'GET',
              url: 'http://l423145x35.oicp.vip/chatOne/hasReadHistory',
              params: {
                relative_id: this.groupRelativeId[index],
                type: 2
              }
            }).then(response => {
              this.groupList[index].data.data.news_length = 0
              this.$router.push('/chat/' + this.groupList[index].data.data.peer_id)
            })
          }
          break;
      }
      
    },
    friendListUpdate() { //单聊列表更新
      request({
        method: 'GET',
        url: 'http://l423145x35.oicp.vip/chat/RecenttalkListBySort',
        params: {
          user_id: this.$store.state.profile.id,
          type: 1
        }
      }).then(response => {
        let all = []
        for (let i in response.data.data) {
          this.friendRelativeId[i] = response.data.data[i].imRecenttalk.relative
          all.push(request({
            method: 'GET',
            url: 'http://l423145x35.oicp.vip/chat/getNewHisByRelativeId',
            params: {
              type: 1,
              relative_id: response.data.data[i].imRecenttalk.relative
            }
          }))
        }
        Promise.all(all).then(response => {
          this.friendList = response
        })
      })
    },
    groupListUpdate() { //群聊列表更新
      request({
        method: 'GET',
        url: 'http://l423145x35.oicp.vip/chat/RecenttalkListBySort',
        params: {
          user_id: this.$store.state.profile.id,
          type: 2
        }
      }).then(response => {
        let all = []
        for (let i in response.data.data) {
          this.serviceRelativeId[i] = response.data.data[i].imRecenttalk.relative
          all.push(request({
            method: 'GET',
            url: 'http://l423145x35.oicp.vip/chat/getNewHisByRelativeId',
            params: {
              type: 2,
              relative_id: response.data.data[i].imRecenttalk.relative
            }
          }))
        }
        Promise.all(all).then(response => {
          this.groupList = response
        })
      })
    },
    serviceListUpdate() { //客服列表更新
      request({
        method: 'GET',
        url: 'http://l423145x35.oicp.vip/chattwo/getClientServiceNews',
        params: {
          people_id: this.$store.state.profile.id,
          firm_id: '26607242283450368'
        }
      }).then(response => {
        this.ai = response.data.data
      })
    },
    getSessionList() { //单聊
      request({
        method: 'GET',
        url: 'http://l423145x35.oicp.vip/chat/RecenttalkListBySort',
        params: {
          user_id: this.$store.state.profile.id,
          type: 1
        }
      }).then(response => {
        let mesLength = response.data.data.length
        this.friendList = new Array(mesLength)
        let all = []
        for (let i in response.data.data) {
          this.friendRelativeId[i] = response.data.data[i].imRecenttalk.relative
          all.push(request({
            method: 'GET',
            url: 'http://l423145x35.oicp.vip/chat/getNewHisByRelativeId',
            params: {
              type: 1,
              relative_id: response.data.data[i].imRecenttalk.relative
            }
          }))
        }
        Promise.all(all).then(response => {
          this.friendList = response
        })
      })
    },
    getGroupList() { //群聊
      request({
        method: 'GET',
        url: 'http://l423145x35.oicp.vip/chat/RecenttalkListBySort',
        params: {
          user_id: this.$store.state.profile.id,
          type: 2
        }
      }).then(response => {
        let mesLength = response.data.data.length
        this.groupList = new Array(mesLength)
        let all = []
        for (let i in response.data.data) {
          this.groupRelativeId[i] = response.data.data[i].imRecenttalk.relative
          all.push(request({
            method: 'GET',
            url: 'http://l423145x35.oicp.vip/chat/getNewHisByRelativeId',
            params: {
              type: 2,
              relative_id: response.data.data[i].imRecenttalk.relative
            }
          }))
        }
        Promise.all(all).then(response => {
          this.groupList = response
        })
      })
    },
    toAi() {
      this.$store.state.type = 4
      if (this.$route.path.indexOf('aiRobot') == -1) {
        request({
          method: 'GET',
          url: 'http://l423145x35.oicp.vip/im-servicechat-relation/clinetCreateRelation',
          params: {
            client_id: this.$store.state.profile.id,
            firm_id: '26607242283450368'
          }
        }).then(response => {
          let otherPart = response.data.data
          otherPart.talkName = this.ai.aiName
          otherPart.linkUser = 'aiRobot',
          otherPart.profileImg = this.ai.aiProfileImg,
          otherPart.relative = response.data.data.selfRelative
          this.$store.commit('setOtherPart', otherPart)
          return request({
            method: 'GET',
            url: 'http://l423145x35.oicp.vip/chatOne/hasReadHistory',
            params: {
              relative_id: otherPart.selfRelative,
              type: 3
            }
          })
        }).then(response => {
          this.ai.newsLength = 0
          this.$router.push('/chat/aiRobot')
        })

      }
    }
  },
  mounted () {
    this.getSessionList()
    this.getGroupList()
    this.serviceListUpdate()
    this.intervalNum = setInterval(() => {
      request({
        method: 'GET',
        url: 'http://l423145x35.oicp.vip/chatOne/getMesBool',
        params: {
          me_id: this.$store.state.profile.id
        }
      }).then(response => {
        if (response.data.data.flag == true) {

          for (let i of response.data.data.relation_list) {
            if (i == this.$store.state.otherPart.relative) { //单聊
              this.$emit('update', '')
            }
          }
          if (response.data.data.relation_list.length != 0) {
            this.friendListUpdate()
          }

          for (let i of response.data.data.group_relation) { //群聊
            if (i == this.$store.state.otherPart.relative) {
              this.$emit('update', '')
            }
          }
          if (response.data.data.group_relation.length != 0) {
            this.groupListUpdate()
          }

          let onlineBroadcast = []
          let serveBroadcast = []
          let transferBroadcast = []
          for (let i of response.data.data.broadcast) {
            if (i.type == 1) {
              onlineBroadcast.push(i)
            } else if (i.type == 5) { //有客服消息
              serveBroadcast.push(i)
            } else if (i.type == 4) { //客服转接
              transferBroadcast.push(i)
            }
          }
          if (this.$store.state.type == 4) {
            this.$emit('update', '')
          }
          if (serveBroadcast.length != 0) {
            this.serviceListUpdate()
          }
          if (transferBroadcast.length != 0) {
            if (this.$store.state.type == 4) {
              request({
                method: 'GET',
                url: 'http://l423145x35.oicp.vip/im-servicechat-relation/clinetCreateRelation',
                params: {
                  client_id: this.$store.state.profile.id,
                  firm_id: '26607242283450368'
                }
              }).then(response => {
                this.serviceListUpdate()
                this.$emit('update', '')
              })
            }
          }
          this.$emit('prompt', onlineBroadcast)
        }
      }).catch((err) => {
        clearInterval(this.intervalNum)
      })
    }, 100);
  },
  destroyed() {
    clearInterval(this.intervalNum)
  }
}
</script>

<style lang="less" scoped>

  @sessionListWidth: 300px;

  .sessionList {
    overflow: auto;
    position: absolute;
    height: calc(100vh - 40px);
    width: @sessionListWidth;
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
    border-top: 1px solid #e7e7e7;
    background-color: #F5F5F5;
    .button {
      margin: 8px 10px;
      button {
        padding: 4px 10px;
        float: left;
        outline: none;
        border: none;
        color: #313131;
        font-size: 16px;
        border-radius: 10px;
        background-color: #F5F5F5;
        margin-right: 7px;
      }
      &>button:last-child {
         margin-right: 0px;
      }
    }
    .session {
      .ai {
        background-color: #E3E3E3;
      }
      .briefList:hover {
        background-color: #C8C8C8;
      }
      .briefList {
        &>div:nth-child(1) {
          position: relative;
          .newMessage {
            position: absolute;
            width: 15px;
            height: 15px;
            border-radius: 50%;
            left: 45px;
            top: 1px;
            background-color: rgb(250, 81, 81);
            text-align: center;
            line-height: 15px;
            color: #fff;
            font-size: 10px;
          }
        }
        cursor: pointer;
        height: 64px;
        .briefList_photo {
          float: left;
          img {
            width: 40px;
            height: 40px;
            border: 2px solid #707070;
            border-radius: 5px;
            margin: 10px;
          }
        }
        .briefList_talk {
          float: left;
          margin-top: 10px;
          &>p:nth-child(2) {
            font-size: 12px;
            margin-top: 10px;
          }

        }
        .briefList_time {
          float: right;
          margin: 20px 10px 0 0;
          color: #707070;
          font-size: 10px;
        }
      }
    }  
  }
  .list .button .active {
    color: #3875C5;
    background-color: #3875c53a;
  }
  .state {
    margin: 0 auto;
    width: 230px;
    height: 25px;
    
    &>div:nth-child(1) {
      float: left;
      margin-top: 3px;
      &>div {
        float: left;
      }
      .onlineStateSpare {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #00A00B;
        margin: 3px 5px 0 0;
      }
      .onlineStateBusy {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: rgb(253, 86, 60);
        margin: 3px 5px 0 0;
      }
    }
    &>div:nth-child(2) {
      cursor: pointer;
      float: right;
      width: 40px;
      height: 20px;
      border-radius: 10px;
      line-height: 20px;
      margin-left: 10px;
      text-align: center;
    }
    &>div:nth-child(3) {
      cursor: pointer;
      float: right;
      width: 40px;
      height: 20px;
      text-align: center;
     
      border-radius: 10px;
      line-height: 20px;
    }
    &>div.normal {
      color: rgba(0, 0, 0, 0.5);
    }
    &>div.busy {
      background: rgb(253, 86, 60);
      border: 1px solid rgba(112, 112, 112, 0.2);
    }
    &>div.spare {
      background: #00a00ba8;
      border: 1px solid rgba(112, 112, 112, 0.2);
    }
  }
</style>
