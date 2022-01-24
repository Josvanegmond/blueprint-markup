import { createApp, h, ref } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import './index.css'

import EditPage from './components/EditPage.vue'
import PrintPage from './components/PrintPage.vue'

const routes = [
    {
        path: '/',
        component: EditPage
    },
    {
        path: '/print',
        component: PrintPage
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

createApp({})
    .use(router)
    .mount('#app')
