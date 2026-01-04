<script setup lang="ts">
import { ref, computed } from 'vue'
import Breadcrumb from '@/components/common/PageBreadcrumb.vue'
import { useAuth } from '@/composables/useAuth'

const { user } = useAuth()

const formData = ref({
  fullName: user.value.name || 'Nama Pengguna',
  phoneNumber: '081234567890',
  email: 'user@unud.ac.id',
  bio: 'Civitas Akademika Universitas Udayana yang aktif dan berprestasi.',
  username: user.value.username || 'user'
})

const kontakAkademik = ref([
  {
    nama: 'Dr. Budi Santoso, S.Kom., M.Cs.',
    peran: 'Dosen Pembimbing Akademik (PA)',
    nip: '19820101 200501 1 001',
    foto: '/images/user/user-02.jpg',
    wa: '081234567890'
  }
])

const profileImage = ref<string>('/images/user/user.jpg')
const isUploading = ref(false)

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    isUploading.value = true
    const reader = new FileReader()
    reader.onload = (e) => {
      profileImage.value = e.target?.result as string
      isUploading.value = false
      alert("Foto profil berhasil diperbarui!")
    }
    reader.readAsDataURL(target.files[0])
  }
}

const handleSave = () => {
  // Validasi
  if(!formData.value.fullName || !formData.value.phoneNumber) return alert("Data wajib diisi.")

  // Langsung simpan (sesuai backend: updateProfile)
  console.log("Menyimpan data:", formData.value)
  alert("Profil berhasil diperbarui!")
}

const idLabel = computed(() => {
    const role = user.value.role?.toLowerCase()
    if(role === 'mahasiswa') return 'NIM'
    if(role === 'dosen' || role === 'wd3') return 'NIP'
    return 'ID User'
})

const displayRole = computed(() => {
  const role = user.value.role || 'User'
  return role.charAt(0).toUpperCase() + role.slice(1)
})
</script>

<template>
  <div class="mx-auto max-w-242.5">
    <Breadcrumb pageTitle="Profil Saya" />

    <div class="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark mb-6">
      <div class="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
        <div class="relative mx-auto mt-4 h-30 w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:w-44 sm:p-3">
          <div class="relative drop-shadow-2 h-full w-full">
            <img :src="profileImage" alt="profile" class="h-full w-full rounded-full object-cover bg-white" />
            <label class="absolute bottom-0 right-0 flex h-8.5 w-8.5 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-600/90 sm:bottom-2 sm:right-2">
              <svg class="fill-current" width="14" height="14" viewBox="0 0 14 14" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.76464 1.42638C4.87283 1.2641 5.05496 1.16663 5.25 1.16663H8.75C8.94504 1.16663 9.12717 1.2641 9.23536 1.42638L10.2289 2.91663H12.25C12.7141 2.91663 13.1592 3.10093 13.4874 3.42909C13.8156 3.75725 14 4.2023 14 4.66663V11.0833C14 11.5476 13.8156 11.9927 13.4874 12.3208C13.1592 12.649 12.7141 12.8333 12.25 12.8333H1.75C1.28587 12.8333 0.840752 12.649 0.512563 12.3208C0.184375 11.9927 0 11.5476 0 11.0833V4.66663C0 4.2023 0.184374 3.75725 0.512563 3.42909C0.840752 3.10093 1.28587 2.91663 1.75 2.91663H3.77114L4.76464 1.42638ZM5.56219 2.33329L4.5687 3.82353C4.46051 3.98582 4.27839 4.08329 4.08333 4.08329H1.75C1.59529 4.08329 1.44692 4.14475 1.33752 4.25415C1.22812 4.36354 1.16667 4.51192 1.16667 4.66663V11.0833C1.16667 11.238 1.22812 11.3864 1.33752 11.4958C1.44692 11.6052 1.59529 11.6666 1.75 11.6666H12.25C12.4047 11.6666 12.5531 11.6052 12.6625 11.4958C12.7719 11.3864 12.8333 11.238 12.8333 11.0833V4.66663C12.8333 4.51192 12.7719 4.36354 12.6625 4.25415C12.5531 4.14475 12.4047 4.08329 12.25 4.08329H9.91667C9.72161 4.08329 9.53949 3.98582 9.4313 3.82353L8.43781 2.33329H5.56219Z" fill="white"></path></svg>
              <input type="file" name="profile" class="sr-only" @change="handleFileUpload" />
            </label>
          </div>
        </div>
        <div class="mt-4">
          <h3 class="mb-1.5 text-2xl font-semibold text-black dark:text-white">{{ user.name || 'User Tanpa Nama' }}</h3>
          <p class="font-medium text-slate-500">{{ displayRole }} - Fakultas MIPA</p>
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
                <input v-model="formData.fullName" type="text" class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-blue-light-500 dark:border-form-strokedark dark:bg-form-input" />
              </div>
              <div class="mb-4.5">
                <label class="mb-2.5 block text-black dark:text-white">Nomor Telepon / WhatsApp</label>
                <input v-model="formData.phoneNumber" type="text" class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-blue-light-500 dark:border-form-strokedark dark:bg-form-input" />
              </div>
              <div class="mb-4.5">
                <label class="mb-2.5 block text-black dark:text-white">Email Universitas</label>
                <input v-model="formData.email" type="email" disabled class="w-full cursor-not-allowed rounded border-[1.5px] border-stroke bg-gray-100 py-3 px-5 font-medium outline-none transition dark:bg-meta-4 dark:border-form-strokedark" />
                <p class="text-xs text-slate-400 mt-2">*Email tersinkronisasi dengan sistem akademik (IMISSU/SIMAK).</p>
              </div>
              <button class="flex w-full justify-center rounded bg-blue-600 p-3 font-medium text-gray-100 hover:bg-blue-600/90 transition">Simpan Perubahan</button>
            </div>
          </form>
        </div>
      </div>

      <div class="flex flex-col gap-9">
        <div v-if="user.role === 'mahasiswa'" class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div class="border-b border-stroke py-4 px-6.5 dark:border-strokedark flex items-center gap-2">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            <h3 class="font-medium text-black dark:text-white">Dosen Pembimbing & Konselor</h3>
          </div>
          <div class="p-6.5 flex flex-col gap-6">
            <div v-for="(kontak, idx) in kontakAkademik" :key="idx" class="flex items-start gap-4">
              <div class="h-12 w-12 flex-shrink-0 rounded-full bg-slate-200 overflow-hidden">
                <img :src="kontak.foto" alt="Foto" class="h-full w-full object-cover" @error="$event.target.src='https://ui-avatars.com/api/?name='+kontak.nama"/>
              </div>
              <div class="w-full">
                <h4 class="text-sm font-bold text-black dark:text-white">{{ kontak.nama }}</h4>
                <p class="text-xs text-slate-500 mb-1">{{ kontak.peran }}</p>
                <div class="flex items-center justify-between mt-2">
                   <span class="text-xs bg-slate-100 px-2 py-1 rounded dark:bg-meta-4 text-slate-600">{{ kontak.nip }}</span>
                   <a :href="'https://wa.me/'+kontak.wa" target="_blank" class="text-xs flex items-center gap-1 text-green-600 hover:underline">
                     <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                     Hubungi
                   </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
