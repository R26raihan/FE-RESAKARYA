import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

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
}

const DEMO_ADMIN: AuthUser = {
  id: 'ADM-001',
  name: 'Raihan Setiawan, S.Kom',
  email: 'wasrik@bpjs-kesehatan.go.id',
  role: 'admin',
  institution: 'Kedeputian Pengawasan & Pemeriksaan BPJS Kesehatan',
  badge: 'Petugas Wasrik Nasional',
};

const DEMO_USER: AuthUser = {
  id: 'BU-USER-01',
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
  const initialUser: AuthUser = storedAuth ? JSON.parse(storedAuth) : DEMO_ADMIN;

  const currentUser = ref<AuthUser>(initialUser);
  const isAuthenticated = ref<boolean>(true);

  const role = computed(() => currentUser.value.role);
  const isAdmin = computed(() => currentUser.value.role === 'admin');
  const isUser = computed(() => currentUser.value.role === 'user');

  function saveUser(user: AuthUser) {
    currentUser.value = user;
    isAuthenticated.value = true;
    localStorage.setItem('reksakarya_auth', JSON.stringify(user));
  }

  function login(email: string, _password?: string, targetRole?: UserRole) {
    const selectedRole = targetRole || (email.includes('bpjs') || email.includes('admin') ? 'admin' : 'user');
    
    if (selectedRole === 'admin') {
      saveUser({
        ...DEMO_ADMIN,
        email: email || DEMO_ADMIN.email,
      });
    } else {
      saveUser({
        ...DEMO_USER,
        email: email || DEMO_USER.email,
      });
    }
  }

  function switchRole(targetRole: UserRole) {
    if (targetRole === 'admin') {
      saveUser(DEMO_ADMIN);
    } else {
      saveUser(DEMO_USER);
    }
  }

  function logout() {
    currentUser.value = DEMO_ADMIN; // default fallback
    isAuthenticated.value = false;
    localStorage.removeItem('reksakarya_auth');
  }

  return {
    currentUser,
    isAuthenticated,
    role,
    isAdmin,
    isUser,
    login,
    switchRole,
    logout,
  };
});
