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
export default {
  name: 'Index',
  components: {
  },
  data () {
    return {
      active: 0,
      count: 5,
      flag: false,
      title: '轻聊'
    }
  },
  mounted () {
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
    }
  }
}
</script>

<style scoped>
.van-nav-bar__title {
  margin-left: 19px;
}
</style>
