import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'cesiumContainer',
    component: () => import('@/views/CesiumContainer.vue')
}]

const router = new VueRouter({
    base: process.env.BASE_URL,
    routes
})

export default router
