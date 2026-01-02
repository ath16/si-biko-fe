<script setup lang="ts">
import { ref, computed } from 'vue'
import Breadcrumb from '@/components/common/PageBreadcrumb.vue'
import { useAuth } from '@/composables/useAuth'

const { user } = useAuth()

const formData = ref({
  fullName: user.value.name || 'Nama Pengguna',
  phoneNumber: '081234567890',
  email: 'user@unud.ac.id', // Email dummy/simulasi
  bio: 'Civitas Akademika Universitas Udayana yang aktif dan berprestasi.',
  username: user.value.username || 'user'
})

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
  console.log("Menyimpan data:", formData.value)
  alert("Perubahan profil berhasil disimpan!")
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

            <label
              class="absolute bottom-0 right-0 flex h-8.5 w-8.5 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white hover:bg-opacity-90 sm:bottom-2 sm:right-2"
            >
              <svg class="fill-current" width="14" height="14" viewBox="0 0 14 14" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.76464 1.42638C4.87283 1.2641 5.05496 1.16663 5.25 1.16663H8.75C8.94504 1.16663 9.12717 1.2641 9.23536 1.42638L10.2289 2.91663H12.25C12.7141 2.91663 13.1592 3.10093 13.4874 3.42909C13.8156 3.75725 14 4.2023 14 4.66663V11.0833C14 11.5476 13.8156 11.9927 13.4874 12.3208C13.1592 12.649 12.7141 12.8333 12.25 12.8333H1.75C1.28587 12.8333 0.840752 12.649 0.512563 12.3208C0.184375 11.9927 0 11.5476 0 11.0833V4.66663C0 4.2023 0.184374 3.75725 0.512563 3.42909C0.840752 3.10093 1.28587 2.91663 1.75 2.91663H3.77114L4.76464 1.42638ZM5.56219 2.33329L4.5687 3.82353C4.46051 3.98582 4.27839 4.08329 4.08333 4.08329H1.75C1.59529 4.08329 1.44692 4.14475 1.33752 4.25415C1.22812 4.36354 1.16667 4.51192 1.16667 4.66663V11.0833C1.16667 11.238 1.22812 11.3864 1.33752 11.4958C1.44692 11.6052 1.59529 11.6666 1.75 11.6666H12.25C12.4047 11.6666 12.5531 11.6052 12.6625 11.4958C12.7719 11.3864 12.8333 11.238 12.8333 11.0833V4.66663C12.8333 4.51192 12.7719 4.36354 12.6625 4.25415C12.5531 4.14475 12.4047 4.08329 12.25 4.08329H9.91667C9.72161 4.08329 9.53949 3.98582 9.4313 3.82353L8.43781 2.33329H5.56219Z" fill="white"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M7.00004 5.83329C6.03354 5.83329 5.25004 6.61679 5.25004 7.58329C5.25004 8.54979 6.03354 9.33329 7.00004 9.33329C7.96654 9.33329 8.75004 8.54979 8.75004 7.58329C8.75004 6.61679 7.96654 5.83329 7.00004 5.83329ZM4.08337 7.58329C4.08337 5.97246 5.38921 4.66663 7.00004 4.66663C8.61087 4.66663 9.91671 5.97246 9.91671 7.58329C9.91671 9.19412 8.61087 10.5 7.00004 10.5C5.38921 10.5 4.08337 9.19412 4.08337 7.58329Z" fill="white"></path></svg>
              <input type="file" name="profile" class="sr-only" @change="handleFileUpload" />
            </label>
          </div>
        </div>

        <div class="mt-4">
          <h3 class="mb-1.5 text-2xl font-semibold text-black dark:text-white">
            {{ user.name || 'User Tanpa Nama' }}
          </h3>
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
                <input
                  v-model="formData.fullName"
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-blue-light-500 active:border-blue-500 dark:border-form-strokedark dark:bg-form-input dark:focus:border-blue-light-500"
                />
              </div>

              <div class="mb-4.5">
                <label class="mb-2.5 block text-black dark:text-white">Nomor Telepon / WhatsApp</label>
                <input
                  v-model="formData.phoneNumber"
                  type="text"
                  placeholder="0812..."
                  class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-blue-light-500 active:border-blue-500 dark:border-form-strokedark dark:bg-form-input dark:focus:border-blue-light-500"
                />
              </div>

              <div class="mb-4.5">
                <label class="mb-2.5 block text-black dark:text-white">Email Universitas</label>
                <input
                  v-model="formData.email"
                  type="email"
                  disabled
                  class="w-full cursor-not-allowed rounded border-[1.5px] border-stroke bg-gray py-3 px-5 font-medium outline-none transition dark:bg-meta-4 dark:border-form-strokedark"
                />
                <p class="text-xs text-slate-400 mt-2">
                  *Email tersinkronisasi dengan sistem akademik (IMISSU/SIMAK) dan tidak dapat diubah manual.
                </p>
              </div>

              <button class="flex w-full justify-center rounded bg-blue-600 p-3 font-medium text-gray-100 hover:bg-blue-600/90 transition">
                Simpan Data Diri
              </button>
            </div>
          </form>
        </div>
      </div>

      <div class="flex flex-col gap-9">

        <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div class="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 class="font-medium text-black dark:text-white">Bio / Deskripsi Singkat</h3>
          </div>
          <div class="p-6.5">
            <div class="mb-4.5">
              <label class="mb-2.5 block text-black dark:text-white">Tentang Saya</label>
              <textarea
                v-model="formData.bio"
                rows="6"
                placeholder="Tuliskan sedikit tentang diri Anda, minat akademik, atau pesan untuk dosen..."
                class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-blue-light-500 active:border-blue-500 dark:border-form-strokedark dark:bg-form-input dark:focus:border-blue-light-500"
              ></textarea>
            </div>
            <div class="flex justify-end">
                <button @click="handleSave" class="text-blue-600 hover:text-blue-600/80 font-medium text-sm">
                  Simpan Bio
                </button>
            </div>
          </div>
        </div>

        <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
           <div class="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 class="font-medium text-black dark:text-white">Keamanan Akun</h3>
          </div>
          <div class="p-6.5">
             <p class="text-sm text-slate-500 mb-4">
               Disarankan mengganti kata sandi secara berkala untuk menjaga keamanan akun SI-BIKO Anda.
             </p>
             <button class="flex w-full justify-center rounded border border-stroke p-3 font-medium text-black hover:bg-gray-50 dark:border-strokedark dark:text-white dark:hover:bg-meta-4 transition">
                Ubah Kata Sandi
             </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
