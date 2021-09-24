<template>
  <div class="prompt clear" ref="prompt">

    <div class="img">
      <slot name="profileImg"></slot>
    </div>

    <div class="name">
      <slot name="name"></slot>
      <p v-if="messageTpye == 1">好友上线</p>
      <p v-else-if="messageTpye == 2">好友离线</p>
    </div>

    
  </div>
</template>

<script>
export default {
  name: 'Prompt',
  data() {
    return {
    }
  },
  props: {
    messageTpye: {
      type: Number
    }
  },
  updated() {
    let prompt = this.$refs.prompt
    new Promise((reslove, reject) => {
      let num = setInterval(() => {
        prompt.style.bottom = (parseInt(window.getComputedStyle(prompt, null)['bottom']) + 2) + 'px'
        if (parseInt(prompt.style.bottom) >= 0) {
          clearInterval(num)
          reslove()
        }
      }, 10);
    }).then(() => {
      return new Promise((reslove, reject) => {
        let timeout = setTimeout(() => {
          clearTimeout(timeout)
          reslove()
        }, 1000)
      })
    }).then(() => {
      return new Promise((reslove, rejcet) => {
        let num = setInterval(() => {
          prompt.style.bottom = (parseInt(window.getComputedStyle(prompt, null)['bottom']) - 2) + 'px'
          if (parseInt(prompt.style.bottom) <= -300) {
            clearInterval(num)
            reslove()
          }
        }, 10);
      })
    })
  }
}
</script>

<style lang="less" scoped>
  .prompt {
    z-index: 20;
    width: 300px;
    height: 100px;
    position: fixed;
    bottom: -300px;
    right: 0px;
    background-color: #fafafa;
    opacity: 0.8;
    border-radius: 10px;
    border: 1px solid #DADADA;
    .img {
      float: left;
      img {
        width: 70px;
        height: 70px;
        margin: 15px;
      }
    }
    .name {
      float: left;
      margin-top: 25px;
      margin-left: 5px;
      &>p:nth-child(1) {
        font-size: 16px;
        font-family: 'Segoe UI';
        font-weight: bold;
        line-height: 30px;
      }
      &>p:nth-child(2) {
        font-size: 12px;
        font-family: 'Segoe UI';
        font-weight: 400;
      }
    }
  }
</style>
