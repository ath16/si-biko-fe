<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import { ref, onMounted } from 'vue'
// Menggunakan ikon yang tersedia di folder icons
import {
  DocsIcon,
  CheckIcon,
  UserGroupIcon,
  WarningIcon,
  DraftIcon // Pengganti ClockIcon
} from '@/icons'

const { user, isMahasiswa, isDosen, isAdmin, isWD3 } = useAuth()

// Data Statistik Dummy
const stats = ref([
  { title: 'Total Ajuan', value: '0', color: 'text-blue-600', icon: DocsIcon },
  { title: 'Menunggu', value: '0', color: 'text-yellow-600', icon: DraftIcon },
  { title: 'Disetujui', value: '0', color: 'text-green-600', icon: CheckIcon },
  { title: 'Perlu Tindakan', value: '0', color: 'text-red-600', icon: WarningIcon },
])

// Ubah angka statistik berdasarkan Role saat komponen dimuat
onMounted(() => {
  if (isMahasiswa.value) {
    stats.value = [
      { title: 'Ajuan Saya', value: '3', color: 'text-blue-600', icon: DocsIcon },
      { title: 'Menunggu Respon', value: '1', color: 'text-yellow-600', icon: DraftIcon },
      { title: 'Jadwal Disetujui', value: '1', color: 'text-green-600', icon: CheckIcon },
      { title: 'Selesai', value: '1', color: 'text-slate-500', icon: CheckIcon },
    ]
  } else if (isDosen.value || isWD3.value) {
    stats.value = [
      { title: 'Ajuan Masuk', value: '5', color: 'text-blue-600', icon: DocsIcon },
      { title: 'Butuh Persetujuan', value: '2', color: 'text-yellow-600', icon: WarningIcon },
      { title: 'Jadwal Hari Ini', value: '1', color: 'text-green-600', icon: DraftIcon },
      { title: 'Total Mahasiswa', value: '24', color: 'text-slate-500', icon: UserGroupIcon },
    ]
  } else if (isAdmin.value) {
    stats.value = [
      { title: 'Total User', value: '150', color: 'text-blue-600', icon: UserGroupIcon },
      { title: 'Total Dosen', value: '45', color: 'text-green-600', icon: UserGroupIcon },
      { title: 'Total Mahasiswa', value: '100', color: 'text-yellow-600', icon: UserGroupIcon },
      { title: 'Aktivitas Login', value: '24', color: 'text-slate-500', icon: DraftIcon },
    ]
  }
})
</script>

<template>
  <div>
    <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-title-md2 font-bold text-black dark:text-white">
          Dashboard {{ user.role.toUpperCase() }}
        </h2>
        <p class="text-sm font-medium">
          Selamat Datang, <span class="text-blue-600 font-bold">{{ user.name }}</span>
        </p>
      </div>

      <div v-if="isMahasiswa">
        <router-link
          to="/app/ajuan/tambah"
          class="inline-flex items-center justify-center gap-2.5 rounded-md bg-blue-600 py-3 px-6 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
        >
          <span>+</span> Buat Ajuan Baru
        </router-link>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      <div
        v-for="(item, index) in stats"
        :key="index"
        class="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark"
      >
        <div class="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">
          <component :is="item.icon" class="fill-current text-blue-600 w-6 h-6" />
        </div>

        <div class="mt-4 flex items-end justify-between">
          <div>
            <h4 class="text-title-md font-bold text-black dark:text-white">
              {{ item.value }}
            </h4>
            <span class="text-sm font-medium text-slate-500">{{ item.title }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">

      <div v-if="isMahasiswa" class="col-span-12 xl:col-span-8">
        <div class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <h4 class="mb-6 text-xl font-bold text-black dark:text-white">Aktivitas Terakhir</h4>
          <div class="flex flex-col">
            <div class="grid grid-cols-3 sm:grid-cols-5 py-3 border-b border-stroke dark:border-strokedark">
              <div class="col-span-3"><p class="text-black dark:text-white">Bimbingan Akademik</p></div>
              <div class="col-span-1"><p class="text-yellow-600 text-sm">Pending</p></div>
              <div class="col-span-1 text-right"><p class="text-sm">20 Des</p></div>
            </div>
            <div class="grid grid-cols-3 sm:grid-cols-5 py-3 border-b border-stroke dark:border-strokedark">
              <div class="col-span-3"><p class="text-black dark:text-white">Konseling Pribadi</p></div>
              <div class="col-span-1"><p class="text-green-600 text-sm">Disetujui</p></div>
              <div class="col-span-1 text-right"><p class="text-sm">18 Des</p></div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="isDosen || isWD3" class="col-span-12 xl:col-span-8">
        <div class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <h4 class="mb-6 text-xl font-bold text-black dark:text-white">Jadwal Hari Ini</h4>
          <div class="bg-gray-50 dark:bg-meta-4 p-4 rounded text-center text-slate-500">
            Tidak ada jadwal konseling hari ini.
          </div>
        </div>
      </div>

      <div class="col-span-12 xl:col-span-4">
        <div class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h4 class="mb-4 text-xl font-bold text-black dark:text-white">Pengumuman</h4>
          <div class="flex flex-col gap-4">
            <div class="p-4 bg-blue-50 border-l-4 border-blue-light-500 rounded-r">
              <p class="text-sm text-blue-600 font-bold">Batas Pengajuan Cuti</p>
              <p class="text-xs text-slate-600 mt-1">Pengajuan cuti akademik paling lambat tanggal 30 Desember.</p>
            </div>
            <div class="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-r">
              <p class="text-sm text-warning-800 font-bold">Maintenance Sistem</p>
              <p class="text-xs text-slate-600 mt-1">Sistem akan down pada hari Sabtu jam 00:00 - 04:00 WITA.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
