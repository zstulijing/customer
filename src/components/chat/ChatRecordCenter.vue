<template>
  <div class="chatRecord">
    <div class="text clear">
      <table>
        <slot name="system"></slot>
      </table>
    </div>
  </div>  
</template>

<script>
export default {
  name: 'ChatRecordCenter',
}
</script>

<style lang="less" scoped>
  .chatRecord {
    width: 100%;
    margin: 10px 0;
  }

  .text {
    border-radius: 10px;
    p {
      line-height: 40px;
      font-size: 16px;
      font-family: 'Segoe UI';
      padding: 0 10px;
    }
    text-align: center;
    table {
    margin: 0 auto;
      p {
        background-color: rgb(214, 215, 216);
        color: rgb(119, 119, 119);
        font-size: 14px;
        line-height: normal;
        border-radius: 10px;
      }
    }
  }

</style>
