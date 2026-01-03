<script setup lang="ts">
import { ref, computed } from 'vue'
import Breadcrumb from '@/components/common/PageBreadcrumb.vue'
import { ChevronDownIcon } from '@/icons'

// --- 1. SETUP DATA ---
interface User {
  id: number
  name: string
  username: string
  email: string
  role: 'mahasiswa' | 'dosen' | 'wd3' | 'admin' | 'konselor'
  status: 'active' | 'inactive'
}

const users = ref<User[]>([
  { id: 1, name: 'Atha Fajri', username: '240001', email: 'atha@mhs.unud.ac.id', role: 'mahasiswa', status: 'active' },
  { id: 2, name: 'Dr. Budi Santoso', username: '19800101', email: 'budi@unud.ac.id', role: 'dosen', status: 'active' },
  { id: 3, name: 'Prof. Made WD3', username: '19750101', email: 'wd3@unud.ac.id', role: 'wd3', status: 'active' },
  { id: 4, name: 'Ibu Ratna, M.Psi', username: 'K001', email: 'ratna@unud.ac.id', role: 'konselor', status: 'active' },
  { id: 5, name: 'Admin Fakultas', username: 'admin01', email: 'admin@fmipa.unud.ac.id', role: 'admin', status: 'active' },
])

// --- 2. LOGIKA APPROVAL (BARU) ---
const showApprovalModal = ref(false)
const pendingRequests = ref([
  {
    id: 101,
    userId: 1,
    nama: 'Atha Fajri',
    role: 'Mahasiswa',
    waktu: '10 Menit yang lalu',
    dataLama: { name: 'Atha Fajri', phone: '081234567890' },
    dataBaru: { name: 'Atha Fajri Putra', phone: '089999888777' }
  }
])

const openApproval = () => {
  if (pendingRequests.value.length === 0) return alert("Tidak ada permintaan perubahan data.")
  showApprovalModal.value = true
}

const handleApprove = (req: any) => {
  if(confirm("Setujui perubahan ini? Data user akan diperbarui.")) {
    // 1. Update data user asli
    const userIndex = users.value.findIndex(u => u.id === req.userId)
    if(userIndex !== -1) {
      users.value[userIndex].name = req.dataBaru.name
      // Update phone (simulasi krn di table ga ada kolom phone)
    }
    // 2. Hapus request
    pendingRequests.value = pendingRequests.value.filter(r => r.id !== req.id)
    alert("Berhasil disetujui.")
    if(pendingRequests.value.length === 0) showApprovalModal.value = false
  }
}

const handleReject = (id: number) => {
  if(confirm("Tolak permintaan ini?")) {
    pendingRequests.value = pendingRequests.value.filter(r => r.id !== id)
    alert("Permintaan ditolak.")
    if(pendingRequests.value.length === 0) showApprovalModal.value = false
  }
}

// --- 3. CRUD LOGIC LAMA ---
const searchQuery = ref('')
const selectedRole = ref('all')
const showModal = ref(false)
const isEditing = ref(false)
const form = ref({ id: 0, name: '', username: '', email: '', role: 'mahasiswa', password: '' })

const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchRole = selectedRole.value === 'all' || user.role === selectedRole.value
    const matchSearch = user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                        user.username.includes(searchQuery.value)
    return matchRole && matchSearch
  })
})

const openAddModal = () => {
  isEditing.value = false
  form.value = { id: 0, name: '', username: '', email: '', role: 'mahasiswa', password: '' }
  showModal.value = true
}

const openEditModal = (user: User) => {
  isEditing.value = true
  form.value = { ...user, password: '' }
  showModal.value = true
}

const handleDelete = (id: number) => {
  if(confirm('Hapus user ini?')) users.value = users.value.filter(u => u.id !== id)
}

const handleSubmit = () => {
  if (!form.value.name) return alert("Wajib isi data!")
  if (isEditing.value) {
    const index = users.value.findIndex(u => u.id === form.value.id)
    if (index !== -1) users.value[index] = { ...users.value[index], ...form.value }
  } else {
    users.value.push({ ...form.value, id: Date.now(), status: 'active' } as any)
  }
  showModal.value = false
}

const getRoleBadgeColor = (role: string) => {
  switch(role) {
    case 'mahasiswa': return 'bg-blue-100 text-blue-700 border-blue-200'
    case 'dosen': return 'bg-green-100 text-green-700 border-green-200'
    case 'wd3': return 'bg-purple-100 text-purple-700 border-purple-200'
    default: return 'bg-gray-100 text-gray-700 border-gray-200'
  }
}
</script>

