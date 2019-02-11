// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueCookies from 'vue-cookies';
import md5 from 'js-md5';
import moment from "moment";
Vue.use(VueCookies)
Vue.use(ElementUI);
Vue.config.productionTip = false
Vue.prototype.$axios= axios
Vue.prototype.$md5 = md5;
Vue.prototype.$moment = moment;
// 发送request请求拦截器
// axios.defaults.baseURL = 'http://jewelry.mpjewel.top:8082/'
axios.interceptors.request.use(function(config) {
	// if (config.method === "post") {
	// 	config.data = qs.stringify(config.data)
	// }
	return config;
}, function(error) {
	// Do something with request error
	return Promise.reject(error);
});


// 响应数据的拦截器
axios.interceptors.response.use(function(response) {
	// Do something with response data
	return response;
}, function(error) {
	// Do something with response error
	return Promise.reject(error);
});
// 路由判断登录 根据路由配置文件的参数

router.beforeEach((to, from, next) => {
	if (to.matched.some(record => record.meta.requireAuth)){ // 判断该路由是否需要登录权限
	 if (to.matched.record != true) { // 判断当前的token是否存在 ； 登录存入的token
	  next();
	 }
	 else {
	  next({
	   path: '/',
	   query: {redirect: to.fullPath} // 将跳转的路由path作为参数，登录成功后跳转到该路由
	  })
	 }
	}
	else {
	 next();
	}
   });

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  render: h => h(App),

})

