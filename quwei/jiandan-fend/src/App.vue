<template lang="pug">
  #app
    v-navbar(v-if="isShow")
    keep-alive
      router-view(v-if="isRouterAlive")
    //- v-footer(v-if="isShow")
</template>

<script>
import NavbarComponents from "./components/tpl/navbar.vue";
import FooterComponents from "./components/tpl/footer.vue";



export default {
  name: "App",
  provide (){
      return {
          reload: this.reload
      }
  },
  data () {
    return {
      isShow: true,
      isRouterAlive: true
    }
  },
  methods: {
    // 刷新页面
    // Vue的刷新页面不是使用传统的方式：具体参考这篇教程：
    // https://blog.csdn.net/qq_16772725/article/details/80467492
    // Vue 官方教程：https://cn.vuejs.org/v2/api/#provide-inject
    reload () {
        this.isRouterAlive = false;
        this.$nextTick(function(){
            this.isRouterAlive = true;
        })
    }
  },
  components: {
    "v-navbar": NavbarComponents,
    "v-footer": FooterComponents
  }
};
</script>

<style lang="less">
html, body, #app {
    width: 100%;
    height: 100%;
}
.swiper-wrapper,
.swiper-container {
    height: 100%;
}
.swiper-slide {
    text-align: center;
}
.mu-bottom-nav {
    position: fixed !important;
    bottom: 0;
    left: 0;
    width: 100%;
}
.mu-progress {
    position: fixed !important;
}
.mu-linear-progress-determinate {
  background-color: rgb(255, 111, 0);
}
.mu-button-wrapper .material-icons {
    margin-left: 10px;
    font-size: 15px;
}
.mu-icon-button {
    width: auto !important;
}

</style>
