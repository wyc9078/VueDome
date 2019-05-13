import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/index'
import Welcome from '@/components/welcome'
import Me from '@/components/me'


import JingXuan from '@/components/indexchilder/jinxuan'
import Video from '@/components/indexchilder/video'
import Article from '@/components/indexchilder/article'
import picture from '@/components/indexchilder/picture'
Vue.use(Router)


const router = new Router({   
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: Welcome
    },
    {
      path: '/index',
      name: 'index',
      component: Index,
      children: [
        {
          path: 'jx',
          name: 'jx',
          component: JingXuan,
        },
        {
          path: 'video',
          name: 'video',
          component: Video,
        },
        {
          path: 'article',
          name: 'Article',
          component: Article,
        },
        {
          path: 'picture',
          name: 'picture',
          component: picture,
        }
      ]
    },
    {
      path: '/me',
      name: 'Me',
      component: Me
    }
  ]
})

router.beforeEach((to, from, next) => {
  next()
  // if(to.name == "Me"){
  //   if(localStorage.getItem("name") == null || localStorage.getItem("email") == null){
  //     alert("需要登录")
  //     next()
  //   }else {
  //     next()
  //   }
  // }else {
  //   next()
  // }
  
})

export default router