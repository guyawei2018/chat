<template>
  <div class="friendInfo">
    <van-nav-bar left-text="返回" title="详细资料" left-arrow @click-left="onClickLeft">
    </van-nav-bar>
    <van-row style="margin-top: 10px;">
      <van-col span="5">
        <img :src="faceImage" width="50px" height="50px" style="float: left;margin-left: 15px;"/>
      </van-col>
      <van-col span="10" offset="0">
        <div style="height: 25px;">
          <van-tag round type="primary" style="float: left;margin-top: 3px;margin-right: 5px;">昵称</van-tag>
          <span style="float: left;">{{nickname}}</span>
        </div>
        <div style="height: 22px;">
          <span style="float: left; font-size: 14px;">轻聊号{{friendName}}</span>
        </div>
      </van-col>
    </van-row>
    <div style="margin-top : 40px;margin-left: 16px;margin-right: 16px;">
      <van-button round block type="info" native-type="submit" @click="addFriend">
        添加好友
      </van-button>
    </div>
  </div>
</template>
<script>
import { Dialog } from 'vant'
export default {
  name: 'friendInfo',
  components: {
  },
  data () {
    return {
      faceImage: '',
      nickname: '',
      friendName: ''
    }
  },
  mounted () {
    if (this.$route.query.id !== undefined || this.$route.query.indo !== null) {
      console.log('friendName=' + this.$route.query.friendName)
      console.log('nickname=' + this.$route.query.nickname)
      console.log('faceImage=' + this.$route.query.faceImage)
      this.faceImage = this.$route.query.faceImage
      this.nickname = this.$route.query.nickname
      this.friendName = this.$route.query.friendName
    }
  },
  methods: {
    onClickLeft () {
      this.$router.push({ path: '/search' })
    },
    addFriend () {
      this.$axios({
        method: 'get',
        url: '/chat/discovery/add',
        responseType: 'json',
        params: {
          userId: this.$store.state.user.id,
          friendName: this.friendName
        }
      }).then((response) => {
        if (response.status === 200) {
          Dialog({ message: response.msg })
        } else {
          Dialog({ message: response.msg })
        }
      })
    }
  }
}
</script>

<style scoped>
.van-nav-bar__title {
  margin-left: 19px;
}
</style>
