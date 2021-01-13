<template>
  <div class="address" style="text-align: left;">
    <van-index-bar :index-list="indexList">
      <div v-for="(item) in dataList" :key="item.py">
        <van-index-anchor  :index="item.py">{{item.py}}</van-index-anchor>
        <div v-for="(info) in item.list" :key="info.friendUserId" style="width: 100%; height: 40px;" @click="chatting(info)">
          <img :src="info.friendFaceImage" width="40px" height="40px" style=" float: left; margin-left: 10px;"/>
          <div style="float: left; height: 40px;">
            <van-cell :title="info.friendNickname" />
          </div>
        </div>
      </div>
    </van-index-bar>
  </div>
</template>

<script>
import { Dialog } from 'vant'
export default {
  name: 'Address',
  components: {
  },
  data () {
    return {
      socket: '',
      indexList: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '#'],
      dataList: []
    }
  },
  mounted () {
    this.getFriendList()
    this.init()
  },
  methods: {
    init () {
      if (typeof (WebSocket) === 'undefined') {
        alert('手机不支持，请更换……')
      } else {
        this.socket = this.global.ws
        this.socket.onmessage = this.getMessage
      }
    },
    getMessage (msg) {
      console.log(msg)
      if (JSON.parse(msg.data).action === this.$PULL_FRIEND) {
        this.getFriendList()
      }
    },
    getFriendList () {
      const friendList = this.$store.state.firendList
      if (friendList.length === 0) {
        this.$axios({
          method: 'get',
          url: '/chat/address/list',
          responseType: 'json',
          params: {
            userId: this.$store.state.user.id
          }
        }).then((response) => {
          if (response.status === 200) {
            console.log(response)
            this.dataList = response.data
            this.$store.commit('EDIT_FRIENDLIST', response.data)
          } else {
            Dialog({ message: response.msg })
          }
        })
      } else {
        this.dataList = friendList
      }
    },
    chatting (info) {
      console.log(info)
      this.$router.push({ path: '/chatting', query: { friendUserId: info.friendUserId, friendNickname: info.friendNickname, friendFaceImage: info.friendFaceImage } })
    }
  }
}
</script>
