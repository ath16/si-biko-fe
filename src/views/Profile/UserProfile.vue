<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import Breadcrumb from '@/components/common/PageBreadcrumb.vue'
import { useAuth } from '@/composables/useAuth'
import axios from 'axios'

const { user, setUser } = useAuth()
const isSubmitting = ref(false)
const isLoading = ref(true)
const showPassModal = ref(false)
const passForm = ref({ current: '', new: '', confirm: '' })

const isMahasiswa = computed(() => user.value.role === 'mahasiswa')

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
  no_hp: '-',
  email: '-',
  foto: ''
})

const generatedAvatar = computed(() => {
  const name = formData.value.nama_lengkap || user.value.name || 'User'
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=256`
})

const fetchProfile = async () => {
  isLoading.value = true
  const token = localStorage.getItem('token')
  const config = { headers: { Authorization: `Bearer ${token}` } }

  try {
    if (isMahasiswa.value) {
      const response = await axios.get('http://localhost:8000/api/mahasiswa/profile', config)
      const data = response.data

      formData.value.nama_lengkap = data.nama_lengkap || user.value.name
      formData.value.no_hp = data.no_hp || ''
      formData.value.email = data.email || user.value.email
      formData.value.prodi = data.prodi || ''
      formData.value.bio = defaultBio.value

      if (data.staff) {
          dosenPa.value = {
              nama: data.staff.nama_lengkap || 'Nama Tidak Tersedia',
              nip: data.staff.nip || '-',
              no_hp: data.staff.no_hp || '-',
              email: data.staff.email || '-',
              foto: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.staff.nama_lengkap)}&background=random`
          }
      }
    }
    else {
      let endpoint = 'http://localhost:8000/api/staff/profile'
      if (user.value.role === 'wd3') endpoint = 'http://localhost:8000/api/wd3/profile'
      if (user.value.role === 'admin') endpoint = 'http://localhost:8000/api/admin/profile'

      const response = await axios.get(endpoint, config)
      const data = response.data

      formData.value.nama_lengkap = data.nama_lengkap || user.value.name
      formData.value.email = data.email || user.value.email || '-'
      formData.value.no_hp = data.no_hp || '-'
      formData.value.prodi = data.jabatan || user.value.role.toUpperCase()
      formData.value.bio = defaultBio.value
    }
  } catch (error) {
    console.error("Gagal ambil profil:", error)
    formData.value.nama_lengkap = user.value.name
    formData.value.email = user.value.email
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchProfile()
})

const handleSave = async () => {
  if (!isMahasiswa.value) return

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
    alert("Gagal update profile.")
  } finally {
    isSubmitting.value = false
  }
}

