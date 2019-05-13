<template lang="pug">
  
  .nav-bar-menu
    .scroll
      ul
        li
          router-link(to="/index/jx") 精选
        li
          router-link(to="/index/video") 视频
        li
          router-link(to="/index/article")  图文
        li
          router-link(to="/index/picture") 纯图

       
</template>


<script>
export default {
    
}
</script>


<style scoped lang="less">
@import "./../../assets/css/main.less";
@import "./../../assets/css/page/navbar.less";
</style>
