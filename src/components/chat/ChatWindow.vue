<template>
  <div class="window clear">
    <div class="dialogue">
      <div class="chatbox clearfix" ref="chatbox">
        <div class="more clear">
          <div v-if="current != 1">
            <img src="~assets/img/chat/moreHistory.png" alt="">
            <p @click="more()">查看更多记录</p>
          </div>
        </div>
        <div v-for="(record, index) in records" :key="index">
          <div v-if="record != null">
            <div v-if="judgeDirection(record) == 1">
              <chat-record-left :type="record.type" >
                <img :src="imgURL(people[index].profileImg)" alt="" slot="head">
                <p v-if="$store.state.type == 3" slot="name">{{people[index].name}}</p>
                <p v-if="record.type == 1" slot="text">{{record.content}}</p>
                <img v-else-if="record.type == 2" :src="imgURL(record.savePath)" alt="" slot="emoji">

                <div v-else-if="record.type == 5" slot="file" class="clear" @click="download(record.savePath)">
                  <img :src="extension(record)">
                  <div>
                    <p>{{record.fileName | brief}}</p>
                    <p>{{record.content}}</p>
                  </div>
                </div>

                <div v-else-if="record.type == 6" slot="ai" class="clear">
                  <p>请选择您需要咨询的问题:</p>
                  <ul>
                    <li v-for="(item, num) in record.content.split('+')" :key="num" class="clear" @click="answer(item)">
                      <img src="~assets/img/chat/click.png" alt="">
                      <p>{{item}}</p>
                    </li>
                  </ul>
                  
                </div>

              </chat-record-left>
            </div>

            <div v-if="judgeDirection(record) == 2">
              <chat-record-right :type="record.type" >
                <img :src="imgURL(people[index].profileImg)" alt="" slot="head">
                <p v-if="record.type == 1" slot="text">{{record.content}}</p>
                <img v-else-if="record.type == 2" :src="imgURL(record.savePath)" alt="" slot="emoji">

                <div v-else-if="record.type == 5" slot="file" class="clear" @click="download(record.savePath)">
                  <img :src="extension(record)">
                  <div>
                    <p>{{record.fileName | brief}}</p>
                    <p>{{record.content}}</p>
                  </div>
                </div>
              </chat-record-right>
            </div>

            <div v-if="judgeDirection(record) == 3">
              <chat-record-center>
                <p v-if="record.systemPrompt" slot="system">{{record.systemPrompt}}</p>
              </chat-record-center>
            </div>

          </div>
        </div>
      </div>
      <div class="send">
        <div class="ai clear" v-if="$store.state.type == 4">
          <p @click="toArtificialCustomer()">人工客服</p>
          <p>最新活动</p>
          <p>服务评价</p>
          <p>热门课程</p>
          <p>购买须知</p>
        </div>
        <div class="fun clear">
          <div><img src="~assets/img/chat/emoji.png" alt=""></div>
          <div><img src="~assets/img/chat/screenshot.png" alt=""></div>
          <div><img src="~assets/img/chat/document.png" alt="" @click="upload()"></div>
          <div><img src="~assets/img/chat/commonWords.png" alt=""></div>
          <div><img src="~assets/img/chat/history.png" alt=""></div>
          <input type="file" style="display: none" ref="file">
        </div>
        <textarea cols="30" rows="10" v-model="sendMessage" @keyup.enter="send()" @focus="input = true" @blur="input = false" @keydown.enter="input = false"></textarea>
        <div class="button clear"><button @click="send()">发送(S)</button></div>
      </div>
    </div>

    <div class="chatFunction">
      <div class="cFuntion clear">
        <div @click="userMessage()">
          <p :class="{active: isUserMessage}" v-if="type == 3">群聊信息</p>
          <p :class="{active: isUserMessage}" v-else>用户信息</p>
        </div>
        <div @click="knowledgeBase()">
          <p :class="{active: isKnowledgeBase}">知识库搜索</p></div>
        <div @click="quickReply()">
          <p :class="{active: isQuickReply}">快捷回复</p>
        </div>
      </div>

      <chat-information v-if="isUserMessage"></chat-information>
      <knowledge-base v-if="isKnowledgeBase" @quickReplySend="quickReplySend($event)"></knowledge-base>
      <quick-reply v-if="isQuickReply" @quickReplySend="quickReplySend($event)"></quick-reply>
    </div>

  </div>
