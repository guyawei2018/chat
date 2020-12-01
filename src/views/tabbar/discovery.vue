<template>
  <div class="discovery">
    <van-cell style="text-align: left;" size ="large" to="/header">
      <template #title>
        <div style="float: left;">
          <img src="../../assets/pyq.png" width="32px" height="32px"/>
        </div>
        <div style="float: left; line-height: 32px;padding-left: 15px;">朋友圈</div>
      </template>
    </van-cell>
    <van-cell style="text-align: left; margin-top: 20px;" size ="large" to="/search">
      <template #title>
        <div style="float: left;">
          <img src="../../assets/jhy.png" width="32px" height="32px"/>
        </div>
        <div style="float: left; line-height: 32px;padding-left: 15px;">添加好友</div>
      </template>
    </van-cell>
    <van-cell style="text-align: left;" size ="large" to="/scanme">
      <template #title>
        <div style="float: left;">
          <img src="../../assets/sys.png" width="32px" height="32px"/>
        </div>
        <div style="float: left; line-height: 32px;padding-left: 15px;">扫一扫</div>
      </template>
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'Discovery',
  components: {
  },
  data () {
    return {
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>
