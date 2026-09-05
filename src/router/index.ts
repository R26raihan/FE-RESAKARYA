import { createRouter, createWebHistory } from 'vue-router';
import DashboardView from '@/views/DashboardView.vue';
import TriageQueueView from '@/views/TriageQueueView.vue';
import CompanyDetailView from '@/views/CompanyDetailView.vue';
import RegionalBenchmarkView from '@/views/RegionalBenchmarkView.vue';
import BapGeneratorView from '@/views/BapGeneratorView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
    },
    {
      path: '/triage',
      name: 'triage',
      component: TriageQueueView,
    },
    {
      path: '/companies',
      name: 'companies',
      component: TriageQueueView,
    },
    {
      path: '/companies/:id',
      name: 'company-detail',
      component: CompanyDetailView,
    },
    {
      path: '/benchmark',
      name: 'benchmark',
      component: RegionalBenchmarkView,
    },
    {
      path: '/bap-generator',
      name: 'bap-generator',
      component: BapGeneratorView,
    },
  ],
});

export default router;
