<template lang="pug">
    .index_duanzi
     mu-load-more(@refresh="refresh", :refreshing="refreshing", :loading="loading", @load="load")
      .duanzi(v-for="(item,index) in list" :key="index")
       .duanzi-header
         img(:src="item.photo")
         span {{item.author}}
       .duanzi-content {{item.content}}
       .duanzi-action
         .action-lef
           mu-button.like(color="orange400" icon @click="SetLike('like',index,item.posid)") {{item.like}}
             mu-icon(value="thumb_up")
           mu-button(color="grey500" icon @click="SetLike('unlike',index,item.posid)")  {{item.unlike}}
             mu-icon(value="thumb_down")
         .action-right
           mu-button(color="grey400" icon @click="GetComment(index, item.posid)")
             mu-icon(value="chat")

       .comment-list(v-if="isShowComment && index == clickSaveId")
          span.list-title - &nbsp;评论 &nbsp;-
          .list(v-for="(items, indexs) in commentList" :key="indexs")
            h4 {{indexs + 1 }}：{{items.comment_author}}
            span(v-html="items.comment_content")
          br  
          .hidden-list
            a(@click="GetComment(index, item.posid)") 折叠 

          .message
            mu-form.mu-demo-form(ref="form", :model="validateForm")
             mu-form-item(label="发布你的观点", prop="username")
               mu-text-field(v-model="validateForm.usercomment", prop="username" @change="SetComment(item.posid)")
</template>


<script>
export default {
    inject: ['reload'],
    mounted(){
      localStorage.setItem("name","liocsdj")
      localStorage.setItem("email","23462783@qq.com") 
      this.GetData()
    },
    data(){
      return {
        list: [],
        commentList: [],
        isShowComment: false,
        clickSaveId: null,
        HiddenOrShow: false, //false 展现评论列表，true 收起列表
        validateForm: {
          usercomment: '',
        },
        num: 0, // 最关键的num数值
        refreshing: false,
        loading: false,
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
          this.num-=1;
          // 获取数据
          this.GetData()
        }, 2000)
      },
      // 顶部下拉刷新页面
      refresh () {
        this.refreshing = true;
        setTimeout(() => {
          this.refreshing = false;
          // 刷新页面
          this.reload()
        }, 2000)
      },
      // 提交评论
      SetComment(posid){
        if(localStorage.getItem("name") != null && localStorage.getItem("email") != null && this.validateForm.usercomment.length != 0) {
          this.$http.Post({
            url: 'SetPostcomment',
            par: {
              author: localStorage.getItem("name"),
              email: localStorage.getItem("email"),
              comment: this.validateForm.usercomment,
              postid: posid
            }
          },res => {
            if(res.data.status == 200){
              this.$toast.success({
                position: 'top',
                message: "评论发送成功!"
              })
            }
          })
        }else {
           this.$toast.error({
            position: 'top',
            message: "未登录&信息不能为空!"
          })
        }
   
      },
      // 获取列表数据
      GetData () {
        this.$http.Get({
          url: 'index',
          par: {
            page: this.num
          }
        }, res =>{
          this.num = parseInt(res.data.maxPage)
          this.list = this.list.concat(res.data.datas)
        })
      },
      // 获取文章评论
      GetComment(id, posid) {
        this.clickSaveId = id
        if(this.HiddenOrShow) {
          this.isShowComment = false
          this.HiddenOrShow = false
        } else {
          this.$http.Get({
            url: 'tucao',
            par: {
              postid: posid
            }
          }, (res) =>{
            this.commentList = res.data.tucao
            this.isShowComment = true
            this.HiddenOrShow = true
          })
        }
       
      },
      // 喜欢 / 不喜欢
      SetLike(action,id,postid){
          this.$http.Post({
            url: "like",
            par: {
              postid: postid,
              type: action
            }
          },res =>{
            var status = JSON.parse(res.data.postid)
            if(status.error == 0){
              if(action == 'like'){
                this.list[id].like = parseInt(this.list[id].like) + 1
                this.$toast.success('点赞成功')
              }else {
                this.list[id].unlike = parseInt(this.list[id].unlike) + 1
                this.$toast.success('吐槽成功')
              }
              
              
            }else {
              this.$toast.error('你已经投过票了');
            }
          })
      }
    }
}
</script>

<style lang="less" scoped>
@import "./../../assets/css/main.less";
@import "./../../assets/css/page/jinxuan.less";
</style>
