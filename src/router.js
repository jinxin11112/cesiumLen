import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

export default new VueRouter({
    base: process.env.BASE_URL,
    routes: [{
        path: '/',
        redirect: '/drawPoint'
    }, {
        path: '/drawRadar',
        name: 'drawRadar',
        component: () => import('@/views/DrawRadar.vue')
    }, {
        path: '/drawPoint',
        name: 'drawPoint',
        component: () => import('@/views/DrawPoint.vue')
    }]
})
