<template>
  <div class="chatRecord clear">

    <div class="head clear">
      <slot name="head"></slot>
    </div>

    <div class="text clear">

      <div class="border"></div>
      
      <div class="textarea">
        <slot name="text"></slot>
        <slot name="emoji"></slot>
      </div>

    </div>

  </div>  
</template>

<script>
export default {
  name: 'ChatRecordRight'
}
</script>

<style lang="less" scoped>
  .chatRecord {
    width: 100%;
    margin: 10px 0;
    div {
      float: right;
    }
  }
  .head {
    border-radius: 5px;
    img {
      width: 40px;
      height: 40px;
    }
  }
  .text {
    position: relative;
    margin-right: 20px;
    .textarea {
      border-radius: 10px;
      background-color: #12B7F5;
      max-width: 560px;
      padding: 5px 0;
      p {
        line-height: 30px;
        font-size: 16px;
        font-family: 'Segoe UI';
        padding: 0 10px;
        color: #ffffff;
      }
      img {
        max-width: 400px;
        margin: 8px;
        border-radius: 5px;
      }
    }
    .border {
      width: 0;
      height: 0;
      border: 8px solid;
      border-color: #f8f8f8 #f8f8f8 #f8f8f8 #12B7F5;
      position: absolute;
      right: -16px;
      top: 15px;
    }
    
  }
</style>
