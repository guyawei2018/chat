<template>
  <div class="login" style="width: 100%;height: 100vh;">
    <van-nav-bar fixed right-text="注册" @click-right="register"/>
    <div style="padding-top: 120px;">
      <h2 style="color:#1989fa;">小猪佩奇</h2>
      <img src="http://guyw.top:10080/chat/M00/00/00/wKhkqV8_kByAFZyrAAGLr2kzHow903_big.png"
      height="180px" width="150px"/>
      <van-form @submit="onSubmit">
        <van-badge :content="20" />
        <van-field
          v-model="tel" type="tel" label="手机号码" placeholder="手机号码"
          :rules="[{ required: true, message: '请填写手机号码' }]" />
        <van-field
          v-model="sms"
          center
          clearable
          label="短信验证码"
          placeholder="请输入短信验证码">
          <template #button>
            <van-button size="small" type="primary" :disabled="disabled" style="background-color: #1989fa; border-color:#1989fa;"
            native-type="button" @click="getSmsCode">{{smsText}}</van-button>
          </template>
        </van-field>
        <div style="margin: 16px;">
          <van-button round block type="info" native-type="submit">
            登录
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
// import { Dialog } from 'vant'
export default {
  name: 'Login',
  components: {
  },
  data () {
    return {
      tel: '15961793612',
      sms: '123456',
      smsText: '发送验证码',
      disabled: false
    }
  },
  mounted () {
  },
  created () {},
  methods: {
    onSubmit () {
      this.$axios({
        method: 'post',
        url: '/oauth/authentication/mobile',
        responseType: 'json',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: 'Basic bGFuc3dvbjoxMjM0NTY='
        },
        params: {
          mobile: this.tel,
          smsCode: this.sms,
          deviceId: this.tel
        }
      }).then((response) => {
        this.$store.commit('EDIT_TOKEN', response.access_token)
        this.getMe()
      })
    },
    getSmsCode () {
      if (this.disabled) return
      this.disabled = true
      let times = 60
      this.smsText = times + 's后重新发送'
      let clock = null
      clock = window.setInterval(() => {
        times--
        this.smsText = times + 's后重新发送'
        if (times < 0) {
          window.clearInterval(clock)
          this.smsText = '发送验证码'
          this.disabled = false
        }
      }, 1000)
      this.$axios.get('/oauth/code/sms?deviceId=' + this.tel + '&mobile=' + this.tel).then(function (response) {
        Dialog({ message: '发送成功' })
      })
    },
    register () {
      this.$router.push({ path: '/register' })
    },
    getMe () {
      this.$axios({
        method: 'get',
        url: '/chat/user/me',
        responseType: 'json',
        headers: {
          token: this.$store.state.token
        }
      }).then((response) => {
        console.log(response)
        if (response.status === 200) {
          this.$store.commit('EDIT_USER', response.data)
          this.getFriendList()
        } else {
          Dialog({ message: response.data.msg })
        }
      })
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
            this.$store.commit('EDIT_FRIENDLIST', response.data)
            this.$router.push({ path: '/index', query: { flag: 1 } })
          } else {
            Dialog({ message: response.msg })
          }
        })
      }
    }
  }
}
</script>
