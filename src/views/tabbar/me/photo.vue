<template>
  <div>
    <van-nav-bar left-text="返回" left-arrow @click-left="onClickLeft">
    </van-nav-bar>
    <input id="upload_file" type="file" style="display: none;" accept='image/*' name="file" @change="fileChange($event)"/>
    <div class="image-item space" @click="showActionSheet()">
     <div class="image-up"></div>
    </div>
    <div class="upload_warp">
     <div class="upload_warp_img">
      <div class="upload_warp_img_div" v-for="(item,index) in imgList" :key="index">
       <div class="upload_warp_img_div_top">
        <img src="../../../assets/del.jpeg" style="margin-top: 10px;" width="20px" class="upload_warp_img_div_del" @click="fileDel(index)">
       </div>
       <img :src="item.file.src" style="display: inline-block;" width="275" height="180">
      </div>
      <!-- <div class="upload_warp_left" id="upload_warp_left" @click="fileClick()" v-if="this.imgList.length < 6">
       <img src="../../assets/logo.png" class="imgs"/>
      </div> -->
     </div>

    </div>

    <div class="upload_warp_text">
    <span>选中{{imgList.length}}张文件，共{{bytesToSize(this.size)}}</span>
    </div>

    <div style="margin: 16px;" v-if="hiddenButton">
      <van-button round block type="info" @click="uploadHeader">
        提交
      </van-button>
    </div>
   </div>
</template>

<script>
import { Dialog } from 'vant'
export default {
  name: 'Photo',
  components: {
  },
  data () {
    return {
      imgList: [],
      hiddenButton: false,
      datas: new FormData(),
      files: 0,
      size: 0
    }
  },
  mounted () {
    document.getElementById('upload_file').click()
  },
  methods: {
    uploadHeader () {
      this.$axios({
        method: 'post',
        url: '/chat/user/update',
        responseType: 'json',
        data: {
          id: this.$store.state.user.id,
          faceImage: this.imgList[0].file.src
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
    },
    onClickLeft () {
      this.$router.push({ path: '/header' })
    },
    fileClick () {
      document.getElementById('upload_file').click()
    },
    getImage () {
      const cmr = plus.camera.getCamera()
      cmr.captureImage(function (p) {
        plus.io.resolveLocalFileSystemURL(p, function (entry) {
          compressImage(entry.toLocalURL(), entry.name)
        }, function (e) {
          plus.nativeUI.toast('读取拍照文件错误:' + e.message)
        })
      }, function (e) {
      }, {
        filter: 'image'
      })
    },
    galleryImgs () {
      plus.gallery.pick(function (e) {
        const name = e.substr(e.lastIndexOf('/') + 1)
        compressImage(e, name)
      }, function (e) {
      }, {
        filter: 'image'
      })
    },
    showActionSheet () {
      const bts = [{
        title: '拍照'
      }, {
        title: '从相册选择'
      }]
      plus.nativeUI.actionSheet({
        cancel: '取消',
        buttons: bts
      },
      function (e) {
        if (e.index === 1) {
          this.getImage()
        } else if (e.index === 2) {
          this.galleryImgs()
        }
      }
      )
    },
    fileChange (el) {
      this.hiddenButton = true
      this.files = document.getElementById('upload_file').files
      console.log(this.files.length)
      for (let i = 0; i < this.files.length; i++) {
        this.datas.append('file', this.files[i])
      }
      this.show1 = false
      console.log(typeof this.files)
      console.log(this.files)
      if (!el.target.files[0].size) return
      this.fileList(el.target)
      el.target.value = ''
    },
    fileList (fileList) {
      const files = fileList.files
      for (let i = 0; i < files.length; i++) {
        if (files[i].type !== '') {
          this.fileAdd(files[i])
        } else {
          this.folders(fileList.items[i])
        }
      }
    },
    folders (files) {
      const _this = this
      if (files.kind) {
        files = files.webkitGetAsEntry()
      }
      files.createReader().readEntries(function (file) {
        for (let i = 0; i < file.length; i++) {
          if (file[i].isFile) {
            _this.foldersAdd(file[i])
          } else {
            _this.folders(file[i])
          }
        }
      })
    },
    fileAdd (file) {
      this.size = this.size + file.size
      if (file.type.indexOf('image') === -1) {
        file.src = 'wenjian.png'
        this.imgList.push({
          file
        })
      } else {
        const reader = new FileReader()
        reader.vue = this
        reader.readAsDataURL(file)
        reader.onload = function () {
          file.src = this.result
          this.vue.imgList.push({
            file
          })
        }
      }
    },
    fileDel (index) {
      this.size = this.size - this.imgList[index].file.size
      this.imgList.splice(index, 1)
    },
    bytesToSize (bytes) {
      if (bytes === 0) {
        return '0 B'
      }
      const k = 1000
      const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i]
    },
    dragenter (el) {
      el.stopPropagation()
      el.preventDefault()
    },
    dragover (el) {
      el.stopPropagation()
      el.preventDefault()
    },
    drop (el) {
      el.stopPropagation()
      el.preventDefault()
      this.fileList(el.dataTransfer)
    },
    shows (et, tx) {
      this.strut = et
      this.txt = tx
    },
    handleClick () {
      this.$store.commit('add')
    }
  }
}
</script>

<style scoped>
.van-nav-bar__title {
  margin-left: 19px;
}
</style>
