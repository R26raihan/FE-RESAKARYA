import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '@/views/DashboardView.vue';
import TriageQueueView from '@/views/TriageQueueView.vue';
import CompanyListView from '@/views/CompanyListView.vue';
import CompanyDetailView from '@/views/CompanyDetailView.vue';
import RegionalBenchmarkView from '@/views/RegionalBenchmarkView.vue';
import BapGeneratorView from '@/views/BapGeneratorView.vue';
import RegulationView from '@/views/RegulationView.vue';
import LoginView from '@/views/LoginView.vue';
import UserPortalView from '@/views/UserPortalView.vue';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { public: true },
    },
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresRole: 'admin' },
    },
    {
      path: '/portal-bu',
      name: 'portal-bu',
      component: UserPortalView,
      meta: { requiresAuth: true },
    },
    {
      path: '/triage',
      name: 'triage',
      component: TriageQueueView,
      meta: { requiresRole: 'admin' },
    },
    {
      path: '/companies',
      name: 'companies',
      component: CompanyListView,
      meta: { requiresRole: 'admin' },
    },
    {
      path: '/companies/:id',
      name: 'company-detail',
      component: CompanyDetailView,
      meta: { requiresRole: 'admin' },
    },
    {
      path: '/benchmark',
      name: 'benchmark',
      component: RegionalBenchmarkView,
      meta: { requiresRole: 'admin' },
    },
    {
      path: '/bap-generator',
      name: 'bap-generator',
      component: BapGeneratorView,
      meta: { requiresRole: 'admin' },
    },
    {
      path: '/regulation',
      name: 'regulation',
      component: RegulationView,
      meta: { requiresAuth: true },
    },
    {
      path: '/methodology',
      name: 'methodology',
      component: RegulationView,
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();

  if (to.meta.public) {
    if (to.name === 'login' && authStore.isAuthenticated) {
      if (authStore.role === 'user') {
        return next('/portal-bu');
      } else {
        return next('/');
      }
    }
    return next();
  }

  if (!authStore.isAuthenticated) {
    return next('/login');
  }

  if (to.meta.requiresRole === 'admin' && authStore.role !== 'admin') {
    return next('/portal-bu');
  }

  next();
});

export default router;


