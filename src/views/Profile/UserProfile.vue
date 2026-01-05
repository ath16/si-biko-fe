<script setup lang="ts">
import { ref, onMounted, computed, watchEffect } from 'vue'
import Breadcrumb from '@/components/common/PageBreadcrumb.vue'
import { useAuth } from '@/composables/useAuth'
import axios from 'axios'

const { user, setUser } = useAuth()
const isSubmitting = ref(false)
const isLoading = ref(true)

// Helper: Cek apakah user adalah Mahasiswa
const isMahasiswa = computed(() => user.value.role === 'mahasiswa')

// 1. Logika Bio Dinamis (Point 4)
const defaultBio = computed(() => {
  switch (user.value.role) {
    case 'mahasiswa': return 'Mahasiswa aktif Fakultas MIPA Universitas Udayana.'
    case 'dosen': return 'Dosen Pengajar dan Pembimbing Akademik Fakultas MIPA.'
    case 'konselor': return 'Konselor profesional siap membantu masalah kemahasiswaan.'
    case 'wd3': return 'Wakil Dekan III Bidang Kemahasiswaan dan Informasi.'
    case 'admin': return 'Administrator Sistem Informasi Bimbingan Konseling.'
    default: return 'Civitas Akademika Universitas Udayana.'
  }
})

// 2. State Form
const formData = ref({
  nama_lengkap: '',
  no_hp: '',
  email: '',
  prodi: '',
  bio: ''
})

const dosenPa = ref({
  nama: 'Belum Ditentukan',
  nip: '-',
  foto: ''
})

// 3. Computed Image (Point 1 - Agar Admin juga muncul fotonya)
// Menggunakan UI Avatars sebagai sumber utama, bukan hanya fallback error
const generatedAvatar = computed(() => {
  const name = formData.value.nama_lengkap || user.value.name || 'User'
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=256`
})

// 4. Fetch Data Profil
const fetchProfile = async () => {
  isLoading.value = true

  // A. JIKA MAHASISWA: Ambil data dari Database via API
  if (isMahasiswa.value) {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const config = { headers: { Authorization: `Bearer ${token}` } }
      const response = await axios.get('http://localhost:8000/api/mahasiswa/profile', config)
      const data = response.data

      formData.value.nama_lengkap = data.nama_lengkap || user.value.name
      formData.value.no_hp = data.no_hp || ''
      formData.value.email = data.email || user.value.email
      formData.value.prodi = data.prodi || ''
      formData.value.bio = defaultBio.value

      // Mapping Dosen PA
      if (data.staff) {
          dosenPa.value = {
              nama: data.staff.nama_lengkap || 'Nama Tidak Tersedia',
              nip: data.staff.nip || '-',
              foto: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.staff.nama_lengkap)}&background=random`
          }
      }
    } catch (error) {
      console.error("Gagal mengambil data profil:", error)
    }
  }
  // B. JIKA STAFF/ADMIN: Ambil dari State Auth (Read Only)
  else {
    formData.value.nama_lengkap = user.value.name
    formData.value.email = user.value.email
    formData.value.bio = defaultBio.value
    // Staff biasanya tidak punya 'prodi' spesifik di tabel users/staff, kecuali relasi khusus
    // Kita kosongkan atau isi jabatan jika ada di detail
    formData.value.prodi = user.value.detail?.jabatan || ''
    formData.value.no_hp = user.value.detail?.no_hp || '-'
  }

  isLoading.value = false
}

onMounted(() => {
  fetchProfile()
})

const handleSave = async () => {
  if (!isMahasiswa.value) return // Guard: Staff tidak boleh save

  if (!formData.value.nama_lengkap || !formData.value.no_hp || !formData.value.prodi) {
    alert("Nama Lengkap, No HP, dan Prodi wajib diisi.")
    return
  }

  isSubmitting.value = true

  try {
    const token = localStorage.getItem('token')
    const config = { headers: { Authorization: `Bearer ${token}` } }

    const payload = {
      nama_lengkap: formData.value.nama_lengkap,
      no_hp: formData.value.no_hp,
      prodi: formData.value.prodi,
      email: formData.value.email
    }

    await axios.post('http://localhost:8000/api/mahasiswa/update-profile', payload, config)

    alert("Profil berhasil diperbarui!")

    const updatedUser = { ...user.value, name: payload.nama_lengkap }
    setUser(updatedUser)

  } catch (error: any) {
    if (error.response) {
       alert("Gagal: " + (error.response.data.message || "Terjadi kesalahan server."))
    } else {
       alert("Gagal terhubung ke server.")
    }
  } finally {
    isSubmitting.value = false
  }
}

const displayRole = computed(() => (user.value.role || 'User').toUpperCase())
const idLabel = computed(() => user.value.role === 'mahasiswa' ? 'NIM' : 'NIP')
</script>

