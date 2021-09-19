<template>
  <div class="newbutton" @click="ballMove()">
    <div class="background" :class="choose">
      <div id="ball" ref="ball"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NewButton',
  data() {
    return {
      isChoose: false
    }
  },
  computed: {
    choose() {
      if (this.isChoose == false) {
        return {nochoose: true,choose: false}
      } else {
        return {nochoose: false,choose: true}
      }
    }
  },
  methods: {
    ballMove() {
      this.isChoose = !this.isChoose

      let ball = this.$refs.ball
      
      if (parseInt(getComputedStyle(ball, null)['left']) <= 3) {
        let num = setInterval(() => {
          if (parseInt(getComputedStyle(ball, null)['left']) >= 18) {
            clearInterval(num)
          }
          ball.style.left = (parseInt(getComputedStyle(ball, null)['left']) + 1) + 'px'
        }, 1);
      } else {
        let num = setInterval(() => {
          if (parseInt(getComputedStyle(ball, null)['left']) <= 3) {
            clearInterval(num)
          }
          ball.style.left = (parseInt(getComputedStyle(ball, null)['left']) - 1) + 'px'
        }, 1);
      }
      
        
    }
  },
}
</script>

<style lang="less" scoped>
  .newbutton {
    cursor: pointer;
    .nochoose {
      width: 41px;
      height: 23px;
      background: #707070;
      opacity: 0.3;
      border-radius: 11px;
    }
    .choose {
      width: 41px;
      height: 23px;
      background: #3875C5;
      opacity: 0.8;
      border-radius: 11px;
    }
    #ball {
      width: 19px;
      height: 19px;
      background: #FFFFFF;
      border-radius: 50%;
      position: relative;
      top: 2px;
      left: 2px;
    }
  }
</style>