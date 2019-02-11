import Vue from 'vue'
import VueRouter from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import { request } from 'https';
Vue.use(VueRouter)

const Router = new VueRouter({
  mode: 'history',
  routes: [
    {
      component:require('@/components/Login').default,
      path:'/',
      name:'Login'
    },
    {
    component: HelloWorld,
    path: '/HelloWorld',
    name:'HelloWorld',
    
    children: [{
        path: '/Sidebar',
        component: require('@/components/Sidebar').default,
        name: 'Sidebar',
        children:[
          {
            path:'/Consultation',
            component:require('@/components/chlidren/Consultation').default,
            name:'Consultation',
            meta: {
              requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
           }
          },
          {
            path:'/Order',
            component:require('@/components/chlidren/Order').default,
            name:'Order',
          },{
            path:'/Ctable',
            component:require('@/components/chlidren/Ctable').default,
            name:'Ctable'
          },{
            path:'/Category',
            component:require('@/components/chlidren/Category').default,
            name:'Category'
          },{
            path:'/Administrators',
            component:require('@/components/chlidren/Administrators').default,
            name:'Administrators'
          },{
            path:'/Customer',
            component:require('@/components/chlidren/Customer').default,
            name:'Customer'
          },{
            path:'/Gemstone',
            component:require('@/components/chlidren/Gemstone').default,
            name:'Gemstone'
          },{
            path:'/Payment',
            component:require('@/components/chlidren/Payment').default,
            name:'Payment'
          },{
            path:'/Merchant',
            component:require('@/components/chlidren/Merchant').default,
            name:'Merchant'
          },{
            path:'/OrderExplain',
            component:require('@/components/chlidren/OrderExplain').default,
            name:'OrderExplain'
          }
        ],redirect:'/Consultation' 
     }
    ],redirect:'/Sidebar'
  }]
})

export default Router;
