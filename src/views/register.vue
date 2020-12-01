<template>
  <div class="register" style="width: 100%;height: calc(100vh - 50px);padding-top: 50px">
    <van-nav-bar fixed title="用户注册"/>
    <div>
      <img src="http://guyw.top:10080/chat/M00/00/00/wKhkqV8_kByAFZyrAAGLr2kzHow903_big.png"
      height="180px" width="150px"/>
      <van-form @submit="onSubmit">
        <van-field v-model="nickname" label="昵称" placeholder="昵称" :rules="[{ required: true, message: '请填写昵称' }]"/>
        <van-field
          v-model="username" type="tel" label="手机号码" placeholder="手机号码"
          :rules="[{ required: true, message: '请填写手机号码' }]"/>
        <van-field v-model="idCard" label="身份证号码" placeholder="身份证号码" :rules="[{ required: true, message: '请填写身份证号码' }]"/>
        <van-field name="uploader" label="上传身份证照">
          <template #input>
            <van-uploader v-model="uploader" />
          </template>
        </van-field>
        <van-field
          v-model="smsCode"
          center
          clearable
          label="短信验证码"
          placeholder="请输入短信验证码" :rules="[{ required: true, message: '请填写短信验证码' }]">
          <template #button>
            <van-button size="small" type="primary" :disabled="disabled"
            style="background-color: #1989fa; border-color:#1989fa;"
            native-type="button" @click="getSmsCode">{{smsText}}</van-button>
          </template>
        </van-field>
        <div style="margin: 16px;">
          <van-button round block type="info" native-type="submit">
            注册
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import { Dialog } from 'vant'
export default {
  name: 'Register',
  components: {
  },
  data () {
    return {
      nickname: '',
      idCard: '',
      username: '',
      smsCode: '',
      smsText: '发送验证码',
      disabled: false,
      uploader: []
    }
  },
  mounted () {
  },
  created () {},
  methods: {
    onSubmit (values) {
      const piclist = this.uploader.map(item => {
        return item.content
      })
      console.log(piclist)
      this.$axios({
        method: 'post',
        url: '/chat/user/add',
        responseType: 'json',
        data: {
          nickname: this.nickname,
          idCard: this.idCard,
          username: this.username,
          smsCode: this.smsCode
        }
      }).then((response) => {
        if (response.status === 200) {
          Dialog({ message: '注册成功' })
          this.$router.push({ path: '/' })
        } else {
          Dialog({ message: response.msg })
        }
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
      this.$axios.get('/oauth/code/sms?deviceId=' + this.username + '&mobile=' + this.username).then(function (response) {
        Dialog({ message: '发送成功' })
      })
    }
  }
}
</script>
