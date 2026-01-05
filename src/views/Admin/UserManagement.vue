<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Breadcrumb from '@/components/common/PageBreadcrumb.vue'
import axios from 'axios'
import { ChevronDownIcon } from '@/icons'

// Interface User
interface User {
  id: number
  real_id: string
  name: string
  username: string
  email: string
  role: 'mahasiswa' | 'dosen' | 'wd3' | 'admin' | 'konselor'
  prodi?: string
  jabatan?: string
}

const users = ref<User[]>([])
const isLoading = ref(true)

const searchQuery = ref('')
const selectedRole = ref('all')
const dosenOptions = ref<any[]>([])

const showModal = ref(false)
const isEditing = ref(false)
const isSubmitting = ref(false)

// Tambahkan field password di form
const form = ref({
  id: 0,
  name: '',
  username: '', // Berfungsi sebagai NIM atau NIP
  password: '', // Password baru
  email: '',
  no_hp: '',
  role: 'mahasiswa',
  prodi: '',
  jabatan: '',
  id_dosen_pa: ''
})

// --- FETCH DATA ---
const fetchUsers = async () => {
  isLoading.value = true
  try {
    const token = localStorage.getItem('token')
    const config = { headers: { Authorization: `Bearer ${token}` } }

    const [resMhs, resStaff] = await Promise.all([
        axios.get('http://localhost:8000/api/admin/mahasiswa', config),
        axios.get('http://localhost:8000/api/admin/staff', config)
    ])

    dosenOptions.value = resStaff.data
      .filter((s: any) => s.jabatan === 'Dosen PA')
      .map((s: any) => ({
        id: s.id_staff,
        nama: s.nama_lengkap
      }));

    const mappedMhs = resMhs.data.map((m: any) => ({
        id: m.id_user,
        real_id: m.nim,
        name: m.nama_lengkap,
        username: m.user ? m.user.username : m.nim,
        email: m.email || '-',
        role: 'mahasiswa',
        prodi: m.prodi,
        id_dosen_pa: m.id_dosen_pa
    }))

    const mappedStaff = resStaff.data.map((s: any) => ({
        id: s.id_user,
        real_id: s.nip || '-',
        name: s.nama_lengkap,
        username: s.user ? s.user.username : '-',
        email: '-',
        role: s.user ? s.user.role : 'dosen', // default dosen jika tidak terdeteksi
        jabatan: s.jabatan
    }))

    users.value = [...mappedMhs, ...mappedStaff]

  } catch (error) {
    console.error("Gagal mengambil data user:", error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchUsers()
})

const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchRole = selectedRole.value === 'all' || user.role === selectedRole.value
    const matchSearch = user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                        String(user.real_id).includes(searchQuery.value) ||
                        user.username.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchRole && matchSearch
  })
})

// --- OPEN ADD MODAL ---
const openAddModal = () => {
    isEditing.value = false
    // Reset Form
    form.value = {
        id: 0,
        name: '',
        username: '',
        password: '',
        email: '',
        role: 'mahasiswa',
        prodi: 'Informatika',
        id_dosen_pa: '',
        jabatan: 'Dosen PA'
    }
    showModal.value = true
}

// --- OPEN EDIT MODAL ---
const openEditModal = (user: User) => {
  isEditing.value = true
  form.value = {
      id: user.id,
      name: user.name,
      username: user.username,
      password: '', // Password kosong saat edit (opsional)
      email: user.email !== '-' ? user.email : '',
      role: user.role === 'mahasiswa' ? 'mahasiswa' : 'staff', // Simplifikasi role di form edit
      prodi: user.prodi || 'Informatika',
      id_dosen_pa: (user as any).id_dosen_pa || '',
      jabatan: user.jabatan || 'Dosen PA'
  }
  showModal.value = true
}

// --- HANDLE SUBMIT (ADD & EDIT) ---
const handleSubmit = async () => {
  if (!form.value.name || !form.value.username) return alert("Nama dan Username/NIM wajib diisi!")
  if (!isEditing.value && !form.value.password) return alert("Password wajib diisi untuk user baru!")

  isSubmitting.value = true
  try {
    const token = localStorage.getItem('token')
    const config = { headers: { Authorization: `Bearer ${token}` } }

    const payload: any = {
        nama_lengkap: form.value.name,
        username: form.value.username,
    }

    // Logic Create vs Update
    let url = ''
    let method = ''

    if (isEditing.value) {
        // UPDATE
        method = 'put'
        if (form.value.role === 'mahasiswa') {
            url = `http://localhost:8000/api/admin/mahasiswa/${form.value.id}`
            payload.prodi = form.value.prodi
            payload.email = form.value.email
        } else {
            url = `http://localhost:8000/api/admin/staff/${form.value.id}`
            payload.jabatan = form.value.jabatan
        }
    } else {
        // CREATE (Baru)
        method = 'post'
        payload.password = form.value.password // Sertakan password

        if (form.value.role === 'mahasiswa') {
            url = `http://localhost:8000/api/admin/mahasiswa`
            payload.prodi = form.value.prodi
            payload.email = form.value.email
            payload.id_dosen_pa = form.value.id_dosen_pa
        } else {
            url = `http://localhost:8000/api/admin/staff`
            payload.jabatan = form.value.jabatan
        }
    }

    // Eksekusi Request
    if (method === 'post') await axios.post(url, payload, config)
    else await axios.put(url, payload, config)

    alert(`User berhasil ${isEditing.value ? 'diperbarui' : 'ditambahkan'}!`)
    showModal.value = false
    fetchUsers()

  } catch (error: any) {
    console.error("Submit error:", error)
    alert("Gagal: " + (error.response?.data?.message || error.message))
  } finally {
    isSubmitting.value = false
  }
}

