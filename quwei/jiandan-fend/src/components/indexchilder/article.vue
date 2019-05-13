<template lang="pug">
    .article
      mu-load-more(@refresh="refresh", :refreshing="refreshing", :loading="loading", @load="load")
        mu-container
          mu-card(style='width: 100%; onsublime="return false;" max-width: 375px; margin: 0 auto;' v-for="(item,index) in ArticleList" :key="index" @click='getwz(index,item.url.substring(8,14),item.url.substring(15,20))')
            mu-card-media(:title="item.bt")
              img(:src="item.img")
            mu-card-text {{item.nr}}
            mu-flex(justify-content='center')
            //- @click='openFullscreenDialog'
          mu-dialog(width='360', padding=0, transition='slide-bottom', fullscreen='', :open.sync='openFullscreen',scrollable=true)
            mu-appbar(color='teal500' :title="lists" )
              mu-button(slot='left', icon='', @click='closeFullscreenDialog')
                mu-icon(value='close')
            div(style='padding: 24px;' ) {{listss}}
          mu-container
</template>

<script>
export default {
    inject: ['reload'],
    mounted(){
      this.GetData()
    },
    data(){
      return {
        ArticleList:[],
        wzxqList: [],
        num: 1,
        refreshing: false,
        loading: false,
        openFullscreen: false,
        clickSaveId: null,
        listss:"",
        lists: ""
      }
    },
    methods: {
      // 下拉到底部加载数据时候触发
      load () {
        this.loading = true;
        setTimeout(() => {
          // 显示加载圈
          this.loading = false;
          // 自减num
          this.num+=1;
          if(this.num ==11){
            this.num=1
          }
          // 获取数据
          this.GetData()
        }, 2000)
      },
      // 顶部下拉刷新页面
      refresh () {
        console.log(this.num)
        this.refreshing = true;
        setTimeout(() => {
          this.refreshing = false;
          // 刷新页面
          this.reload()
        }, 2000)
      },
      //发送请求获取数据
      GetData () {
          this.$http.Get({
          url: 'cwjt',
          par: {
            page: this.num
          }
        }, (res) =>{
          var article =res.data.cw;
          console.log(article)
          this.ArticleList = this.ArticleList.concat(article)
          // console.log(ArticleList)
        })
      },
      openFullscreenDialog () {
        this.openFullscreen = true;
      },
      closeFullscreenDialog () {
        this.openFullscreen = false;
      },
      //获取文章详细内容
      getwz(id,url1,url2)
      {
        console.log(111)
        this.openFullscreenDialog();
        this.clickSaveId = id
          this.$http.Get({
            url: 'wzxq',
            par: {
              url1 : url1,
              url2 : url2
            }
          }, (res) =>{
            console.log(res)
            var wzxqList = res.data.wzxq
            this.listss = wzxqList[0].nr
            this.lists = wzxqList[0].bt
            this.isShowComment = true
            this.HiddenOrShow = true
          })
      }
    }
}
</script>

<style lang="less" scoped>
@import "./../../assets/css/main.less";
@import "./../../assets/css/page/article.less";
</style>
