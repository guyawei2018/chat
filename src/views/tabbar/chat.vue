<template>
  <div class="chat">
    <van-pull-refresh v-model="isLoading" success-text="刷新成功" @refresh="onRefresh">
      <van-row v-for="(item,index) in friendRequest" :key="index" style="margin-top: 10px;">
        <van-col span="5">
          <img :src="item.sendFaceImage" width="50px" height="50px" style="float: left;margin-left: 15px;"/>
        </van-col>
        <van-col span="10">
          <div style="height: 25px;">
            <van-tag round type="primary" style="float: left;margin-top: 3px;margin-right: 5px;">昵称</van-tag>
            <span style="float: left;">{{item.sendNickname}}</span>
          </div>
          <div style="height: 22px;">
            <span style="float: left; font-size: 14px;">请求添加你为好友</span>
          </div>
        </van-col>
        <van-col span="9" style="height: 50px;line-height: 50px;">
          <van-button size= "small" type="default" @click="ignore(item)">忽略</van-button>
          <van-button size= "small" type="danger" style="margin-left: 10px;" @click="pass(item)">同意</van-button>
        </van-col>
      </van-row>
    </van-pull-refresh>
  </div>
</template>

<script>
import { Dialog, Toast } from 'vant'
export default {
  name: 'Chat',
  components: {
  },
  data () {
    return {
      isLoading: false,
      friendRequest: [],
      friend: []
    }
  },
  mounted () {
    this.getFriendRequest()
  },
  methods: {
    onRefresh () {
      setTimeout(() => {
        Toast('刷新成功')
        this.isLoading = false
        this.getFriendRequest()
      }, 1000)
    },
    getFriendRequest () {
      this.$axios({
        method: 'get',
        url: '/chat/chat/request/list',
        responseType: 'json',
        params: {
          userId: this.$store.state.user.id
        }
      }).then((response) => {
        if (response.status === 200) {
          console.log(response)
          this.friendRequest = response.data
        } else {
          Dialog({ message: response.msg })
        }
      })
    },
    ignore (item) {
      this.$axios({
        method: 'get',
        url: '/chat/chat/request/handle',
        responseType: 'json',
        params: {
          userId: this.$store.state.user.id,
          requestUserId: item.sendUserId,
          handleType: 0
        }
      }).then((response) => {
        if (response.status === 200) {
          console.log(response)
          Dialog({ message: response.msg })
          this.getFriendRequest()
        } else {
          Dialog({ message: response.msg })
        }
      })
    },
    pass (item) {
      this.$axios({
        method: 'get',
        url: '/chat/chat/request/handle',
        responseType: 'json',
        params: {
          userId: this.$store.state.user.id,
          requestUserId: item.sendUserId,
          handleType: 1
        }
      }).then((response) => {
        if (response.status === 200) {
          Dialog({ message: response.msg })
          this.getFriendRequest()
          this.$store.commit('EDIT_FRIENDLIST', response.data)
        } else {
          Dialog({ message: response.msg })
        }
      })
    }
  }
}
</script>