const handleDelete = async (user: User) => {
  if(!confirm(`Yakin ingin menghapus user "${user.name}"?`)) return
  try {
    const token = localStorage.getItem('token')
    const config = { headers: { Authorization: `Bearer ${token}` } }
    const endpoint = user.role === 'mahasiswa'
        ? `http://localhost:8000/api/admin/mahasiswa/${user.id}`
        : `http://localhost:8000/api/admin/staff/${user.id}`

    await axios.delete(endpoint, config)
    alert("User berhasil dihapus!")
    fetchUsers()
  } catch (error) { alert("Gagal menghapus user.") }
}

const getRoleBadgeColor = (role: string) => {
  switch(role) {
    case 'mahasiswa': return 'bg-blue-100 text-blue-700 border-blue-200'
    case 'dosen': return 'bg-green-100 text-green-700 border-green-200'
    case 'wd3': return 'bg-purple-100 text-purple-700 border-purple-200'
    case 'admin': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    default: return 'bg-gray-100 text-gray-700 border-gray-200'
  }
}

const prodiOptions = ref(['Informatika', 'Matematika', 'Fisika', 'Kimia', 'Biologi', 'Farmasi'])
</script>

<template>
  <div class="mx-auto max-w-7xl">
    <Breadcrumb pageTitle="Manajemen Pengguna" />

    <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
       <div class="flex flex-col gap-3 sm:flex-row w-full sm:w-auto">
         <div class="relative">
           <input v-model="searchQuery" type="text" placeholder="Cari Nama / NIM..." class="w-full sm:w-64 rounded border border-stroke bg-white py-2.5 px-4 text-black focus:border-blue-600 outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white" />
         </div>
         <div class="relative">
           <select v-model="selectedRole" class="w-full sm:w-48 appearance-none rounded border border-stroke bg-white py-2.5 px-4 outline-none focus:border-blue-600 dark:border-strokedark dark:bg-meta-4 dark:text-white">
             <option value="all">Semua Role</option>
             <option value="mahasiswa">Mahasiswa</option>
             <option value="dosen">Dosen PA</option>
             <option value="wd3">WD3</option>
             <option value="admin">Admin</option>
           </select>
           <span class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"><ChevronDownIcon class="w-4 h-4"/></span>
         </div>
       </div>

       <button @click="openAddModal" class="flex items-center justify-center gap-2 rounded bg-blue-600 py-2.5 px-6 font-medium text-white hover:bg-blue-700 transition">
         <span>+</span> Tambah User
       </button>
    </div>

    <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div class="py-6 px-4 md:px-6 xl:px-7.5">
        <h4 class="text-xl font-bold text-black dark:text-white">Daftar Pengguna</h4>
      </div>

      <div class="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5 bg-gray-50 dark:bg-meta-4">
        <div class="col-span-3 sm:col-span-3"><p class="font-medium">Nama Lengkap</p></div>
        <div class="col-span-2 sm:col-span-2 hidden sm:block"><p class="font-medium">NIM/NIP</p></div>
        <div class="col-span-2 sm:col-span-2 text-center"><p class="font-medium">Role</p></div>
        <div class="col-span-1 sm:col-span-1 text-center"><p class="font-medium">Aksi</p></div>
      </div>

      <div v-if="isLoading" class="py-10 text-center text-gray-500">Memuat data pengguna...</div>

      <div v-else v-for="user in filteredUsers" :key="user.id" class="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5 items-center hover:bg-gray-50 dark:hover:bg-meta-4 transition">
        <div class="col-span-3 sm:col-span-3">
          <p class="text-sm font-bold text-black dark:text-white">{{ user.name }}</p>
          <p class="text-xs text-slate-500 sm:hidden">{{ user.real_id }}</p>
        </div>
        <div class="col-span-2 sm:col-span-2 hidden sm:block"><p class="text-sm text-black font-mono dark:text-white">{{ user.real_id }}</p></div>
        <div class="col-span-2 sm:col-span-2 flex justify-center">
          <span :class="getRoleBadgeColor(user.role)" class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium border uppercase">{{ user.role }}</span>
        </div>
        <div class="col-span-1 sm:col-span-1 flex flex-col sm:flex-row items-center justify-center gap-2">
          <button @click="openEditModal(user)" class="border border-blue-light-500 text-blue-600 px-2 py-1 rounded text-xs hover:bg-blue-600 hover:text-white transition">Edit</button>
          <button @click="handleDelete(user)" class="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700 transition">Hapus</button>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
        <div class="w-full max-w-lg rounded-lg bg-white p-8 shadow-2xl dark:bg-boxdark max-h-[90vh] overflow-y-auto">
          <h3 class="mb-6 text-xl font-bold text-black dark:text-white">{{ isEditing ? 'Edit User' : 'Tambah User Baru' }}</h3>

          <form @submit.prevent="handleSubmit">

            <div v-if="!isEditing" class="mb-4">
                <label class="mb-2 block text-sm font-medium text-black dark:text-white">Tipe User</label>
                <div class="flex gap-4">
                    <label class="flex items-center cursor-pointer">
                        <input type="radio" v-model="form.role" value="mahasiswa" class="mr-2"> Mahasiswa
                    </label>
                    <label class="flex items-center cursor-pointer">
                        <input type="radio" v-model="form.role" value="staff" class="mr-2"> Staff / Dosen
                    </label>
                </div>
            </div>

            <div class="mb-4">
                <label class="mb-2 block text-sm font-medium text-black dark:text-white">Nama Lengkap</label>
                <input v-model="form.name" class="w-full rounded border border-stroke p-3 outline-none focus:border-blue-600 dark:bg-form-input dark:border-form-strokedark" placeholder="Nama Lengkap" />
            </div>

            <div class="mb-4">
                <label class="mb-2 block text-sm font-medium text-black dark:text-white">Username (NIM / NIP)</label>
                <input v-model="form.username" class="w-full rounded border border-stroke p-3 outline-none focus:border-blue-600 dark:bg-form-input dark:border-form-strokedark" placeholder="NIM atau NIP" />
            </div>

            <div v-if="!isEditing" class="mb-4">
                <label class="mb-2 block text-sm font-medium text-black dark:text-white">Password</label>
                <input v-model="form.password" type="password" class="w-full rounded border border-stroke p-3 outline-none focus:border-blue-600 dark:bg-form-input dark:border-form-strokedark" placeholder="Minimal 6 karakter" />
            </div>

            <template v-if="form.role === 'mahasiswa'">
                <div class="mb-4">
                    <label class="mb-2 block text-sm font-medium text-black dark:text-white">Email</label>
                    <input v-model="form.email" type="email" class="w-full rounded border border-stroke p-3 outline-none focus:border-blue-600 dark:bg-form-input dark:border-form-strokedark" placeholder="email@contoh.com" />
                </div>
                <div class="mb-4">
                  <label class="mb-2 block text-sm font-medium text-black dark:text-white">Dosen Pembimbing Akademik</label>
                  <div class="relative z-20 bg-transparent dark:bg-form-input">
                    <select v-model="form.id_dosen_pa" class="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent p-3 outline-none focus:border-blue-600 dark:border-form-strokedark dark:bg-form-input text-black dark:text-white">
                      <option value="" disabled>Pilih Dosen PA</option>
                      <option v-for="dosen in dosenOptions" :key="dosen.id" :value="dosen.id">
                        {{ dosen.nama }}
                      </option>
                    </select>
                    <span class="absolute top-1/2 right-4 z-30 -translate-y-1/2"><ChevronDownIcon class="w-4 h-4"/></span>
                  </div>
                </div>
                <div class="mb-4">
                    <label class="mb-2 block text-sm font-medium text-black dark:text-white">Program Studi</label>
                    <div class="relative z-20 bg-transparent dark:bg-form-input">
                        <select v-model="form.prodi" class="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent p-3 outline-none focus:border-blue-600 dark:border-form-strokedark dark:bg-form-input text-black dark:text-white">
                            <option v-for="p in prodiOptions" :key="p" :value="p">{{ p }}</option>
                        </select>
                        <span class="absolute top-1/2 right-4 z-30 -translate-y-1/2"><ChevronDownIcon class="w-4 h-4"/></span>
                    </div>
                </div>
            </template>

            <template v-else>
                <div class="mb-4">
                    <label class="mb-2 block text-sm font-medium text-black dark:text-white">Jabatan / Role</label>
                    <div class="relative z-20 bg-transparent dark:bg-form-input">
                        <select v-model="form.jabatan" class="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent p-3 outline-none focus:border-blue-600 dark:border-form-strokedark dark:bg-form-input text-black dark:text-white">
                            <option value="Dosen PA">Dosen PA</option>
                            <option value="Konselor">Konselor</option>
                            <option value="Wakil Dekan 3">Wakil Dekan 3</option>
                            <option value="Admin">Admin</option>
                        </select>
                        <span class="absolute top-1/2 right-4 z-30 -translate-y-1/2"><ChevronDownIcon class="w-4 h-4"/></span>
                    </div>
                </div>
            </template>

            <div class="flex gap-4 justify-end mt-6">
              <button type="button" @click="showModal = false" class="text-black hover:text-slate-700 px-4 dark:text-white">Batal</button>
              <button type="submit" :disabled="isSubmitting" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:opacity-70">
                  {{ isSubmitting ? 'Menyimpan...' : 'Simpan' }}
              </button>
            </div>

          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>
