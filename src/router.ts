import { createRouter, createWebHistory } from 'vue-router'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: () => import('./views/DashboardView.vue'), meta: { title: '工作台' } },
    { path: '/events', component: () => import('./views/EventsView.vue'), meta: { title: '活动管理' } },
    { path: '/events/:id', component: () => import('./views/EventDetailView.vue'), meta: { title: '活动详情' } },
    { path: '/organization', redirect: '/organization/enterprises' },
    { path: '/organization/enterprises', component: () => import('./views/organization/OrganizationList.vue'), props: { kind: 'enterprises' }, meta: { title: '企业管理' } },
    { path: '/organization/enterprises/:id', component: () => import('./views/organization/OrganizationDetail.vue'), props: { kind: 'enterprises' }, meta: { title: '企业管理详情' } },
    { path: '/organization/regions', component: () => import('./views/organization/OrganizationList.vue'), props: { kind: 'regions' }, meta: { title: '区域管理' } },
    { path: '/organization/regions/:id', component: () => import('./views/organization/OrganizationDetail.vue'), props: { kind: 'regions' }, meta: { title: '区域管理详情' } },
    { path: '/organization/members', component: () => import('./views/organization/OrganizationList.vue'), props: { kind: 'members' }, meta: { title: '成员管理' } },
    { path: '/organization/members/:id', component: () => import('./views/organization/OrganizationDetail.vue'), props: { kind: 'members' }, meta: { title: '成员管理详情' } },
    { path: '/organization/roles', component: () => import('./views/organization/OrganizationList.vue'), props: { kind: 'roles' }, meta: { title: '角色权限' } },
    { path: '/organization/roles/:id', component: () => import('./views/organization/OrganizationDetail.vue'), props: { kind: 'roles' }, meta: { title: '角色权限详情' } },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior: () => ({ top: 0 }),
})
