import { createRouter, createWebHistory } from 'vue-router'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: () => import('./views/DashboardView.vue'), meta: { title: '工作台' } },
    { path: '/events', component: () => import('./views/EventsView.vue'), meta: { title: '活动管理' } },
    { path: '/events/:id', component: () => import('./views/EventDetailView.vue'), meta: { title: '活动详情' } },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior: () => ({ top: 0 }),
})