<template>
  <div class="mx-auto max-w-242.5">
    <Breadcrumb pageTitle="Profil Saya" />

    <div v-if="isLoading" class="p-10 text-center text-slate-500">
        Memuat data profil...
    </div>

    <div v-else>
        <div class="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mb-6">
        <div class="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
            <div class="relative mx-auto mt-4 h-30 w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:w-44 sm:p-3">
            <div class="relative drop-shadow-2 h-full w-full">
                <img :src="generatedAvatar" alt="profile" class="h-full w-full rounded-full object-cover bg-white" />
            </div>
            </div>
            <div class="mt-4">
            <h3 class="mb-1.5 text-2xl font-semibold text-black dark:text-white">{{ formData.nama_lengkap || user.name }}</h3>

            <p class="font-medium text-slate-500">
                {{ displayRole }}
                <span v-if="formData.prodi"> - {{ formData.prodi }}</span>
            </p>

            <div class="mt-4 flex flex-wrap justify-center gap-4">
                <div class="flex items-center gap-2 px-4 py-1 rounded bg-green-600/10 text-green-600 border border-green-100/20 text-sm font-medium">
                    <span class="w-2 h-2 rounded-full bg-green-600"></span> Status: Aktif
                </div>
                <div class="flex items-center gap-2 px-4 py-1 rounded bg-blue-600/10 text-blue-600 border border-blue-light-500/20 text-sm font-medium">
                    {{ idLabel }}: {{ user.username }}
                </div>
            </div>
            </div>
        </div>
        </div>

        <div class="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <div class="flex flex-col gap-9">
            <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div class="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <h3 class="font-medium text-black dark:text-white">Informasi Pribadi</h3>
            </div>

            <form @submit.prevent="handleSave">
                <div class="p-6.5">
                <div class="mb-4.5">
                    <label class="mb-2.5 block text-black dark:text-white">Nama Lengkap</label>
                    <input
                        v-model="formData.nama_lengkap"
                        type="text"
                        :disabled="!isMahasiswa"
                        class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-blue-600 dark:border-form-strokedark dark:bg-form-input disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-meta-4"
                    />
                </div>

                <div v-if="isMahasiswa" class="mb-4.5">
                    <label class="mb-2.5 block text-black dark:text-white">Program Studi</label>
                    <input
                        v-model="formData.prodi"
                        type="text"
                        disabled
                        class="w-full cursor-not-allowed rounded border-[1.5px] border-stroke bg-gray-200 py-3 px-5 font-medium outline-none transition dark:bg-meta-4 dark:border-form-strokedark"
                    />
                </div>

                <div class="mb-4.5">
                    <label class="mb-2.5 block text-black dark:text-white">Nomor Telepon / WhatsApp</label>
                    <input
                        v-model="formData.no_hp"
                        type="text"
                        :disabled="!isMahasiswa"
                        class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-blue-600 dark:border-form-strokedark dark:bg-form-input disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-meta-4"
                    />
                </div>

                <div class="mb-4.5">
                    <label class="mb-2.5 block text-black dark:text-white">Email</label>
                    <input v-model="formData.email" type="email" disabled class="w-full cursor-not-allowed rounded border-[1.5px] border-stroke bg-gray-200 py-3 px-5 font-medium outline-none transition dark:bg-meta-4 dark:border-form-strokedark" />
                </div>

                <button
                    v-if="isMahasiswa"
                    type="submit"
                    :disabled="isSubmitting"
                    class="flex w-full justify-center rounded bg-blue-600 p-3 font-medium text-gray-100 hover:bg-blue-600/90 transition disabled:opacity-70"
                >
                    {{ isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan' }}
                </button>
                <div v-else class="text-sm text-slate-500 italic text-center">
                    *Data Staff/Admin dikelola oleh Administrator sistem.
                </div>
                </div>
            </form>
            </div>
        </div>

        <div class="flex flex-col gap-9">
            <div v-if="isMahasiswa" class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div class="border-b border-stroke py-4 px-6.5 dark:border-strokedark flex items-center gap-2">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                <h3 class="font-medium text-black dark:text-white">Dosen Pembimbing Akademik</h3>
            </div>
            <div class="p-6.5 flex flex-col gap-6">
                <div class="flex items-start gap-4">
                <div class="h-12 w-12 flex-shrink-0 rounded-full bg-slate-200 overflow-hidden">
                    <img :src="dosenPa.foto" alt="Foto" class="h-full w-full object-cover" />
                </div>
                <div class="w-full">
                    <h4 class="text-sm font-bold text-black dark:text-white">{{ dosenPa.nama }}</h4>
                    <p class="text-xs text-slate-500 mb-1">NIP: {{ dosenPa.nip }}</p>
                    <div class="flex items-center justify-between mt-2">
                        <span class="text-xs bg-slate-100 px-2 py-1 rounded dark:bg-meta-4 text-slate-600">PA</span>
                    </div>
                </div>
                </div>
            </div>
            </div>

            <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div class="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <h3 class="font-medium text-black dark:text-white">Tentang Saya</h3>
            </div>
            <div class="p-6.5">
                <textarea v-model="formData.bio" rows="4" disabled class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition dark:border-form-strokedark dark:bg-form-input cursor-not-allowed text-slate-500"></textarea>
            </div>
            </div>
        </div>
        </div>
    </div>
  </div>
</template>
