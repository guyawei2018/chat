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
    <div v-for="(item,index) in userChatSnapshot" :key="index">
      <div style="width: 100%; height: 45px; margin-top: 10px;" @click="chatting(item)">
        <van-badge :content="5">
          <img :src="item.faceImage"
          width="40px" height="45px" style=" float: left; margin-left: 10px;"/>
        </van-badge>
        <div style="float: left; height: 45px; margin-left: 10px;">
          <div style="height: 35px;text-align: left;line-height: 35px;">{{item.nickName}}
            <!-- <van-icon v-if="item.isRead === true"/> -->
          </div>
          <div style="height: 15px; font-size: 12px;line-height: 15px;">{{item.message}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Dialog, Toast, Badge } from 'vant'
export default {
  name: 'Chat',
  components: {
  },
  data () {
    return {
      userChatSnapshot: [],
      socket: '',
      userId: this.$store.state.user.id,
      isLoading: false,
      friendRequest: [],
      friend: []
    }
  },
  mounted () {
    this.getFriendRequest()
    this.global.getUserChatSnapshot(this.$store.state.user.id).map(item => {
      console.log('item.friendId=' + item.friendId)
      console.log('item.msg=' + item.msg)
      console.log('item.msg=' + item.isRead)
      var friend = this.getFriendFromStore(item.friendId)
      console.log('faceImage=' + friend.friendFaceImage)
      console.log('nickName=' + friend.friendNickname)
      this.userChatSnapshot.push({ friendId: item.friendId, message: item.msg, isRead: item.isRead, faceImage: friend.friendFaceImage, nickName: friend.friendNickname })
    })
  },
  methods: {
    chatting (info) {
      console.log(info)
      this.global.getUserChatSnapshot(this.userId, info.friendId)
      this.$router.push({ path: '/chatting', query: { friendUserId: info.friendId, friendNickname: info.nickName, friendFaceImage: info.faceImage } })
    },
    getFriendFromStore (friendId) {
      var friendList = this.$store.state.firendList
      for (var i = 0; i < friendList.length; i++) {
        var list = friendList[i].list
        for (var j = 0; j < list.length; j++) {
          if (list[j].friendUserId === friendId) {
            // 删除已经存在的friendId所对应的快照对象
            return list[j]
          }
        }
      }
    },
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
