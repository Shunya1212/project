
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/SignUpPage.vue') },
      { path: '/login', component: () => import('pages/LoginPage.vue') },
      { path: '/request', component: () => import('pages/RequestPage.vue') },
      { path: '/item', component: () => import('pages/ItemPage.vue') },
      { path: '/transaction', component: () => import('pages/TransactionPage.vue') },
      { path: '/staff', component: () => import('pages/StaffPage.vue') },
      { path: '/dashboard', component: () => import('pages/DashBoardPage.vue') }
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
