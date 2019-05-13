<template lang="pug">
    mu-container
        mu-card(style='width: 100%; onsublime="return false;" max-width: 375px; margin: 0 auto;' v-for="(item,index) in picturelist" :key="index")
            mu-card-media(title="")
              img(:src="item.imgurl")
</template>

<script>
export default {
    mounted(){
       this.GetData()
    },
    data(){
      return {
          picturelist : [],
          imgurl: ""
      }
    },
    methods:{
        GetData () {
          this.$http.Get({
          url: 'picture',
        }, (res) =>{
            console.log(res)
          var picture =res.data.pins;
          for(var i=1;i<picture.length;i++){
              picture[i].imgurl="http://img.hb.aicdn.com/"+picture[i].file.key
          }
          console.log(picture)
          this.picturelist=picture
          // console.log(ArticleList)
        })
      }
    }
}
</script>

<style lang="less" scoped>

</style>

