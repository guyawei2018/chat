<template>
  <div class="me">
    <van-cell size ="large" center is-link to="/header">头像
      <template #right-icon>
        <img :src="imagesrc"
        width="42px" height="42px">
        <van-icon name="arrow" class="search_icon" style="margin-left: 10px"></van-icon>
      </template>
    </van-cell>
    <van-cell size ="large" center is-link to="/nikename">昵称
      <template #right-icon>
        <div>{{nickname}}</div>
        <van-icon name="arrow" class="search_icon" style="margin-left: 10px"></van-icon>
      </template>
    </van-cell>
    <van-cell size ="large" center>轻聊号
      <template #right-icon>
        <div style="margin-right: 15px;">{{username}}</div>
      </template>
    </van-cell>
    <van-cell @click="showPopup" size ="large" center>我的二维码
      <template #right-icon>
        <img :src="qrcode" width="20px" height="20px">
        <van-icon name="arrow" class="search_icon" style="margin-left: 10px"></van-icon>
      </template>
    </van-cell>
    <van-popup v-model="show" style="width: 300px;height: 430px;">
      <div style="margin-top: 10px;">
        <img :src="imagesrc" width="42px" height="42px" style="float: left; margin-left: 20px;">
        <div style="float: left; margin-left: 20px;">
          {{nickname}}
        </div>
      </div>
      <img :src="qrcode">
      <div> 扫一扫上面的二维码图案，加我好友</div>
    </van-popup>
    <van-cell @click="showPopup" size ="large" center style="margin-top: 30px;">友情赞赏
      <template #right-icon>
        <van-tag round type="danger" style="margin-right: 1px">赏</van-tag>
      </template>
    </van-cell>
    <div @click="logout" style="width: 100pv;height: 42px;text-align: center;line-height: 42px;background-color: #42B983;margin-top: 20px;">退出登录</div>
  </div>
</template>

<script>
export default {
  name: 'Me',
  components: {
  },
  data () {
    return {
      show: false,
      qrcode: '',
      imagesrc: 'http://guyw.top:10080/chat/M00/00/00/wKhkqV8_kByAFZyrAAGLr2kzHow903_big.png',
      username: '',
      nickname: ''
    }
  },
  mounted () {
    this.nickname = this.$store.state.user.nickname
    this.username = this.$store.state.user.username
    this.imagesrc = this.$store.state.user.faceImage
    this.qrcode = this.$store.state.user.qrcode
  },
  methods: {
    showPopup () {
      this.show = true
    },
    logout () {
      clearInterval(this.$store.state.timeOut)
      this.global.ws.close()
      this.$router.push({ path: '/' })
    }
  }
}
</script>
