import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { apiClient } from '@/api/client';

export type UserRole = 'admin' | 'user';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company_id?: string | null;
  institution: string;
  badge: string;
  companyName?: string;
  companyProvinsi?: string;
  companySektor?: string;
  phone?: string;
}

export const useAuthStore = defineStore('auth', () => {
  const storedAuth = localStorage.getItem('reksakarya_auth');
  const storedToken = localStorage.getItem('reksakarya_token');

  const currentUser = ref<AuthUser | null>(storedAuth ? JSON.parse(storedAuth) : null);
  const isAuthenticated = ref<boolean>(!!storedToken && !!storedAuth);
  const token = ref<string | null>(storedToken);
  const demoAccounts = ref<any[]>([]);

  const role = computed<UserRole | null>(() => currentUser.value?.role || null);
  const isAdmin = computed(() => currentUser.value?.role === 'admin');
  const isUser = computed(() => currentUser.value?.role === 'user');
  const companyId = computed(() => currentUser.value?.company_id || null);

  function saveSession(user: AuthUser, authToken: string) {
    currentUser.value = user;
    isAuthenticated.value = true;
    token.value = authToken;
    localStorage.setItem('reksakarya_token', authToken);
    localStorage.setItem('reksakarya_auth', JSON.stringify(user));
  }

  async function login(email: string, password: string = 'admin123') {
    try {
      const res = await apiClient.post('/auth/login', {
        email: email.trim(),
        password: password,
      });

      if (res.data && res.data.user) {
        const u = res.data.user;
        const authUser: AuthUser = {
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role as UserRole,
          company_id: u.company_id || null,
          institution: u.institution || (u.role === 'admin' ? 'BPJS Kesehatan' : u.company_name),
          badge: u.badge || (u.role === 'admin' ? 'Petugas Wasrik' : 'PIC Badan Usaha'),
          companyName: u.company_name,
          companyProvinsi: u.company_provinsi,
          companySektor: u.company_sektor,
          phone: u.phone,
        };
        saveSession(authUser, res.data.access_token);
        return { success: true, user: authUser };
      }
      return { success: false, message: 'Format response tidak valid dari server' };
    } catch (err: any) {
      const msg = err?.response?.data?.detail || err?.message || 'Gagal login. Periksa email dan kata sandi Anda.';
      return { success: false, message: msg };
    }
  }

  async function fetchDemoAccounts() {
    try {
      const res = await apiClient.get('/auth/demo-accounts');
      if (res.data && Array.isArray(res.data)) {
        demoAccounts.value = res.data;
        return res.data;
      }
    } catch (e: any) {
      console.warn('[Auth] Gagal memuat daftar akun demo dari database:', e?.message);
    }
    return [];
  }

  function logout() {
    currentUser.value = null;
    isAuthenticated.value = false;
    token.value = null;
    localStorage.removeItem('reksakarya_auth');
    localStorage.removeItem('reksakarya_token');
  }

  return {
    currentUser,
    isAuthenticated,
    token,
    role,
    isAdmin,
    isUser,
    companyId,
    demoAccounts,
    login,
    fetchDemoAccounts,
    logout,
  };
});
