import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

// Import Layouts
import AdminLayout from '@/components/layout/AdminLayout.vue'
import AuthLayout from '@/components/layout/AuthLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 1. LANDING PAGE (Public)
    {
      path: '/',
      name: 'landing',
      component: () => import('@/views/Landing/LandingPage.vue'),
      meta: { title: 'Selamat Datang' }
    },

    // 2. AUTHENTICATION (Login/Register)
    {
      path: '/auth',
      component: AuthLayout, // Menggunakan Layout khusus Auth
      children: [
        {
          path: 'signin',
          name: 'signin',
          component: () => import('@/views/Auth/Signin.vue'),
          meta: { title: 'Masuk Sistem' }
        },
        {
          path: 'signup',
          name: 'signup',
          component: () => import('@/views/Auth/Signup.vue'),
          meta: { title: 'Daftar Akun' }
        }
      ]
    },

    // 3. MAIN APP (Perlu Login)
    {
      path: '/app',
      component: AdminLayout, // Layout Dashboard (Sidebar + Header)
      meta: { requiresAuth: true },
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/views/Dashboard/MainDashboard.vue'),
          meta: { title: 'Dashboard Utama' }
        },

        // --- Modul Inti: AJUAN KONSELING ---
        {
          path: 'ajuan',
          name: 'ajuan-list',
          component: () => import('@/views/Ajuan/ListAjuan.vue'),
          meta: { title: 'Daftar Konseling' }
        },
        {
          path: 'ajuan/tambah',
          name: 'ajuan-create',
          component: () => import('@/views/Ajuan/FormAjuan.vue'),
          meta: { title: 'Buat Ajuan Baru' }
        },
        {
          path: 'ajuan/:id',
          name: 'ajuan-detail',
          component: () => import('@/views/Ajuan/DetailAjuan.vue'),
          meta: { title: 'Detail Konseling' }
        },
        {
          path: 'ajuan/:id/cetak',
          name: 'ajuan-print',
          component: () => import('@/views/Ajuan/CetakSurat.vue'),
          meta: { title: 'Cetak Surat Rujukan' }
        },

        // --- Modul: PROFIL ---
        {
          path: 'profile',
          name: 'profile',
          component: () => import('@/views/Profile/UserProfile.vue'),
          meta: { title: 'Profil Saya' }
        },
        {
          path: 'profile/edit-request',
          name: 'profile-edit',
          component: () => import('@/views/Profile/EditRequest.vue'),
          meta: { title: 'Pengajuan Perubahan Data' }
        },

        // --- Modul: ADMIN ---
        {
          path: 'admin/users',
          name: 'admin-users',
          component: () => import('@/views/Admin/UserManagement.vue'),
          meta: { title: 'Manajemen Pengguna' }
        },
        {
          path: 'admin/laporan',
          name: 'admin-laporan',
          component: () => import('@/views/Admin/Laporan.vue'),
          meta: { title: 'Laporan Statistik' }
        }
      ]
    },

    // 4. ERROR PAGES (Tangkap link 404)
    {
      path: '/:pathMatch(.*)*',
      component: () => import('@/views/Errors/FourZeroFour.vue'),
      meta: { title: 'Halaman Tidak Ditemukan' }
    }
  ],

  // Scroll ke atas saat pindah halaman
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  }
})

// GLOBAL GUARD: Cek Auth & Set Title
router.beforeEach((to, from, next) => {
  // Update Title Browser
  document.title = `${to.meta.title} | SI-BIKO`

  const { isAuthenticated } = useAuth()

  // Logic Redirect
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next('/auth/signin')
  } else if (to.path.startsWith('/auth') && isAuthenticated.value) {
    next('/app/dashboard')
  } else {
    next()
  }
})

export default router
