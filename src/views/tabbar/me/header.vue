<template>
  <div class="header">
    <van-nav-bar left-text="返回" title="头像" right-text="···" left-arrow @click-left="onClickLeft" @click-right="onClickRight">
    </van-nav-bar>
    <van-action-sheet v-model="show" :actions="actions" @select="onSelect" />
    <div style="width: 100%;margin-top:46px">
      <img :src="imgPath" width="100%">
    </div>
  </div>
</template>
<script>
export default {
  name: 'Header',
  components: {
  },
  data () {
    return {
      imgPath: this.$store.state.user.faceImage,
      show: false,
      actions: [{ name: '下载头像' }, { name: '更换头像' }]
    }
  },
  mounted () {
  },
  methods: {
    onSelect (item) {
      this.show = false
      if (item.name === '下载头像') {
      } else if (item.name === '更换头像') {
        this.$router.push({ path: '/photo' })
      }
      console.log(item.name)
    },
    onClickLeft () {
      this.$router.push({ path: '/me', query: { num: 3 } })
    },
    onClickRight () {
      this.show = true
    }
  }
}
</script>

<style scoped>
.van-nav-bar__title {
  margin-left: 19px;
}
</style>
