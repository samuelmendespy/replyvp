import { createRouter, createWebHistory } from 'vue-router';
import { useToast } from "vue-toastification";

import AppHome from '../components/AppHome.vue';

import ContactUs from '@/components/pages/ContactUs.vue';
import TermsPage from '@/components/pages/TermsPage.vue';
import PrivacyPolicyPage from '@/components/pages/PrivacyPolicyPage.vue';
import NotFoundPage from '@/components/pages/NotFoundPage.vue';

import LoginPage from '@/components/pages/user/LoginPage.vue';
import RegisterPage from '@/components/pages/user/RegisterPage.vue';
import DashboardPage from '@/components/pages/user/DashboardPage.vue';
import TerminateAccount from '@/components/pages/user/TerminateAccount.vue';

import MessagesPage from '@/components/pages/tickets/MessagesPage.vue';
import FinishedList from '@/components/pages/tickets/FinishedList.vue';
import UnansweredList from '@/components/pages/tickets/UnansweredList.vue';
import TicketSearchPage from '@/components/pages/tickets/TicketSearchPage.vue';
import TicketHistoryPage from '@/components/pages/tickets/TicketHistoryPage.vue';
import NewTicketPage from '@/components/pages/tickets/NewTicketPage.vue';

import AdminRolesPage from '@/components/pages/admin/AdminRolesPage.vue';

const routes = [
  { path: '/', name: 'AppHome', component: AppHome },
  { path: '/:catchAll(.*)', name: 'NotFoundPage', component: NotFoundPage},
  { path: '/contact', name: 'ContactUs', component: ContactUs},
  { path: '/messages', name: 'MessagesPage', component: MessagesPage, meta: { requiresAuth: true }},
  { path: '/login', name: 'LoginPage', component: LoginPage},
  { path: '/register', name: 'RegisterPage', component: RegisterPage},
  { path: '/terminate', name: 'TerminateAccount', component: TerminateAccount},
  { path: '/policy', name: 'PrivacyPolicyPage', component: PrivacyPolicyPage},
  { path: '/terms', name: 'TermsPage', component: TermsPage},
  { path: '/dashboard', name: 'DashboardPage', component: DashboardPage, meta: { requiresAuth: true }},
  { path: '/tickets/search', name: 'TicketSearchPage', component: TicketSearchPage, meta: {requiresAuth: true }},
  { path: '/tickets/history', name: 'TicketHistoryPage', component: TicketHistoryPage, meta: {requiresAuth: true }},
  { path: '/tickets/new', name: 'NewTicketPage', component: NewTicketPage },
  { path: '/finished', name: 'FinishedList', component: FinishedList, meta: {requiresAdmin: true }},
  { path: '/support/pending', name: 'UnansweredList', component: UnansweredList, meta: {requiresSupport: true }},
  { path: '/roles', name: 'AdminRolesPage', component: AdminRolesPage, meta: {requiresAdmin: true }}
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const toast = useToast();

router.beforeEach((to, from, next) => {
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin);
  const requiresManager = to.matched.some((record) => record.meta.requiresManager);
  const requiresSupport = to.matched.some((record) => record.meta.requiresSupport);
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const user = JSON.parse(localStorage.getItem("user"));

  if (requiresAuth) {
    if(!user || !user.token){
      toast.warning('Necessário fazer login!', { timeout: 3000 });
      next("/login");
    }
  }

  if (requiresAdmin) { 
    if (!user || !user.roles.includes('admin')) {
      toast.warning('Conteúdo com acesso restrito para administradores!', { timeout: 3000 });
      return next({ path: '/' });
    } 
  }
  
  if (requiresManager) {
    if (!user || (!user.roles.includes('admin') && !user.roles.includes('manager'))) {
      toast.error('Conteúdo restrito para administradores!', { timeout: 3000 });
      return next({path: '/'});
    }
  }
  
  if (requiresSupport) {
    if (!user || (!user.roles.includes('admin') && !user.roles.includes('manager') && !user.roles.includes('support'))) {
      toast.error('Conteúdo restrito para funcionários!', { timeout: 3000 });
      return next({path: '/'});
    }
  }
  
  return next();
});

export default router;