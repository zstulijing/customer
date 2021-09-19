<template>
  <div>
    <div id="interface" class="clearfix">
      <div id="inputpart">
        <div class="logo">
          <img src="~assets/img/logon/logo.png" alt="logon">
        </div>
        <div class="title">
          <h1>信易萃学</h1>
        </div>
        <div class="logon clear">
          <input type="button" @click="toLogon()" :class="activeLogon" value="登录">
          <input type="button" @click="toSign()" :class="activeSign" value="注册">
        </div>
        
        <div v-if="isLogon">
          <div class="form clearfix">

            <div class="username">
              <img src="~assets/img/logon/username.png" alt="">
              <input type="text" name="username" placeholder="请输入用户名" v-model="username">
            </div>

            <div class="password">
              <img src="~assets/img/logon/password.png" alt="">
              <input type="password" name="password" placeholder="请输入密码" v-model="password" @keyup.enter="submit()">
            </div>


            <p v-show="!loginSucceeded" class="errorText">
              <img src="~assets/img/logon/error.png" alt="错误">
              用户名或密码错误
            </p>
          </div>

          <div class="fun clear">
            <div>
              <label for="freeLogin">
                <input type="checkbox" name="" id="freeLogin">30天内免登录
              </label>
            </div>
            <div>忘记密码</div>
          </div>

          <div class="button">
            <button @click="submit()">确定</button>
          </div>

          <div class="other">
            <div class="otherWay">
              <p>————————其他方式登录————————</p>
            </div>
            <div class="tourist">
              <img src="~assets/img/logon/tourist.png" alt="">
              <p>游客</p>
            </div>
          </div>

          <div class="bottom">
            <p>登录表示你同意该软件<a href="">用户服务协议</a>和<a href="">隐私政策</a></p>
          </div>
        </div>

        <div v-else> 
          <div class="form clearfix">

            <div class="username">
              <img src="~assets/img/logon/username.png" alt="">
              <input type="text" name="username" placeholder="用户名" v-model="sign.username">
            </div>

            <div class="username">
              <img src="~assets/img/logon/username.png" alt="">
              <input type="text" name="username" placeholder="昵称" v-model="sign.nickname">
            </div>


            <div class="password">
              <img src="~assets/img/logon/password.png" alt="">
              <input type="password" name="password" placeholder="密码" v-model="sign.password" @keydown="inputPassword()">
            </div>
            
            <div class="password">
              <img src="~assets/img/logon/password.png" alt="">
              <input type="password" name="password" placeholder="确认密码" v-model="sign.confirmPassword" @keydown="inputPassword()">
            </div>

            <p v-show="!samePassword" class="errorText">
              <img src="~assets/img/logon/error.png" alt="错误">
              确认密码与密码不一致!
            </p>



            <div class="phone">
              <img src="~assets/img/logon/phone.png" alt="">
              <input type="text" name="password" placeholder="手机号" v-model="sign.phone" @keyup="telephoneTest()" @keyup.enter="register()">
            </div>

            <p v-show="!legalTelephone" class="errorText">
              <img src="~assets/img/logon/error.png" alt="错误">
              电话号码格式错误!
            </p>


          </div>

          <div class="button">
            <button @click="register()" class="sign">确定</button>
          </div>

          <div class="bottom">
            <p>登录表示你同意该软件<a href="">用户服务协议</a>和<a href="">隐私政策</a></p>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import {request} from 'network/request.js'
