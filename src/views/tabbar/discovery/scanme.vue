<template>
  <div class="scanme">
    <van-nav-bar left-text="返回" title="扫一扫" left-arrow @click-left="onClickLeft">
    </van-nav-bar>
    <div id="scanComponent" style="width: 100%;top: 46px; bottom: 0px; position: absolute;background: #000000;"></div>
  </div>
</template>
<script>
import { Dialog } from 'vant'
let scan = null
export default {
  name: 'scanme',
  components: {
  },
  data () {
    return {
      codeUrl: ''
    }
  },
  mounted () {
    setTimeout(() => {
      this.startRecognize()
    }, 500)
  },
  methods: {
    onClickLeft () {
      scan.close()
      this.$router.push({ path: '/discovery', query: { num: 2 } })
    },
    scannerRequest (friendUsername) {
      this.$axios({
        method: 'get',
        url: '/chat/discovery/search',
        responseType: 'json',
        params: {
          userId: this.$store.state.user.id,
          friendName: friendUsername
        }
      }).then((response) => {
        scan.close()
        plus.nativeUI.closeWaiting()
        if (response.status === 200) {
          this.$router.push({ path: '/friendInfo', query: { friendName: friendUsername, faceImage: response.data.faceImage, nickname: response.data.nickname } })
        } else {
          Dialog({ message: response.msg })
        }
      })
    },
    startRecognize () {
      const that = this
      var styles = { frameColor: '#128E12', scanbarColor: '#0062CC', background: '', top: '46px', bottom: '0px', position: 'absolute', width: '100%' }
      scan = new plus.barcode.Barcode('scanComponent', null, styles)
      scan.onmarked = onmarked
      function onmarked (type, result) {
        if (type === 0) {
          const content = result.split('qrcode:')
          if (content.length !== 2) {
          } else {
            const friendUsername = content[1]
            plus.nativeUI.showWaiting('请稍后...')
            that.scannerRequest(friendUsername)
          }
        }
      }
      scan.start()
    }
  }
}
</script>

<style scoped>
.van-nav-bar__title {
  margin-left: 19px;
}
</style>
