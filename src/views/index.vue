<template>
  <div class="index">
    <van-nav-bar :title="title" fixed>
      <template #right>
        <van-icon name="search" size="18" />
      </template>
    </van-nav-bar>
    <div style="width: 100%;margin-top:46px">
      <router-view/>
    </div>
    <van-tabbar v-model="active" :route="flag" @change="changeTitle">
      <van-tabbar-item replace to="/chat" icon="chat-o" :badge="count">轻聊</van-tabbar-item>
      <van-tabbar-item to="/address" replace icon="manager-o">通讯录</van-tabbar-item>
      <van-tabbar-item to="/discovery" replace icon="eye-o">发现</van-tabbar-item>
      <van-tabbar-item to="/me" replace icon="user-o">我</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { Dialog } from 'vant'
export default {
  name: 'Index',
  components: {
  },
  data () {
    return {
      wsPath: 'ws://192.168.3.73:8088/ws',
      active: 0,
      count: 0,
      flag: false,
      title: '轻聊'
    }
  },
  mounted () {
    console.log(this.$route.query.flag)
    if (this.$route.query.flag !== undefined || this.$route.query.flag === 1) {
      this.getFriendList()
      this.init()

    }
    if (this.$route.query.num === undefined || this.$route.query.num === null) {
      this.active = 0
      this.$router.push({ path: '/chat' })
    } else {
      this.active = parseInt(this.$route.query.num)
      if (parseInt(this.$route.query.num) === 0) {
        this.title = '轻聊'
      } else if (parseInt(this.$route.query.num) === 1) {
        this.title = '通讯录'
      } else if (parseInt(this.$route.query.num) === 2) {
        this.title = '发现'
      } else {
        this.title = '我'
      }
    }
  },
  methods: {
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
            this.$store.commit('EDIT_FRIENDLIST', response.data)
          } else {
            Dialog({ message: response.msg })
          }
        })
      }
    },
    changeTitle (val) {
      this.flag = true
      if (val === 0) {
        this.title = '轻聊'
      } else if (val === 1) {
        this.title = '通讯录'
      } else if (val === 2) {
        this.title = '发现'
      } else {
        this.title = '我'
      }
    },
    init () {
      const that = this
      if (typeof (WebSocket) === 'undefined') {
        alert('手机不支持，请更换……')
      } else {
        // 实例化socket
        that.socket = new WebSocket(that.wsPath)
        that.global.setWs(that.socket)
        // 监听socket连接
        that.socket.onopen = that.open
        // 监听socket错误信息
        that.socket.onerror = that.error
        that.socket.onmessage = this.getMessage
      }
    },
    open () {
      const _this = this
      var heartCheck = {
        timeout: 5000,
        reset: function () {
          clearInterval(_this.$store.state.timeOut)
          return this
        },
        start: function () {
          if (_this.global.ws.readyState !== WebSocket.OPEN) {
            _this.init()
          }
          const timeOut = setInterval(function () {
            // 心跳包发送
            const chatmsg = _this.chatMsg('', '', '', '')
            const datacontent = _this.dataContent(_this.$KEEPALIVE, chatmsg, '')
            console.log(JSON.stringify(datacontent))
            _this.global.ws.send(JSON.stringify(datacontent))
          }, this.timeout)
          _this.$store.commit('TIMEOUT', timeOut)
        }
      }
      heartCheck.reset().start()
      console.log('socket 连接成功')
      const chatmsg = _this.chatMsg(this.$store.state.user.id, '', '', '')
      const datacontent = _this.dataContent(_this.$CONNECT, chatmsg, '')
      _this.global.ws.send(JSON.stringify(datacontent))
    },
    getMessage (msg) {
      console.log(msg)
      if (this.$CHAT === JSON.parse(msg.data).action) {
        this.global.saveUserChatHistory(this.userId, JSON.parse(msg.data).chatmsg.senderId, JSON.parse(msg.data).chatmsg.msg, 1, this)
        this.global.saveUserChatSnapshot(this.userId, JSON.parse(msg.data).chatmsg.senderId, JSON.parse(msg.data).chatmsg.msg, false, this)
      }
    },
    error () {
      console.log('socket 连接失败')
    }
  }
}
</script>

<style scoped>
.van-nav-bar__title {
  margin-left: 19px;
}
</style>
