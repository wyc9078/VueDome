<template lang="pug">
    .video
       mu-card(style="width: 100%; max-width: 375px; margin: 0 auto;" v-for="(item,index) in VideoList" :key="index")
       
        mu-card-media
          video(:src="item.playUrl" :poster="item.thumbnailUrl" width="100%" controls)
        mu-card-text {{item.caption}}
        mu-card-actions
          mu-button(flat="") {{item.viewCount}} 播放
          mu-button(flat="") {{item.likeCount}} 喜欢
          mu-button(flat="") {{item.commentCount}} 评论
       
</template>

<script>
export default {
    mounted(){
      this.$http.Get({
        url: 'profile',
        par: {
          userid: "fx888888"
        }
      }, (res) =>{
        var video = res.data.profile.tabDatas.open.list
        for(var i =0;i<video.length;i++){
          if(video[i].hasOwnProperty("liveStreamId")){
            video.splice(i,1)
          }
        }

        this.VideoList = video
        console.log(video)
 
      })
    },
    data(){
      return {
        VideoList: []
      }
    },
    methods: {

    }
}
</script>

<style lang="less" scoped>
@import "./../../assets/css/main.less";
@import "./../../assets/css/page/video.less";
</style>
