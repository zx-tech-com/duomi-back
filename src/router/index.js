import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
			component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children:[
                {
                    path: 'foodcombo',
                    component: resolve => require(['../components/page/statistic/foodcombo.vue'], resolve),
                    meta: { title: '食品套餐数据' }
                },
				{
				    path: 'placeinfo',
				    component: resolve => require(['../components/page/statistic/placeinfo.vue'], resolve),
				    meta: { title: '柜子图' }
				},
				{
				    path: 'duomi',
				    component: resolve => require(['../components/page/address/duomi-place.vue'], resolve),
				    meta: { title: '投放点' }
				},
				{
				    path: 'duomi-place-list',
				    component: resolve => require(['../components/page/address/duomi-place-list.vue'], resolve),
				    meta: { title: '投放点' }
				},
				{
				    path: 'cabinet-list',
				    component: resolve => require(['../components/page/address/cabinet.vue'], resolve),
				    meta: { title: '投放点柜子' }
				},
				{
				    path: 'customer',
				    component: resolve => require(['../components/page/address/customer-place.vue'], resolve),
				    meta: { title: '用户地址' }
				},
				{
				    path: 'customer-place-list',
				    component: resolve => require(['../components/page/address/customer-place-list.vue'], resolve),
				    meta: { title: '用户地址' }
				},
				{
				    path: 'update-Constant',
				    component: resolve => require(['../components/page/updateConstant.vue'], resolve),
				    meta: { title: '常用变量' }
				},
				{
				    path: 'feedBack',
				    component: resolve => require(['../components/page/feedBack.vue'], resolve),
				    meta: { title: '意见与反馈' }
				},
                /* {
                    path: '/icon',
                    component: resolve => require(['../components/page/Icon.vue'], resolve),
                    meta: { title: '自定义图标' }
                },
                {
                    path: '/table',
                    component: resolve => require(['../components/page/BaseTable.vue'], resolve),
                    meta: { title: '基础表格' }
                },
                {
                    path: '/tabs',
                    component: resolve => require(['../components/page/Tabs.vue'], resolve),
                    meta: { title: 'tab选项卡' }
                },
                {
                    path: '/form',
                    component: resolve => require(['../components/page/BaseForm.vue'], resolve),
                    meta: { title: '基本表单' }
                },
                {
                    // 富文本编辑器组件
                    path: '/editor',
                    component: resolve => require(['../components/page/VueEditor.vue'], resolve),
                    meta: { title: '富文本编辑器' }
                },
                {
                    // markdown组件
                    path: '/markdown',
                    component: resolve => require(['../components/page/Markdown.vue'], resolve),
                    meta: { title: 'markdown编辑器' }    
                },
                {
                    // 图片上传组件
                    path: '/upload',
                    component: resolve => require(['../components/page/Upload.vue'], resolve),
                    meta: { title: '文件上传' }   
                },
                {
                    // vue-schart组件
                    path: '/charts',
                    component: resolve => require(['../components/page/BaseCharts.vue'], resolve),
                    meta: { title: 'schart图表' }
                },
                {
                    // 拖拽列表组件
                    path: '/drag',
                    component: resolve => require(['../components/page/DragList.vue'], resolve),
                    meta: { title: '拖拽列表' }
                },
                {
                    // 拖拽Dialog组件
                    path: '/dialog',
                    component: resolve => require(['../components/page/DragDialog.vue'], resolve),
                    meta: { title: '拖拽弹框' }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: resolve => require(['../components/page/Permission.vue'], resolve),
                    meta: { title: '权限测试', permission: true }
                }, */
				{
				    path: '/banner',
				    component: resolve => require(['../components/page/banner/banner-list.vue'], resolve),
				    meta: { title: '轮播图管理' }
				},
				{
				    path: '/food',
				    component: resolve => require(['../components/page/food/food-list.vue'], resolve),
				    meta: { title: '菜品管理' }
				},
				{
				    path: '/combo',
				    component: resolve => require(['../components/page/combo/combo-list.vue'], resolve),
				    meta: { title: '套餐管理' }
				},
				{
				    path: '/order',
				    component: resolve => require(['../components/page/order/order-list.vue'], resolve),
				    meta: { title: '订单管理' }
				},
                {
                    path: '/404',
                    component: resolve => require(['../components/page/404.vue'], resolve),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: resolve => require(['../components/page/403.vue'], resolve),
                    meta: { title: '403' }
                }
            ]
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
