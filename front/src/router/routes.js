
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/RequestPage.vue') },
      { path: '/login', component: () => import('pages/LoginPage.vue') },
      { path: '/item', component: () => import('pages/ItemPage.vue') },
      { path: '/staff', component: () => import('pages/StaffPage.vue') },
      { path: '/trans', component: () => import('pages/TransactionPage.vue') },
      { path: '/dashb', component: () => import('pages/DashBoardPage.vue') },
      { path: '/register', component: () => import('pages/RegisterPage.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
