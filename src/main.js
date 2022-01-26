import { createApp, h, ref } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import EditPage from './components/EditPage.vue'
import PrintPage from './components/PrintPage.vue'
import "@/assets/styles/main.css";
import "@/assets/styles/main.css";

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
