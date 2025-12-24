import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

// 1. Definisi Tipe Data User
interface User {
  id: number | string
  name: string
  email: string
  role: 'mahasiswa' | 'dosen' | 'konselor' | 'wd3' | 'admin' | 'guest'
  photo: string
}

// 2. State Global (Disimpan di luar fungsi agar data menetap/persist)
// Default-nya adalah 'guest' (belum login)
const user = ref<User>({
  id: '',
  name: '',
  email: '',
  role: 'guest',
  photo: ''
})

export function useAuth() {
  const router = useRouter()

  // 3. Computed Properties (Helper untuk Cek Role di View/Sidebar)
  const isMahasiswa = computed(() => user.value.role === 'mahasiswa')
  // Dosen dan Konselor seringkali punya hak akses yang mirip dalam konteks penanganan ajuan
  const isDosen = computed(() => ['dosen', 'konselor'].includes(user.value.role))
  const isWD3 = computed(() => user.value.role === 'wd3')
  const isAdmin = computed(() => user.value.role === 'admin')
  const isAuthenticated = computed(() => user.value.role !== 'guest')

  // 4. Fungsi Login Simulasi
  // Nanti fungsi ini bisa diganti dengan call API ke Backend
  const login = (role: User['role']) => {
    user.value.role = role

    // Set Dummy Data sesuai Role agar terlihat real
    switch (role) {
      case 'mahasiswa':
        user.value.id = '240001'
        user.value.name = 'Atha Fajri'
        user.value.email = 'atha@student.unud.ac.id'
        user.value.photo = '/images/user/user-01.jpg'
        break

      case 'dosen':
        user.value.id = '198001'
        user.value.name = 'Dr. Budi Santoso'
        user.value.email = 'budi@dosen.unud.ac.id'
        user.value.photo = '/images/user/user-02.jpg'
        break

      case 'wd3':
        user.value.id = '197501'
        user.value.name = 'Prof. I Made WD3'
        user.value.email = 'wd3@unud.ac.id'
        user.value.photo = '/images/user/user-03.jpg'
        break

      case 'admin':
        user.value.id = '999'
        user.value.name = 'Admin Fakultas MIPA'
        user.value.email = 'admin@mipa.unud.ac.id'
        user.value.photo = '/images/user/owner.jpg'
        break
    }

    // Redirect otomatis ke Dashboard setelah login
    router.push('/app/dashboard')
  }

  // 5. Fungsi Logout
  const logout = () => {
    // Reset state ke Guest
    user.value = {
      id: '',
      name: '',
      email: '',
      role: 'guest',
      photo: ''
    }
    // Lempar ke halaman Login
    router.push('/auth/signin')
  }

  return {
    user,
    isMahasiswa,
    isDosen,
    isWD3,
    isAdmin,
    isAuthenticated,
    login,
    logout
  }
}
