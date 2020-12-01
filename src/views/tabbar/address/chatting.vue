<template>
  <div class="chatting ">
    <van-nav-bar left-text="返回" fixed :title="friendNickname" left-arrow @click-left="onClickLeft">
    </van-nav-bar>
    <div id ="msg-outter" style="height: calc(100vh - 94px); overflow-y: auto; background-color: #EAEAEA; margin-top: 46px;">
      <div id="msg"  ref="box" style="text-align: left;">
        <div v-for="(item,index) in messageLog" :key="index">
          <div class="friend_lists" v-if="item.flag === 1">
            <div class="header_img">
              <img :src="friendFaceImage" width="40px" height="40px" />
            </div>
            <div class="msg-wrapper right">
              <p class="msg-left-white">{{item.message}}</p>
            </div>
          </div>
          <div class="me_lists" v-if="item.flag === 2">
            <div class="header_img">
              <img :src="meImage" width="40px" height="40px" />
            </div>
            <div class="msg-wrapper left">
              <p class="msg-right-green">{{item.message}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer style="height: 48px;">
      <van-field v-model="message" rows="3" autosize label="" type="textarea" style="float: left;width: 80%; height: 48px;">
      </van-field>
      <van-button size="small" type="info" @click="sendMessage" style="float: left; line-height: 48px;margin-top: 8px;">发送</van-button>
    </footer>
  </div>
</template>
<script>
import '../../../assets/css/chat.css'
import { Toast } from 'vant'
export default {
  name: 'chatting',
  components: {
  },
  data () {
    return {
      wsPath: 'ws://192.168.3.153:8088/ws',
      // wsPath: 'ws://guyw.top:28088/ws',
      socket: '',
      messageLog: [
        { flag: 1, message: '你好，在吗？' },
        { flag: 2, message: '在的' },
        { flag: 1, message: '晚上有互动吗' }
      ],
      timeoutObj: null,
      message: '',
      friendNickname: '',
      friendFaceImage: '',
      friendUserId: '',
      userId: this.$store.state.user.id,
      meImage: this.$store.state.user.faceImage
    }
  },
  created () {
    this.$nextTick(function () {
      this.$refs.box.scrollTop = this.$refs.box.scrollHeight
      console.log('当前滚动条位置:' + this.$refs.box.scrollTop)
      console.log('当前可滚动区域容器的高度:' + this.$refs.box.scrollHeight)
    })
  },
  mounted () {
    if (this.$route.query.friendUserId !== undefined || this.$route.query.friendUserId !== null) {
      this.friendNickname = this.$route.query.friendNickname
      this.friendFaceImage = this.$route.query.friendFaceImage
      this.friendUserId = this.$route.query.friendUserId
    }
    this.init()
  },
  methods: {
    onClickLeft () {
      this.$router.push({ path: '/address', query: { num: 1 } })
    },
    sendMessage () {
      console.log(this.message)
      if (this.message.length === 0) {
        Toast({
          message: '消息为空',
          icon: 'chat-o'
        })
        return ''
      }
      const chatmsg = this.chatMsg(this.userId, this.friendUserId, this.message, '')
      const datacontent = this.dataContent(this.$CHAT, chatmsg, '')
      console.log(JSON.stringify(datacontent))
      this.messageLog.push({ flag: 2, message: this.message })
      this.send(JSON.stringify(datacontent))
      this.message = ''
      this.$nextTick(function () {
        this.$refs.box.scrollTop = this.$refs.box.scrollHeight
      })
      // const status = plus.networkinfo.getCurrentType()
      // if (status === 0 || status === 1) {
      //   Toast({
      //     message: '网络不佳',
      //     icon: 'chat-o'
      //   })
      //   return
      // }
    },
    playSendMsgSound () {
      const audioPlayer = puls.audio.createPlayer('../../../assets/mp3/send.mp3')
      audioPlayer.play()
    },
    playReceivemsgSound () {
      const audioPlayer = puls.audio.createPlayer('../../../assets/mp3/di_didi.mp3')
      audioPlayer.play()
    },
    init () {
      if (typeof (WebSocket) === 'undefined') {
        alert('手机不支持，请更换……')
      } else {
        // 实例化socket
        this.socket = new WebSocket(this.wsPath)
        // 监听socket连接
        this.socket.onopen = this.open
        // 监听socket错误信息
        this.socket.onerror = this.error
        // 监听socket消息
        this.socket.onmessage = this.getMessage
      }
    },
    open () {
      const _this = this
      var heartCheck = {
        timeout: 5000,
        reset: function () {
          clearInterval(_this.timeoutObj)
          return this
        },
        start: function () {
          if (_this.socket.readyState !== WebSocket.OPEN) {
            _this.init()
          }
          _this.timeoutObj = setInterval(function () {
            // 心跳包发送
            const chatmsg = _this.chatMsg('', '', '', '')
            const datacontent = _this.dataContent(_this.$KEEPALIVE, chatmsg, '')
            console.log(JSON.stringify(datacontent))
            _this.socket.send(JSON.stringify(datacontent))
          }, this.timeout)
        }
      }
      heartCheck.reset().start()
      console.log('socket 连接成功')
      const chatmsg = _this.chatMsg(_this.userId, _this.friendUserId, '', '')
      const datacontent = _this.dataContent(_this.$CONNECT, chatmsg, '')
      _this.send(JSON.stringify(datacontent))
    },
    error () {
      console.log('socket 连接失败')
    },
    getMessage (msg) {
      console.log(msg)
      this.messageLog.push({ flag: 1, message: JSON.parse(msg.data).chatmsg.msg })
      this.$nextTick(function () {
        this.$refs.box.scrollTop = this.$refs.box.scrollHeight
      })
      // 消息签收
      const datacontent = this.dataContent(this.$SIGNED, null, JSON.parse(msg.data).chatmsg.msgId)
      this.send(JSON.stringify(datacontent))
    },
    send (params) {
      if (this.socket.readyState !== WebSocket.OPEN) {
        this.init()
        setTimeout(() => {
          this.socket.send(params)
        }, 2000)
        return
      }
      this.socket.send(params)
    },
    close () {
      this.socket.close()
      console.log('socket 已经关闭')
    }
  },
  destroyed () {
    clearInterval(this.timeoutObj)
    this.socket.onclose = this.close()
  }
}
</script>

<style scoped>
.van-nav-bar__title {
  margin-left: 19px;
}
.body-html {
  height: 100%;
  margin: 0px;
  padding: 0px;
  overflow: hidden;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
}
</style>