</template>

<script>

import {request} from 'network/request.js'
import ChatRecordLeft from 'components/chat/ChatRecordLeft.vue'
import ChatRecordRight from 'components/chat/ChatRecordRight.vue'
import ChatRecordCenter from 'components/chat/ChatRecordCenter.vue'
import ChatInformation from 'components/chat/ChatInformation.vue'
import knowledgeBase from 'components/chat/KnowledgeBase.vue'
import QuickReply from 'components/chat/QuickReply.vue'
import axios from 'axios'

export default {
  name: 'ChatWindow',
  components: {
    ChatRecordLeft,
    ChatRecordRight,
    ChatRecordCenter,
    ChatInformation,
    knowledgeBase,
    QuickReply
  },
  filters: {
    brief(name) {
      if (name.lastIndexOf('.') > 9) {
        let sub1 = name.substr(0, name.lastIndexOf('.'))
        let sub2 = sub1.slice(0, 6) + '...' + sub1[sub1.length - 1] 
        return sub2 + name.substr(name.lastIndexOf('.'))
      } else {
        return name
      }
    },
    fileSize(size) {
      if (size >= 1024) {
        return Math.round(parseInt(size / 1024)) + ' MB'
      } else {
        return size + ' B'
      }
    }
  },
  data() {
    return {
      records: [],
      myId: this.$store.state.profile.id,
      source_id: this.$route.params.id,
      myPhoto: this.$store.state.profile.profileImg,
      message: {},
      isLeft: true,
      isRight: true,
      sendMessage: '',
      isUserMessage: true,
      isKnowledgeBase: false,
      isQuickReply: false,
      type: 0,
      people: [],
      current: 0,
      total: 0,
      scrollHeight: 0,
      input: false
    }
  },
  methods: {
    imgURL(fileName) {
      // return 'http://l423145x35.oicp.vip/file/' + fileName
      return `http://l423145x35.oicp.vip/config/download?annexName=${fileName}&type=%E7%BC%A9%E7%95%A5%E5%9B%BE`
    },
    judgeDirection(record) {
      if (record.type == 0) { //系统消息
        this.isLeft = false
        this.isRight = false
        return 3

      }
      else { //文字消息
        if (this.$store.state.type == 1 || this.$store.state.type == 3) {//单聊|群聊
          if (record.sendId == this.myId) {
            this.isLeft = false
            this.isRight = true
            return 2
          } else {
            this.isLeft = true
            this.isRight = false
            return 1
          }
        } else if (this.$store.state.type == 4) {
          if (record.sendId != this.$store.state.profile.id) {
            this.isLeft = true
            this.isRight = false
            return 1
          } else {
            this.isLeft = false
            this.isRight = true
            return 2
          }
        }
      } 
    },
    addTag() {
      
    },
    send() {
      let sendMessage = this.sendMessage
      this.sendMessage = ''
      switch (this.$store.state.type) {
        case 1: //单聊
          request({
            method: 'GET',
            url: 'http://l423145x35.oicp.vip/chat/sendInfoInChat',
            params: {
              sendId: this.$store.state.profile.id,
              receiveId: this.$store.state.otherPart.linkUser,
              content: sendMessage,
              type: 1,
              firmId: this.$store.state.company.firmId
            }
          }).then(response => {
            this.$emit('send')
            request({
              method: 'GET',
              url: 'http://l423145x35.oicp.vip/chat/getThreeChatInfo',
              params: {
                source_id: this.source_id,
                type: 1,
                me_id: this.myId
              }
            }).then(response => {
              this.records = response.data.data.history.records
              this.people = response.data.data.people
            })
          })
          break;
        case 4: //客服
          if (this.$store.state.otherPart.currentRelative.id == this.$store.state.otherPart.selfRelative) {
            //ai
            request({
              method: 'GET',
              url: 'http://l423145x35.oicp.vip/im-servicechat-history/add',
              params: {
                relativeId: this.$store.state.otherPart.currentRelative.id,
                sendId: this.$store.state.profile.id,
                agentId: this.$store.state.otherPart.currentRelative.agentId,
                type: 1,
                content: sendMessage,
                serviceKey: this.$store.state.otherPart.currentRelative.serviceKey,
                clientId: this.$store.state.otherPart.currentRelative.clientId,
              }
            }).then(response => {
              return request({
                method: 'GET',
                url: 'http://l423145x35.oicp.vip/im-servicechat-history/aiResponse',
                params: {
                  words: sendMessage,
                  firm_id: '26607242283450368',
                  service_relative: this.$store.state.otherPart.relative
                }
              })
            }).then(response => {
              this.$emit('send')
              request({
                method: 'GET',
                url: 'http://l423145x35.oicp.vip/chat/getThreeChatInfo',
                params: {
                  firm_id: '26607242283450368',
                  type: 4,
                  me_id: this.myId
                }
              }).then(response => {
                this.records = response.data.data.history.records
                this.people = response.data.data.people
              })
            })
          } else {
            request({
              method: 'GET',
              url: 'http://l423145x35.oicp.vip/im-servicechat-history/add',
              params: {
                relativeId: this.$store.state.otherPart.currentRelative.id,
                sendId: this.$store.state.profile.id,
                agentId: this.$store.state.otherPart.currentRelative.agentId,
                type: 1,
                content: sendMessage,
                serviceKey: this.$store.state.otherPart.currentRelative.serviceKey,
                clientId: this.$store.state.otherPart.currentRelative.clientId,
              }
            }).then(response => {
              this.$emit('send')
              request({
                method: 'GET',
                url: 'http://l423145x35.oicp.vip/chat/getThreeChatInfo',
                params: {
                  firm_id: '26607242283450368',
                  type: 4,
                  me_id: this.myId
                }
              }).then(response => {
                this.records = response.data.data.history.records
                this.people = response.data.data.people
              })
            })
          }

          break;
        case 3: //群聊
          request({
            method: 'GET',
            url: 'http://l423145x35.oicp.vip/chat/sendInfoInGroup',
            params: {
              sendId: this.$store.state.profile.id,
              groupId: this.$store.state.otherPart.linkUser,
              content: sendMessage,
              type: 1
            }
          }).then(response => {
            this.$emit('send')
            request({
              method: 'GET',
              url: 'http://l423145x35.oicp.vip/chat/getThreeChatInfo',
              params: {
                source_id: this.source_id,
                type: 2,
                me_id: this.myId
              }
            }).then(response => {
              this.records = response.data.data.history.records
              this.people = response.data.data.people
            })
          })
          break;
      }
    },
    userMessage() {
      this.isUserMessage = true,
      this.isKnowledgeBase = false,
      this.isQuickReply = false
    },
    knowledgeBase() {
      this.isUserMessage = false,
      this.isKnowledgeBase = true,
      this.isQuickReply = false
    },
    quickReply() {
      this.isUserMessage = false,
      this.isKnowledgeBase = false,
      this.isQuickReply = true
    },
    quickReplySend(quickReply) {
      if (quickReply.type == 1) {
        this.sendMessage = quickReply.quickReply
        this.send()
      }
    },
    update() {
      switch (this.$store.state.type) {
        case 1: //单聊
          request({
            method: 'GET',
            url: 'http://l423145x35.oicp.vip/chatOne/hasReadHistory',
            params: {
              relative_id: this.$store.state.otherPart.relative,
              type: 1
            }
          }).then(response => {
            request({
              method: 'GET',
              url: 'http://l423145x35.oicp.vip/chat/getThreeChatInfo',
              params: {
                source_id: this.source_id,
                type: 1,
                me_id: this.myId
              }
            }).then(response => {
              this.records = response.data.data.history.records
              this.people = response.data.data.people
            })
          })
          break;

        case 4: //客服
          request({
            method: 'GET',
            url: 'http://l423145x35.oicp.vip/chatOne/hasReadHistory',
            params: {
              relative_id: this.$store.state.otherPart.selfRelative,
              type: 3
            }
          }).then(response => {
            request({
              method: 'GET',
              url: 'http://l423145x35.oicp.vip/chat/getThreeChatInfo',
              params: {
                firm_id: '26607242283450368',
                type: 4,
                me_id: this.myId
              }
            }).then(response => {
              this.records = response.data.data.history.records
              this.people = response.data.data.people
            })
          })
          break;

        case 3: //群聊
          request({
            method: 'GET',
            url: 'http://l423145x35.oicp.vip/chatOne/hasReadHistory',
            params: {
              relative_id: this.$store.state.otherPart.relative,
              type: 2
            }
          }).then(response => {
            request({
              method: 'GET',
              url: 'http://l423145x35.oicp.vip/chat/getThreeChatInfo',
              params: {
                source_id: this.source_id,
                type: 2,
                me_id: this.myId
              }
            }).then(response => {
              this.records = response.data.data.history.records
              this.people = response.data.data.people
            })
          })
          break;
      }
    },
    upload() {
      let file = this.$refs.file
      file.click()
    },
    extension(record) {
      let suffix = record.savePath.split('.').pop()
      switch (suffix) {
        case 'rar':
        case '7z':
        case 'zip':
          return require('../../assets/img/file/rar.png')

        case 'doc':
        case 'docx':
          return require('../../assets/img/file/doc.png')

        case 'mp3':
        case 'wav':
          return require('../../assets/img/file/mp3.png')

        case 'pdf':
          return require('../../assets/img/file/pdf.png')
        
        case 'ppt':
        case 'pptx':
          return require('../../assets/img/file/ppt.png')

        case 'xls':
        case 'xlsx':
          return require('../../assets/img/file/xls.png')
        
        case 'txt':
          return require('../../assets/img/file/txt.png')

        default:
          return require('../../assets/img/file/null.png')
      }

    },
    download(savePath) {
      let url ='http://l423145x35.oicp.vip/file/' + savePath;
      const downloadRes = async () => {
        let response = await fetch(url); // 内容转变成blob地址
        let blob = await response.blob();  // 创建隐藏的可下载链接
        let objectUrl = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = objectUrl;
        a.download = name;
        a.click()
        a.remove(); 
    }
    downloadRes();
    },
    answer(question) {
      let sendMessage = question
      request({
        method: 'GET',
        url: 'http://l423145x35.oicp.vip/im-servicechat-history/add',
        params: {
          relativeId: this.$store.state.otherPart.currentRelative.id,
          sendId: this.$store.state.profile.id,
          agentId: this.$store.state.otherPart.currentRelative.agentId,
          type: 1,
          content: sendMessage,
          serviceKey: this.$store.state.otherPart.currentRelative.serviceKey,
          clientId: this.$store.state.otherPart.currentRelative.clientId,
        }
      }).then(response => {
        return request({
          method: 'GET',
          url: 'http://l423145x35.oicp.vip/im-servicechat-history/aiResponse',
          params: {
            words: question,
            firm_id: '26607242283450368',
            service_relative: this.$store.state.otherPart.relative
          }
        })
      }).then(response => {
        this.$emit('send')
        request({
          method: 'GET',
          url: 'http://l423145x35.oicp.vip/chat/getThreeChatInfo',
          params: {
            firm_id: '26607242283450368',
            type: 4,
            me_id: this.myId
          }
        }).then(response => {
          this.records = response.data.data.history.records
          this.people = response.data.data.people
        })
      })
    },
    toArtificialCustomer() {
      request({
        method: 'GET',
        url: 'http://l423145x35.oicp.vip/chat/getAgentInService',
        params: {
          firm_id: '26607242283450368',
          israndom: true
        }
      }).then(response => {

        return request({
          method: 'GET',
          url: 'http://l423145x35.oicp.vip/im-servicechat-relation/changeRelation',
          params: {
            key: this.$store.state.otherPart.currentRelative.serviceKey,
            agent_id: response.data.data.id
          }
        })
      })
    },
    more() {
      if (this.current > 1) {
        this.current--
        switch (this.$store.state.type) {
          case 1: //单聊
            request({
              method: 'GET',
              url: 'http://l423145x35.oicp.vip/chat/getThreeChatInfo',
              params: {
                source_id: this.source_id,
                type: 1,
                me_id: this.myId,
                pageNum: this.current
              }
            }).then(response => {
              
              this.scrollHeight = this.$refs.chatbox.scrollHeight
              // for (let i = response.data.data.history.records.length; i >= 0; i--) {
              //   this.records.unshift(response.data.data.history.records[i])
              //   this.people.unshift(response.data.data.people[i])
              // }
              this.current = response.data.data.history.current
              this.records = response.data.data.history.records.concat(this.records)
              this.people = response.data.data.people.concat(this.people)
            })
            break;
          case 4: //客服
            request({
              method: 'GET',
              url: 'http://l423145x35.oicp.vip/chat/getThreeChatInfo',
              params: {
                firm_id: '26607242283450368',
                type: 4,
                me_id: this.myId,
                pageNum: this.current
              }
            }).then(response => {
              this.scrollHeight = this.$refs.chatbox.scrollHeight
              this.current = response.data.data.history.current
              this.records = response.data.data.history.records.concat(this.records)
              this.people = response.data.data.people.concat(this.people)
            })
            break;
          case 3: //群聊
            request({
              method: 'GET',
              url: 'http://l423145x35.oicp.vip/chat/getThreeChatInfo',
              params: {
                source_id: this.source_id,
                type: 2,
                me_id: this.myId,
                pageNum: this.current
              }
            }).then(response => {
              this.scrollHeight = this.$refs.chatbox.scrollHeight
              this.current = response.data.data.history.current
              this.records = response.data.data.history.records.concat(this.records)
              this.people = response.data.data.people.concat(this.people)
            })
            break;
        }
      }
    }
  },
  mounted() {
    this.$refs.chatbox.scrollTop = this.$refs.chatbox.scrollHeight
    this.type = this.$store.state.type
    let input = this.$refs.file
    input.onchange = () => {
      let file = input.files[0]
      let filename = file.name.substr(file.name.lastIndexOf('.'));
      let content = ''
      let type = 0

      if (filename == '.jpg' || filename == '.gif' || filename == '.png' || filename == '.jpeg') {
        type = 2
      } else {
        type = 5
        if (file.size > 1024) {
          content = (parseInt(file.size) / 1024).toFixed(2) + 'KB'
        } else {
          content = file.size + 'B'
        }
      }
      
      let params = new FormData()
      params.append('file', file)
      axios.post('http://l423145x35.oicp.vip/uploadDownload/uploadImage', params, {headers: {'Content-Type': 'multipart/form-data'}}).then(response => {
        let localName = file.name
        let fileName = response.data.data;
        switch (this.$store.state.type) {
          case 1: //单聊
          request({
            method: 'GET',
            url: 'http://l423145x35.oicp.vip/chat/sendInfoInChat',
            params: {
              sendId: this.$store.state.profile.id,
              receiveId: this.$store.state.otherPart.linkUser,
              type: type,
              firmId: this.$store.state.company.firmId,
              content: content,
              fileName: localName,
              savePath: fileName
            }
          }).then(response => { //得到新消息
            this.$emit('send')
            request({
              method: 'GET',
              url: 'http://l423145x35.oicp.vip/chat/getThreeChatInfo',
              params: {
                source_id: this.source_id,
                type: 1,
                me_id: this.myId
              }
            }).then(response => {
              this.records = response.data.data.records
              this.people = response.data.data.people
            })
          })
          break;

          case 4: //客服
          //TODO:modify
          request({
            method: 'GET',
            url: 'http://l423145x35.oicp.vip/im-servicechat-history/add',
            params: {
              relativeId: this.$store.state.otherPart.currentRelative.id,
              sendId: this.$store.state.profile.id,
              agentId: this.$store.state.otherPart.currentRelative.agentId,
              type: type,
              serviceKey: this.$store.state.otherPart.currentRelative.serviceKey,
              content: content,
              fileName: localName,
              savePath: fileName,
              clientId: this.$store.state.otherPart.currentRelative.clientId,
            }
          }).then(response => {
            console.log(response);
            this.$emit('send')
            request({
              method: 'GET',
              url: 'http://l423145x35.oicp.vip/chat/getThreeChatInfo',
              params: {
                firm_id: '26607242283450368',
                type: 4,
                me_id: this.myId
              }
            }).then(response => {
              this.records = response.data.data.history.records
              this.people = response.data.data.people
            })
          })

          break;

          case 3: //群聊
          request({
            method: 'GET',
            url: 'http://l423145x35.oicp.vip/chat/sendInfoInGroup',
            params: {
              sendId: this.$store.state.profile.id,
              groupId: this.$store.state.otherPart.linkUser,
              type: type,
              fileName: localName,
              savePath: fileName,
              content: content           
            }
          }).then(response => {
            this.$emit('send')
            request({
              method: 'GET',
              url: 'http://l423145x35.oicp.vip/chat/getThreeChatInfo',
              params: {
                source_id: this.source_id,
                type: 2,
                me_id: this.myId
              }
            }).then(response => {
              this.records = response.data.data.history.records
              this.people = response.data.data.people
            })
          })
          break;
        }
      })
    }   
    if (this.source_id != null) {
      switch (this.$store.state.type) {
        case 1: //单聊
          request({
            method: 'GET',
            url: 'http://l423145x35.oicp.vip/chat/getThreeChatInfo',
            params: {
              source_id: this.source_id,
              type: 1,
              me_id: this.myId
            }
          }).then(response => {
            this.current = response.data.data.history.current
            this.total = response.data.data.history.pages
            this.records = response.data.data.history.records
            this.people = response.data.data.people
          })
          break;
        case 4: //客服
          request({
            method: 'GET',
            url: 'http://l423145x35.oicp.vip/chat/getThreeChatInfo',
            params: {
              firm_id: '26607242283450368',
              type: 4,
              me_id: this.myId
            }
          }).then(response => {
            this.current = response.data.data.history.current
            this.total = response.data.data.history.pages
            this.records = response.data.data.history.records
            this.people = response.data.data.people
          })
          break;
        case 3: //群聊
          request({
            method: 'GET',
            url: 'http://l423145x35.oicp.vip/chat/getThreeChatInfo',
            params: {
              source_id: this.source_id,
              type: 2,
              me_id: this.myId
            }
          }).then(response => {
            this.current = response.data.data.history.current
            this.total = response.data.data.history.pages
            this.records = response.data.data.history.records
            this.people = response.data.data.people
          })
          break;
      }
    }
  },
  updated() {
    if (!this.input) {
      if (this.current == this.total) {
        this.$refs.chatbox.scrollTop = this.$refs.chatbox.scrollHeight
      } else {
        this.$refs.chatbox.scrollTop = this.$refs.chatbox.scrollHeight - this.scrollHeight
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .window {
    height: 100%;
  }
  .dialogue {
    float: left;
    margin-right: 15px;
    height: calc(100vh - 100px);
    box-sizing: border-box;
    border: 1px solid rgba(112, 112, 112, 0.3);
    border-radius: 0px 10px 0px 0px; 
    .chatbox {
      box-sizing: border-box;
      padding: 0 45px 20px 50px;
      width: 750px;
      height: 450px;
      background: rgb(248, 248, 248);
      overflow: auto;
      .more {
        cursor: pointer;
        width: 100px;
        text-align: center;
        margin: 0 auto;
        img {
          float: left;
          width: 12px;
          margin-right: 5px;
        }
        p {
          float: left;
          color: #45C4F4;
          font-size: 12px;
        }
      }
    }
    .send {
      padding: 20px 30px 5px 30px;
      background-color: #fafafa;
      position: relative;
      .ai {
        top: -20px;
        position: absolute;
        width: 690px;
        background-color: #FAFAFA;
        opacity: 0.8;
        height: 30px;
        &>p {
          cursor: pointer;
          float: left;
          padding: 5px;
          border-radius: 10px;
          border: 1px solid #bdbdbd;
          color: #686868;
          font-size: 14px;
          margin-right: 10px;
        }
      }
      .fun {
        div {
          float: left;
          margin-right: 23px;
          img {
            width: 20px;
            cursor: pointer;
          }
        }
        &>div:last-child {
          float: right;
          margin-right: 0;
        }
      }
      textarea {
        padding-top: 10px;
        width: 100%;
        height: 100px;
        border: none;
        resize: none;
        font-size: 18px;
        background-color: #fafafa;
      }
      .button {
        button {
          float: right;
          width: 80px;
          height: 40px;
          background: #F5F5F5;
          border: 1px solid #707070;
          opacity: 0.5;
          font-size: 16px;
        }
      }
    }
  }
  .chatFunction {
    height: calc(100vh - 100px);
    overflow: auto;
    box-sizing: border-box;
    float: left;
    width: 380px;
    border: 1px solid rgba(112, 112, 112, 0.3);
    border-radius: 10px;
    .cFuntion {
      &>div {
        text-align: center;
        float: left;
        width: 118px;
        height: 20px;
        font-size: 16px;
        font-family: 'Segoe UI';
        font-weight: bold;
        padding: 10px 0;
        color: #000000;
        opacity: 1;
        border-bottom: 1px solid #c8c8c8;
        p {
          cursor: pointer;
        }
        .active {
          color: #3875C5;
        }
      }
      &>div:nth-child(2) {
        p {
          border-left: 1px solid #c8c8c8;
          border-right: 1px solid #c8c8c8;
        }
      }
    }
  }

  .chatFunction {
    display: none;
  }
  
</style>