import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Admin from './views/admin/Admin.vue'
import ChargeRule from './views/admin/ChargeRule.vue'
import LuggageStorage from './views/luggage-storage/LuggageStorage.vue'
import LuggageType from './views/luggage-type/LuggageType.vue'
import Turnover from './views/turnover-record/Turnover.vue'
import OverdueRecord from './views/overdue-record/OverdueRecord.vue'
import PickupRecord from './views/pickup-record/PickupRecord.vue'
import CompensateRecord from './views/compensate-record/CompensateRecord.vue'
import LostRegisterRecord from './views/lost-register-record/LostRegisterRecord.vue'
import TurnoverByFeeTypeChart from './views/charts/TurnoverByFeeTypeChart.vue'
import TurnoverByAdminChart from './views/charts/TurnoverByAdminChart.vue'

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
    {
        path: '/',
        component: Home,
        name: '营业额可视化数据',
        iconCls: 'fa fa-bar-chart',
        children: [
            { path: '/main', component: Main, name: '主页', hidden: true },
            { path: '/turnover/statistics_by_admin', component: TurnoverByAdminChart, name: '按工作人员分组' },
            { path: '/turnover/statistics_by_fee_type', component: TurnoverByFeeTypeChart, name: '按费用类型分组' }
            
        ]
    },
    {
        path: '/',
        component: Home,
        name: '管理员模块',
        iconCls: 'el-icon-message', //图标样式class
        children: [
            { path: '/admin', component: Admin, name: '管理员信息' },
            { path: '/rule', component: ChargeRule, name: '计费规则信息' },
            { path: '/luggage_type', component: LuggageType, name: '行李类型' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '行李寄存模块',
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/storage', component: LuggageStorage, name: '行李寄存记录' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '行李取件模块',
        iconCls: 'fa fa-bar-chart',
        children: [
            { path: '/pickup', component: PickupRecord, name: '行李取件记录' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '行李逾期未取清理模块',
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/overdue', component: OverdueRecord, name: '行李逾期记录' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '行李遗失登记模块',
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/register', component: LostRegisterRecord, name: '行李遗失登记记录' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '行李遗失赔偿模块',
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/compensate', component: CompensateRecord, name: '行李遗失赔偿记录' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '营业额记录模块',
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/turnover', component: Turnover, name: '营业额记录' }
        ]
    },
    
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;