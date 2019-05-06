import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Admin from './views/admin/Admin.vue'
import Form from './views/admin/Form.vue'
import Page4 from './views/luggage-storage/Page4.vue'
import Page5 from './views/luggage-storage/Page5.vue'
import LuggageStorage from './views/luggage-storage/LuggageStorage.vue'
import LuggageType from './views/luggage-type/LuggageType.vue'
import echarts from './views/charts/echarts.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: '管理员模块',
        iconCls: 'el-icon-message', //图标样式class
        children: [
            { path: '/main', component: Main, name: '主页', hidden: true },
            { path: '/admin', component: Admin, name: 'Admin' },
            { path: '/form', component: Form, name: 'Form' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '行李寄存模块',
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/page4', component: Page4, name: '页面4' },
            { path: '/page5', component: Page5, name: '页面5' },
            { path: '/storage', component: LuggageStorage, name: 'luggageStorage' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '行李类型',
        iconCls: 'fa fa-address-card',
        leaf: true,//只有一个节点
        children: [
            { path: '/luggage_type', component: LuggageType, name: 'luggage_type' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: 'Charts',
        iconCls: 'fa fa-bar-chart',
        children: [
            { path: '/echarts', component: echarts, name: 'echarts' }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;