import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { apiClient } from '@/api/client';

export type UserRole = 'admin' | 'user';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  institution: string;
  badge: string;
  companyName?: string;
  companyProvinsi?: string;
  companySektor?: string;
  phone?: string;
}

const FALLBACK_ADMIN: AuthUser = {
  id: 'USR-ADM-001',
  name: 'Raihan Setiawan, S.Kom',
  email: 'wasrik@bpjs-kesehatan.go.id',
  role: 'admin',
  institution: 'Kedeputian Pengawasan & Pemeriksaan BPJS Kesehatan',
  badge: 'Petugas Wasrik Nasional',
};

const FALLBACK_USER: AuthUser = {
  id: 'USR-BU-001',
  name: 'Dimas Prabowo (HR Lead)',
  email: 'hr@nusantaratech.co.id',
  role: 'user',
  institution: 'PT Nusantara Tech Solusindo',
  badge: 'PIC Badan Usaha e-Dabu',
  companyName: 'PT Nusantara Tech Solusindo',
  companyProvinsi: 'DKI Jakarta',
  companySektor: 'J - Informasi & Komunikasi',
};

export const useAuthStore = defineStore('auth', () => {
  const storedAuth = localStorage.getItem('reksakarya_auth');
  const storedToken = localStorage.getItem('reksakarya_token');

  const initialUser: AuthUser = storedAuth ? JSON.parse(storedAuth) : FALLBACK_ADMIN;

  const currentUser = ref<AuthUser>(initialUser);
  const isAuthenticated = ref<boolean>(!!storedToken || !!storedAuth);
  const token = ref<string | null>(storedToken);
  const demoAccounts = ref<any[]>([]);

  const role = computed(() => currentUser.value.role);
  const isAdmin = computed(() => currentUser.value.role === 'admin');
  const isUser = computed(() => currentUser.value.role === 'user');

  function saveSession(user: AuthUser, authToken?: string) {
    currentUser.value = user;
    isAuthenticated.value = true;
    if (authToken) {
      token.value = authToken;
      localStorage.setItem('reksakarya_token', authToken);
    }
    localStorage.setItem('reksakarya_auth', JSON.stringify(user));
  }

  async function login(email: string, password: string = 'admin123', targetRole?: UserRole) {
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
    } catch (err: any) {
      console.warn('[Auth] API login failed, attempting local fallback:', err?.message);
      // Fallback if backend API is unreachable
      const selectedRole = targetRole || (email.includes('bpjs') || email.includes('admin') ? 'admin' : 'user');
      const fallback = selectedRole === 'admin' ? { ...FALLBACK_ADMIN, email } : { ...FALLBACK_USER, email };
      saveSession(fallback, 'demo-token');
      return { success: true, user: fallback };
    }
    return { success: false, message: 'Gagal login' };
  }

  async function fetchDemoAccounts() {
    try {
      const res = await apiClient.get('/auth/demo-accounts');
      if (res.data && Array.isArray(res.data)) {
        demoAccounts.value = res.data;
        return res.data;
      }
    } catch (e) {
      // ignore fallback
    }
    return [];
  }

  function switchRole(targetRole: UserRole) {
    if (targetRole === 'admin') {
      saveSession(FALLBACK_ADMIN, 'demo-admin-token');
    } else {
      saveSession(FALLBACK_USER, 'demo-user-token');
    }
  }

  function logout() {
    currentUser.value = FALLBACK_ADMIN;
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
    demoAccounts,
    login,
    fetchDemoAccounts,
    switchRole,
    logout,
  };
});