const handleChangePassword = async () => {
  if (passForm.value.new !== passForm.value.confirm) return alert("Password baru tidak cocok!")
  try {
    const token = localStorage.getItem('token')
    await axios.post('http://localhost:8000/api/change-password', {
       current_password: passForm.value.current,
       new_password: passForm.value.new,
       new_password_confirmation: passForm.value.confirm
    }, { headers: { Authorization: `Bearer ${token}` } })
    alert("Password berhasil diubah!")
    showPassModal.value = false
    passForm.value = { current: '', new: '', confirm: '' }
  } catch (err: any) {
    alert("Gagal: " + (err.response?.data?.message || "Cek password lama Anda."))
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
            <h3 class="mb-1.5 text-2xl font-semibold text-black dark:text-white">{{ formData.nama_lengkap }}</h3>
            <p class="font-medium text-slate-500">{{ displayRole }}</p>
            </div>
        </div>
        </div>

        <div class="grid grid-cols-1 gap-9 sm:grid-cols-2">

        <div class="flex flex-col gap-9">
            <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div class="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <h3 class="font-medium text-black dark:text-white">Informasi Kontak</h3>
            </div>
            <form @submit.prevent="handleSave">
                <div class="p-6.5">

                <div class="mb-4.5">
                    <label class="mb-2.5 block text-black dark:text-white">Nama Lengkap</label>
                    <input v-model="formData.nama_lengkap" type="text" :disabled="!isMahasiswa"
                        class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-blue-600 disabled:bg-gray-100 dark:disabled:bg-meta-4" />
                </div>

                <div class="mb-4.5">
                    <label class="mb-2.5 block text-black dark:text-white">
                        {{ isMahasiswa ? 'Program Studi' : 'Jabatan' }}
                    </label>
                    <input v-model="formData.prodi" type="text" disabled
                        class="w-full cursor-not-allowed rounded border-[1.5px] border-stroke bg-gray-100 py-3 px-5 outline-none transition dark:bg-meta-4" />
                </div>

                <div class="mb-4.5">
                    <label class="mb-2.5 block text-black dark:text-white">Nomor HP / WhatsApp</label>
                    <input v-model="formData.no_hp" type="text" :disabled="!isMahasiswa"
                        class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-blue-600 disabled:bg-gray-100 dark:disabled:bg-meta-4" />
                </div>

                <div class="mb-4.5">
                    <label class="mb-2.5 block text-black dark:text-white">Email</label>
                    <input v-model="formData.email" type="email" disabled
                        class="w-full cursor-not-allowed rounded border-[1.5px] border-stroke bg-gray-100 py-3 px-5 outline-none transition dark:bg-meta-4" />
                </div>

                <button v-if="isMahasiswa" type="submit" :disabled="isSubmitting"
                    class="flex w-full justify-center rounded bg-blue-600 p-3 font-medium text-gray-100 hover:bg-blue-700 transition">
                    {{ isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan' }}
                </button>

                <div v-else class="text-sm text-slate-500 italic text-center bg-yellow-50 p-2 rounded border border-yellow-100 text-yellow-700">
                    *Data Staff hanya dapat diubah oleh Administrator.
                </div>

                </div>
            </form>
            </div>
        </div>

        <div class="flex flex-col gap-9">

            <div v-if="isMahasiswa" class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div class="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <h3 class="font-medium text-black dark:text-white">Dosen Pembimbing Akademik</h3>
              </div>
              <div class="p-6.5 flex flex-col gap-6">
                <div class="flex items-center gap-4">
                  <div class="h-14 w-14 rounded-full bg-slate-200 overflow-hidden">
                    <img :src="dosenPa.foto" alt="Foto" class="h-full w-full object-cover" />
                  </div>
                  <div>
                    <h4 class="text-sm font-bold text-black dark:text-white">{{ dosenPa.nama }}</h4>
                    <p class="text-xs text-slate-500">NIP.          : {{ dosenPa.nip }}</p>
                    <p class="text-xs text-slate-500">No. Handphone : {{ dosenPa.no_hp }}</p>
                    <p class="text-xs text-slate-500">Email         : {{ dosenPa.email }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div class="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
                <h3 class="font-medium text-black dark:text-white">Tentang Saya</h3>
              </div>
              <div class="p-6.5">
                <textarea v-model="formData.bio" rows="4" disabled class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition cursor-not-allowed text-slate-500"></textarea>

                <button type="button" @click="showPassModal = true" class="mt-4 w-full rounded border border-blue-600 p-3 font-medium text-blue-600 hover:bg-blue-50 transition">
                    Ubah Password
                </button>
              </div>
            </div>
          </div>
        </div>
    </div>

    <Teleport to="body">
      <div v-if="showPassModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
        <div class="w-full max-w-md rounded-lg bg-white p-8 dark:bg-boxdark shadow-lg">
          <h3 class="mb-4 text-xl font-bold text-black dark:text-white">Ubah Password</h3>
          <form @submit.prevent="handleChangePassword">
            <div class="mb-4">
              <label class="block mb-2 text-sm">Password Lama</label>
              <input v-model="passForm.current" type="password" class="w-full border rounded p-2 dark:bg-meta-4 dark:border-strokedark" required />
            </div>
            <div class="mb-4">
              <label class="block mb-2 text-sm">Password Baru</label>
              <input v-model="passForm.new" type="password" class="w-full border rounded p-2 dark:bg-meta-4 dark:border-strokedark" required />
            </div>
            <div class="mb-6">
              <label class="block mb-2 text-sm">Konfirmasi Password Baru</label>
              <input v-model="passForm.confirm" type="password" class="w-full border rounded p-2 dark:bg-meta-4 dark:border-strokedark" required />
            </div>
            <div class="flex justify-end gap-3">
              <button type="button" @click="showPassModal = false" class="text-slate-500 hover:text-black px-4">Batal</button>
              <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Simpan</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>
