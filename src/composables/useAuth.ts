import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

interface User {
  id: number | string
  name: string
  username: string
  email: string
  role: 'mahasiswa' | 'dosen' | 'konselor' | 'wd3' | 'admin' | 'guest'
  photo: string
  detail?: any
}

const storedUser = localStorage.getItem('user')
const initialUser: User = storedUser ? JSON.parse(storedUser) : {
  id: '',
  name: '',
  username: '',
  email: '',
  role: 'guest',
  photo: ''
}

const user = ref<User>(initialUser)

export function useAuth() {
  const router = useRouter()

  const isMahasiswa = computed(() => user.value.role === 'mahasiswa')
  const isDosen = computed(() => ['dosen', 'konselor'].includes(user.value.role))
  const isWD3 = computed(() => user.value.role === 'wd3')
  const isAdmin = computed(() => user.value.role === 'admin')
  const isAuthenticated = computed(() => user.value.role !== 'guest')

  const setUser = (backendUser: any) => {
    let realName = backendUser.username
    let realEmail = backendUser.email

    if (backendUser.role === 'mahasiswa' && backendUser.mahasiswa) {
      realName = backendUser.mahasiswa.nama_lengkap
      realEmail = backendUser.mahasiswa.email
    }
    else if (backendUser.role !== 'mahasiswa' && backendUser.staff) {
      realName = backendUser.staff.nama_lengkap
      realEmail = backendUser.staff.email
    }

    const defaultPhoto = `https://ui-avatars.com/api/?name=${encodeURIComponent(realName)}&background=random&color=fff`

    const newUserState: User = {
      id: backendUser.id,
      name: realName,
      username: backendUser.username,
      email: realEmail || 'user@unud.ac.id',
      role: backendUser.role,
      photo: defaultPhoto,
      detail: backendUser.role === 'mahasiswa' ? backendUser.mahasiswa : backendUser.staff
    }

    user.value = newUserState
    localStorage.setItem('user', JSON.stringify(newUserState))
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    user.value = { id: '', name: '', username: '', email: '', role: 'guest', photo: '' }
    router.push('/auth/signin')
  }

  return { user, isMahasiswa, isDosen, isWD3, isAdmin, isAuthenticated, setUser, logout }
}