export default {
  name: "Logon",
  data() {
    return {
      username: '',
      password: '',
      isLogon: true,
      isSign: false,
      samePassword: true,
      legalTelephone: true,
      loginSucceeded: true,
      sign: {
        username: '',
        nickname: '',
        password: '',
        confirmPassword: '',
        phone: ''
      }
    }
  },
  computed: {
    activeLogon() {
      if (this.isLogon == false) {
        return {disLogon: true}
      }
    },
    activeSign() {
      if (this.isSign == false) {
        return {disSign: true}
      }
    }
  },
  methods: {
    toLogon() {
      this.isLogon = true
      this.isSign = false
    },
    toSign() {
      this.isSign = true
      this.isLogon = false
    },
    submit() {
      request({
        method: 'GET',
        url: 'http://l423145x35.oicp.vip/bs-people/login',
        params: {
          username: this.username,
          password: this.password
        }
      }).then(response => {
        if (response.data.code == 400) {
          //登录失败
          this.loginSucceeded = false
        } else if (response.data.code == 200) {
          //登录成功
          this.$store.commit('setProfile', response.data.data)
          this.$router.push('/chat')
        }
      })
    },
    register() {
      request({
        method: 'GET',
        url: 'http://l423145x35.oicp.vip/bs-people/addByPermit',
        params: {
          username: this.sign.username,
          name: this.sign.nickname,
          password: this.sign.password,
          mobile: this.sign.phone,
          profileImg: ''
        }
      }).then(response => {

        let id = response.data.data
        
      })
    },
    inputPassword() {
      if (this.sign.password == this.sign.confirmPassword) {
        this.samePassword = true
      } else {
        this.samePassword = false
      }
    },
    telephoneTest(){
      if(/^1[3-9][0-9]{9}$/.test(this.sign.phone)){
        this.legalTelephone = true
      }
      else{
        this.legalTelephone = false
      }
    },
  }
}

</script>


<style lang="less" scoped>
  #interface{

    height: 100%;
  }
  #inputpart {
    margin: 100px auto;
    margin-bottom: 0;
    width: 400px;
    box-sizing: border-box;
    text-align: center;

    .logo {
      img {
        width: 80px;
      }
    }
    .title {
      
      font-weight: bolder;
      font-size: 22px;
      margin: 10px 0;
    }
    .logon {
      margin: 10px 0px;
      input {
        cursor: pointer;
        width: 200px;
        height: 40px;
        float: left;
        color: #fff;
        font-size: 18px;
        border: none;
      }
      &>input:nth-child(1) {
        background-color: rgb(96, 193, 83);
      }
      &>input.disLogon {
        background-color: rgb(175, 224, 169);
      }
      &>input:nth-child(2) {
        background-color: rgb(3, 102, 143);
      }
      &>input.disSign {
        background-color: rgb(129, 178, 199);
      }
    }
    .form {
      div {
        border-bottom: 1px solid #888888;
        margin: 0 30px;
        padding: 10px 0;
        img {
          width: 30px;
        }
        input {
          border: none;
          width: 300px;
          height: 25px;
          margin: 5px 0;
          font-size: 16px;
        }
      }
    }
    
    .fun {
      color: #888888;
      font-size: 14px;
      margin: 10px 30px;
      &>div:nth-child(1) {
        float: left;
      }
      &>div:nth-child(2) {
        float: right;
        cursor: pointer;
      }
    }
    .button {
      margin: 20px 0;
      button {
        outline: none;
        border: none;
        border-radius: 10px;
        width: 200px;
        color: #fff;
        font-size: 16px;
        line-height: 30px;
        background-color: rgb(96, 193, 83);
      }
    }
    .button .sign {
      background-color: rgb(3, 102, 143);
    }
    .other {
      .otherWay {
        color: #888888;
        margin: 20px 0;
      }
      .tourist {
        margin: 0 auto;
        width: 80px;
        height: 80px;
        background-color: rgb(235, 235, 235);
        border-radius: 80px;
        img {
          margin-top: 10px;
          width: 40px;
          height: 40px;
        }
        p {
          color: #535353;
        }
      }
    }
    .bottom {
      margin-top: 50px;
      p {
        color: #888888;
        a {
          text-decoration: none;
          color: rgb(3, 102, 143);
        }
      }
    }
  }
  .errorText {
    margin-left: 30px;
    text-align: left;
    img {
      width: 20px;
    }
    p {

      font-size: 18px;
      line-height: 20px;
    }
  }
</style>