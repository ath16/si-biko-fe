import { createRouter, createWebHistory } from 'vue-router'

// Layouts
import AdminLayout from '@/components/layout/AdminLayout.vue'

// Views - Public & Auth
const LandingPage = () => import('@/views/Landing/LandingPage.vue')
const Signin = () => import('@/views/Auth/Signin.vue')
const Signup = () => import('@/views/Auth/Signup.vue')

// Views - Dashboard & Profil
const Dashboard = () => import('@/views/Dashboard/MainDashboard.vue')
const UserProfile = () => import('@/views/Profile/UserProfile.vue')
const EditProfileRequest = () => import('@/views/Profile/FormEditProfil.vue')

// Views - Ajuan (Inti Sistem)
const ListAjuan = () => import('@/views/Ajuan/ListAjuan.vue')
const FormAjuan = () => import('@/views/Ajuan/FormAjuan.vue')
const DetailAjuan = () => import('@/views/Ajuan/DetailAjuan.vue')
const CetakSurat = () => import('@/views/Ajuan/CetakSurat.vue')

// Views - Admin
const UserManagement = () => import('@/views/Admin/UserManagement.vue')
const LaporanStatistik = () => import('@/views/Admin/LaporanStatistik.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 1. Landing Page (Guest)
    {
      path: '/',
      name: 'landing',
      component: LandingPage,
      meta: { title: 'Selamat Datang' }
    },

    // 2. Authentication
    {
      path: '/auth/signin',
      name: 'signin',
      component: Signin,
      meta: { title: 'Masuk Sistem' }
    },
    {
      path: '/auth/signup',
      name: 'signup',
      component: Signup,
      meta: { title: 'Daftar Akun Mahasiswa' }
    },

    // 3. Main Application (Butuh Login)
    {
      path: '/app',
      component: AdminLayout,
      children: [
        // --- DASHBOARD ---
        {
          path: 'dashboard',
          name: 'dashboard',
          component: Dashboard,
          meta: { title: 'Dashboard Utama' }
        },

        // --- PROFIL ---
        {
          path: 'profil',
          name: 'profil',
          component: UserProfile,
          meta: { title: 'Profil Saya' }
        },
        {
          path: 'profil/edit-request',
          name: 'profil-edit',
          component: EditProfileRequest,
          meta: { title: 'Ajukan Perubahan Data' }
        },

        // --- MODUL AJUAN (Mhs, Dosen, WD3) ---
        {
          path: 'ajuan',
          name: 'ajuan-list',
          component: ListAjuan,
          meta: { title: 'Daftar Konseling' }
        },
        {
          path: 'ajuan/tambah',
          name: 'ajuan-tambah',
          component: FormAjuan,
          meta: { title: 'Buat Ajuan Baru' }
        },
        {
          path: 'ajuan/:id',
          name: 'ajuan-detail',
          component: DetailAjuan,
          meta: { title: 'Detail Konseling' }
        },
        {
          path: 'ajuan/:id/cetak',
          name: 'ajuan-cetak',
          component: CetakSurat,
          meta: { title: 'Cetak Surat Rujukan' }
        },

        // --- MODUL ADMIN ---
        {
          path: 'admin/users',
          name: 'admin-users',
          component: UserManagement,
          meta: { title: 'Manajemen Pengguna' }
        },
        {
          path: 'admin/laporan',
          name: 'admin-laporan',
          component: LaporanStatistik,
          meta: { title: 'Laporan Statistik' }
        }
      ]
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | SI-BIKO`
  next()
})

export default router
