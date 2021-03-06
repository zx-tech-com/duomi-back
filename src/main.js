import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios';
import qs from 'qs';
import ElementUI from 'element-ui';
import config from './components/utils/config.js';
import util from './components/utils/common-function.js';
// import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
import './assets/css/theme-green/index.css';   // 浅绿色主题
import './assets/css/icon.css';
import './components/common/directives';
import "babel-polyfill";

Vue.config.productionTip = false
Vue.use(ElementUI, {
    size: 'small'
});
Vue.prototype.$jsonAxios = axios.create({
	baseURL : config.baseUrl,
	withCredentials : true,
	headers:{
		'Back-Request':'true'
	},
	//这里主要是在发送请求之前 显示loading图标
	transformRequest : [function(data,header){
		vue.$data.showLoadingIcon = true;
		return data;
	}],
	transformResponse: [function (data) {
		vue.$data.showLoadingIcon = false;
		return JSON.parse(data);
	}],
});
Vue.prototype.$jaxios = axios.create({
	baseURL : config.baseUrl,
	withCredentials : true,
	headers:{
		"Content-type":"application/json",
		'Back-Request':'true'
	},

});
Vue.prototype.$qs = qs;
Vue.prototype.$urlConfig = config;
Vue.prototype.$util = util;
//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    const role = sessionStorage.getItem('ms_username');
    if (!role && to.path !== '/') {
        next('/');
    } else if (to.meta.permission) {
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        role === 'admin' ? next() : next('/403');
    } else {
        // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
        if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
            Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                confirmButtonText: '确定'
            });
        } else {
            next();
        }
    }
})


var vue = new Vue({
	data : {
		showLoadingIcon : false
	},
	headers : {
		'Back-Request':'true'
	},
    router,
    render: h => h(App)
}).$mount('#app')