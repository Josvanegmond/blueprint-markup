import { createApp, h } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'

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

createApp({
    render: ()=>h(App)
})
    .use(router)
    .mount('#app')
