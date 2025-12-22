import { createRouter, createWebHistory } from 'vue-router'

// Layouts
import AdminLayout from '@/components/layout/AdminLayout.vue'

// Views (load secara Lazy Load agar ringan)
const LandingPage = () => import('@/views/Landing/LandingPage.vue')
const Signin = () => import('@/views/Auth/Signin.vue')
const Signup = () => import('@/views/Auth/Signup.vue')
const Dashboard = () => import('@/views/Dashboard/MainDashboard.vue')
const UserProfile = () => import('@/views/Profile/UserProfile.vue')

// Views - Ajuan (Mahasiswa & Dosen)
const ListAjuan = () => import('@/views/Ajuan/ListAjuan.vue')
const FormAjuan = () => import('@/views/Ajuan/FormAjuan.vue')
const DetailAjuan = () => import('@/views/Ajuan/DetailAjuan.vue')

// Views - Admin
const UserManagement = () => import('@/views/Admin/UserManagement.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 1. Landing Page (Guest)
    {
      path: '/',
      name: 'landing',
      component: LandingPage,
      meta: { title: 'Selamat Datang di SI-BIKO' }
    },
    // 2. Auth
    {
      path: '/auth/signin',
      name: 'signin',
      component: Signin,
      meta: { title: 'Login - SI-BIKO' }
    },
    {
      path: '/auth/signup',
      name: 'signup',
      component: Signup,
      meta: { title: 'Daftar - SI-BIKO' }
    },
    // 3. Area Dashboard (Perlu Login)
    {
      path: '/app',
      component: AdminLayout, // Layout bawaan TailAdmin (Sidebar + Header)
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: Dashboard,
          meta: { title: 'Dashboard Utama' }
        },
        {
          path: 'profil',
          name: 'profil',
          component: UserProfile,
          meta: { title: 'Profil Saya' }
        },
        // Modul Ajuan (Inti Sistem)
        {
          path: 'ajuan',
          name: 'ajuan-list',
          component: ListAjuan,
          meta: { title: 'Daftar Ajuan Konseling' }
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
          meta: { title: 'Detail Ajuan' }
        },
        // Modul Admin
        {
          path: 'admin/users',
          name: 'admin-users',
          component: UserManagement,
          meta: { title: 'Manajemen Pengguna' }
        }
      ]
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  }
})

// Ganti Title Browser Otomatis
router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | SI-BIKO`
  next()
})

export default router
