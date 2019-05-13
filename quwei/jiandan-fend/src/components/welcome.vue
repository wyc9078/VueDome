<template  lang="pug">
    .welcome
      .welcome-top
        swiper(:options="swiperOption", ref="mySwiper")
            swiper-slide 
              img(src="../assets/img/qd1.png")
            swiper-slide 
              img(src="../assets/img/qd2.png")
            swiper-slide
              img(src="../assets/img/qd3.png")
            .swiper-pagination(slot="pagination")
      .welcome-bottom
         mu-flex.flex-demo(justify-content="center" align-items="center" direction="column") 有人的地方  就有段子
          mu-button(flat="", color="secondary" @click="GoIndex") Drive Car

</template>


<script>
export default {
    mounted() {
        this.$parent.$data.isShow = false

    },
    beforeRouteLeave (to, from, next) {
      this.$parent.$data.isShow = true
      next()
    },
    data () {
        return {
            message: "我是启动欢迎页面",
            swiperOption: {
                pagination: {
                  el: '.swiper-pagination',
                }
          }
        }
    },
    computed: {
      swiper() {
        return this.$refs.mySwiper.swiper
      }
    },
    methods: {
      GoIndex(){
        this.$router.replace({ path: '/index/jx' })
      }
    }
}
</script>


<style scoped lang="less">
@import "./../assets/css/main.less";
@import "./../assets/css/page/welcome.less";

</style>

