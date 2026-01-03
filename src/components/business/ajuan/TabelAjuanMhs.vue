<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

// Dummy Data (Nanti diganti API)
const dataAjuan = ref([
  { id: 1, judul: 'Konsultasi KRS Semester 5', jenis: 'Akademik', tgl: '20 Des 2025', status: 'pending' },
  { id: 2, judul: 'Masalah Ekonomi UKT', jenis: 'Pribadi', tgl: '15 Des 2025', status: 'disetujui' },
  { id: 3, judul: 'Sulit Fokus Belajar', jenis: 'Pribadi', tgl: '10 Nov 2025', status: 'selesai' },
])

const getStatusBadge = (status: string) => {
  switch(status) {
    case 'pending': return 'bg-yellow-600/10 text-yellow-600'
    case 'disetujui': return 'bg-green-600/10 text-green-600'
    case 'ditolak': return 'bg-red-600/10 text-red-600'
    case 'selesai': return 'bg-blue-600/10 text-blue-600'
    case 'request_delete': return 'bg-gray-200 text-gray-600 border border-gray-300'
    default: return 'bg-gray-100 text-gray-600'
  }
}
</script>

<template>
  <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
    <div class="py-6 px-4 md:px-6 xl:px-7.5 flex justify-between items-center">
      <h4 class="text-xl font-bold text-black dark:text-white">Riwayat Ajuan Saya</h4>
      <RouterLink to="/app/ajuan/tambah" class="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-600/90">
        + Buat Ajuan
      </RouterLink>
    </div>

    <div class="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5 bg-gray-50 dark:bg-meta-4">
      <div class="col-span-3 sm:col-span-4"><p class="font-medium">Judul Konseling</p></div>
      <div class="col-span-2 hidden sm:block"><p class="font-medium">Tanggal</p></div>
      <div class="col-span-3 sm:col-span-2 text-center"><p class="font-medium">Status & Aksi</p></div>
    </div>

    <div v-for="item in dataAjuan" :key="item.id" class="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5 items-center hover:bg-gray-50 dark:hover:bg-meta-4 transition">
      <div class="col-span-3 sm:col-span-4">
        <p class="text-sm font-medium text-black dark:text-white truncate">{{ item.judul }}</p>
        <p class="text-xs text-slate-500">{{ item.jenis }}</p>
      </div>
      <div class="col-span-2 hidden sm:block">
        <p class="text-sm text-black dark:text-white">{{ item.tgl }}</p>
      </div>
      <div class="col-span-3 sm:col-span-2 flex items-center justify-center gap-2">
        <span :class="`px-2 py-1 rounded text-xs font-medium capitalize ${getStatusBadge(item.status)}`">
          {{ item.status }}
        </span>
        <RouterLink :to="`/app/ajuan/${item.id}`" class="text-blue-600 hover:underline text-sm ml-2">
          Detail
        </RouterLink>
      </div>
    </div>
  </div>
</template>
