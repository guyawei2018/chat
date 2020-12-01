<template>
  <div class="nikenamne">
    <van-nav-bar left-text="返回" title="更改昵称" right-text="保存" left-arrow @click-left="onClickLeft" @click-right="onClickRight">
    </van-nav-bar>
    <van-field v-model="nikename" :placeholder="holder" bind:change="onChange"/>
    <div style="margin-left: 13px; font-size: small;text-align: left; width: 100%;">好的名字可以让你的朋友更容易的记住你</div>
  </div>
</template>
<script>
import { Dialog } from 'vant'
export default {
  name: 'nikeNamne',
  components: {
  },
  data () {
    return {
      nikename: this.$store.state.user.nickname,
      holder: '昵称'
    }
  },
  mounted () {
  },
  methods: {
    onClickLeft () {
      this.$router.push({ path: '/me', query: { num: 3 } })
    },
    onClickRight () {
      this.$axios({
        method: 'post',
        url: '/chat/user/update',
        responseType: 'json',
        data: {
          id: this.$store.state.user.id,
          nickname: this.nikename
        }
      }).then((response) => {
        if (response.status === 200) {
          this.$axios({
            method: 'get',
            url: '/chat/user/me',
            responseType: 'json',
            headers: {
              token: this.$store.state.token
            }
          }).then((response) => {
            if (response.status === 200) {
              this.$store.commit('EDIT_USER', response.data)
              this.$router.push({ path: '/me', query: { num: 3 } })
            } else {
              Dialog({ message: response.msg })
            }
          })
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