<template>
  <div class="mx-auto max-w-7xl">
    <Breadcrumb pageTitle="Manajemen Pengguna" />

    <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
       <div class="flex flex-col gap-3 sm:flex-row w-full sm:w-auto">
         <div class="relative">
           <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
           </span>
           <input v-model="searchQuery" type="text" placeholder="Cari Nama / NIM..." class="w-full sm:w-64 rounded border border-stroke bg-white py-2.5 pl-10 pr-4 text-black focus:border-blue-light-500 outline-none dark:border-strokedark dark:bg-meta-4" />
         </div>
         <div class="relative">
           <select v-model="selectedRole" class="w-full sm:w-48 appearance-none rounded border border-stroke bg-white py-2.5 px-4 pr-10 text-black focus:border-blue-light-500 outline-none dark:border-strokedark dark:bg-meta-4">
             <option value="all">Semua Role</option>
             <option value="mahasiswa">Mahasiswa</option>
             <option value="dosen">Dosen PA</option>
             <option value="wd3">WD3</option>
             <option value="admin">Admin</option>
           </select>
           <span class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"><ChevronDownIcon class="w-5 h-5" /></span>
         </div>
       </div>

       <div class="flex gap-3">
         <button
           @click="openApproval"
           class="relative flex items-center justify-center gap-2 rounded border border-stroke bg-white py-2.5 px-4 font-medium text-black hover:bg-gray-50 dark:border-strokedark dark:bg-meta-4 dark:text-white"
         >
           Permintaan
           <span v-if="pendingRequests.length > 0" class="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
             {{ pendingRequests.length }}
           </span>
         </button>

         <button @click="openAddModal" class="flex items-center justify-center gap-2 rounded bg-blue-600 py-2.5 px-6 font-medium text-white hover:bg-blue-600/90">
           <span>+</span> Tambah User
         </button>
       </div>
    </div>

    <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div class="py-6 px-4 md:px-6 xl:px-7.5">
        <h4 class="text-xl font-bold text-black dark:text-white">Daftar Pengguna</h4>
      </div>
      <div class="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5 bg-gray-50 dark:bg-meta-4">
        <div class="col-span-2 sm:col-span-2"><p class="font-medium">Nama Lengkap</p></div>
        <div class="col-span-2 sm:col-span-1 hidden sm:block"><p class="font-medium">ID</p></div>
        <div class="col-span-2 sm:col-span-2 text-center"><p class="font-medium">Role</p></div>
        <div class="col-span-2 sm:col-span-2 hidden sm:block"><p class="font-medium">Email</p></div>
        <div class="col-span-2 sm:col-span-1 text-center"><p class="font-medium">Aksi</p></div>
      </div>
      <div v-for="user in filteredUsers" :key="user.id" class="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5 items-center hover:bg-gray-50 transition">
        <div class="col-span-2 sm:col-span-2">
          <p class="text-sm font-bold text-black dark:text-white">{{ user.name }}</p>
          <p class="text-xs text-slate-500 sm:hidden">{{ user.username }}</p>
        </div>
        <div class="col-span-2 sm:col-span-1 hidden sm:block"><p class="text-sm text-black font-mono">{{ user.username }}</p></div>
        <div class="col-span-2 sm:col-span-2 flex justify-center">
          <span :class="getRoleBadgeColor(user.role)" class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium border uppercase">{{ user.role }}</span>
        </div>
        <div class="col-span-2 sm:col-span-2 hidden sm:block"><p class="text-sm text-slate-600 truncate">{{ user.email }}</p></div>
        <div class="col-span-2 sm:col-span-1 flex flex-col sm:flex-row items-center justify-center gap-2">
          <button @click="openEditModal(user)" class="border border-blue-light-500 text-blue-600 px-2 py-1 rounded text-xs hover:bg-blue-600 hover:text-white transition">Edit</button>
          <button @click="handleDelete(user.id)" class="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-600/90 transition">Hapus</button>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
        <div class="w-full max-w-lg rounded-lg bg-white p-8 shadow-2xl dark:bg-boxdark">
          <h3 class="mb-6 text-xl font-bold text-black">{{ isEditing ? 'Edit User' : 'Tambah User' }}</h3>
          <form @submit.prevent="handleSubmit">
            <input v-model="form.name" class="w-full mb-4 rounded border p-3" placeholder="Nama" />
            <input v-model="form.username" class="w-full mb-4 rounded border p-3" placeholder="ID/NIM" />
            <input v-model="form.email" class="w-full mb-4 rounded border p-3" placeholder="Email" />
            <div class="flex gap-4 justify-end mt-4">
              <button type="button" @click="showModal = false" class="text-black">Batal</button>
              <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded">Simpan</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="showApprovalModal" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
        <div class="w-full max-w-2xl rounded-lg bg-white p-8 shadow-2xl dark:bg-boxdark transform transition-all scale-100 max-h-[90vh] overflow-y-auto">

          <div class="flex justify-between items-center mb-6 border-b border-stroke pb-4">
            <h3 class="text-xl font-bold text-black dark:text-white">Persetujuan Perubahan Data</h3>
            <button @click="showApprovalModal = false" class="text-slate-500 hover:text-black">✕</button>
          </div>

          <div class="flex flex-col gap-6">
            <div v-for="req in pendingRequests" :key="req.id" class="rounded border border-stroke p-4 bg-gray-50 dark:bg-meta-4">
              <div class="flex justify-between items-start mb-3">
                <div>
                  <h4 class="font-bold text-black">{{ req.nama }} <span class="text-xs font-normal text-slate-500">({{ req.role }})</span></h4>
                  <p class="text-xs text-slate-500">Diajukan: {{ req.waktu }}</p>
                </div>
                <span class="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded border border-yellow-200">Pending</span>
              </div>

              <div class="grid grid-cols-2 gap-4 text-sm mb-4">
                <div class="bg-red-50 p-3 rounded border border-red-100 text-red-700">
                  <p class="font-bold text-xs uppercase mb-2 text-red-500">Data Lama</p>
                  <p>Nama: {{ req.dataLama.name }}</p>
                  <p>Telp: {{ req.dataLama.phone }}</p>
                </div>
                <div class="bg-green-50 p-3 rounded border border-green-100 text-green-700">
                  <p class="font-bold text-xs uppercase mb-2 text-green-500">Data Baru</p>
                  <p>Nama: {{ req.dataBaru.name }}</p>
                  <p>Telp: {{ req.dataBaru.phone }}</p>
                </div>
              </div>

              <div class="flex gap-3 justify-end">
                <button @click="handleReject(req.id)" class="px-4 py-2 rounded border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium">Tolak</button>
                <button @click="handleApprove(req)" class="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 text-sm font-medium">Setujui Perubahan</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Teleport>

  </div>
</template>
