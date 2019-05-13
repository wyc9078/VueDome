
import Vue from 'vue'
import axios from 'axios'
import Toast from 'muse-ui-toast'

import NProgress from 'muse-ui-progress';
import 'muse-ui-progress/dist/muse-ui-progress.css';
Vue.use(NProgress);

Vue.use(Toast);

axios.defaults.baseURL = 'http://www.yuezhi.ml:5555/';
// axios.defaults.baseURL = 'http://127.0.0.1:8080/';
axios.defaults.timeout = 3000;

// 在前端发生给后端ajax中间进行一次拦截
axios.interceptors.request.use(config => {
    NProgress.start();
    return config;
  }, error => {
    Toast.error({
        position: 'top-start',
        time: 2000,
        message: "您的网络不好，请检查1"
    });
    return Promise.reject(error);
  });

// 在后端返回数据给前端之前拦截一下，主要做错误码的判断
axios.interceptors.response.use(response => {
    NProgress.done();
    switch (response.status) {
        case 200:
            return response;
            break;
        default:
            Toast.error({
                position: 'top-start',
                time: 2000,
                message: "请求失败"
            });
            break;
    }
  
  }, error => {
    // 对响应错误做点什么
    return Promise.reject(error);
});


export default {
    /**
    * Get请求
    * @param {*object} params 请求参数
    * {
    *   url: "/index", // url地址
    *   par : { // 请求参数
    * 
    *   }
    * }
    */
    Get (params,callback){
        axios.get(params.url, {
            params: params.par
        })
        .then(success => {
            callback(success)
        })
        .catch(error => {
            Toast.error({
                position: 'top-start',
                time: 2000,
                message: "GET 您的网络不好，请检查2"
            });;
        });
    },

    Post (params,callback) {
        axios.post(params.url, params.par)
        .then(response => {
            callback(response);
        })
        .catch(error => {
            Toast.error({
                position: 'top-start',
                time: 2000,
                message: "POST 您的网络不好，请检查3"
            });;
        });
    }
}