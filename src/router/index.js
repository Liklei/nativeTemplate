import Vue from 'vue'
import Router from 'vue-router'

const Main = resolve => require(['@/view/index'], resolve)

Vue.use(Router)

const router = new Router({
    routes: [{
            path: '/',
            name: 'Main',
            component: Main,
            meta: {
                title: 'APP原生交互',
                requiresAuth: true
            }
        },
    ]
})

router.beforeEach((to, from, next) => {
    window.document.title = to.meta.title;
    next();
})

export default router