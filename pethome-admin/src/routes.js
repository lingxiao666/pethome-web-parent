import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Table from './views/nav1/Table.vue'
import Form from './views/nav1/Form.vue'
import user from './views/nav1/user.vue'
import Page4 from './views/nav2/Page4.vue'
import Page5 from './views/nav2/Page5.vue'
import Page6 from './views/nav3/Page6.vue'
import echarts from './views/charts/echarts.vue'
import Department from './views/org/department.vue'
import Employee from './views/org/Employee.vue'

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
        name: '首页',
        leaf: true,//只有一个子节点
        iconCls: 'fa fa-bar-chart',
        children: [
            {path: '/echarts', component: echarts, name: '首页'}
        ]
    },
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: '组织机构管理',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            {path: '/department', component: Department, name: '部门管理'},
            {path: '/employee', component: Employee, name: '员工管理'},
           /* {path: '/shop', component: user, name: '机构管理'},*/
        ]
    },
    {
        path: '/',
        component: Home,
        name: '系统管理',
        iconCls: 'fa fa-id-card-o',
        children: [
            {path: '/page4', component: Page4, name: '页面4'},
            {path: '/page5', component: Page5, name: '页面5'}
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-address-card',
        leaf: true,//只有一个节点
        children: [
            {path: '/page6', component: Page6, name: '导航三'}
        ]
    },

    {
        path: '*',
        hidden: true,
        redirect: {path: '/404'}
    }
];

export default routes;