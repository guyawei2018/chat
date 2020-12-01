<template>
  <div class="search">
    <van-nav-bar left-text="返回" title="添加朋友" left-arrow @click-left="onClickLeft" @click-right="onClickRight">
      <template #right>
        <van-icon name="search" size="18" />
      </template>
    </van-nav-bar>
    <van-search v-model="friendName" placeholder="请输入好友轻聊号" />
  </div>
</template>
<script>
import { Dialog } from 'vant'
export default {
  name: 'search',
  components: {
  },
  data () {
    return {
      friendName: ''
    }
  },
  mounted () {
  },
  methods: {
    onClickLeft () {
      this.$router.push({ path: '/discovery', query: { num: 2 } })
    },
    onClickRight () {
      this.$axios({
        method: 'get',
        url: '/chat/discovery/search',
        responseType: 'json',
        params: {
          userId: this.$store.state.user.id,
          friendName: this.friendName
        }
      }).then((response) => {
        if (response.status === 200) {
          console.log(response.data)
          this.$router.push({ path: '/friendInfo', query: { friendName: this.friendName, faceImage: response.data.faceImage, nickname: response.data.nickname } })
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
