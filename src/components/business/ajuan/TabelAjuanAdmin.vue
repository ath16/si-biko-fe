<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const allData = ref([
  { id: 1, mhs: 'Atha', dosen: 'Dr. Budi', judul: 'Akademik', status: 'pending' },
  { id: 2, mhs: 'Siti', dosen: 'Prof. Made', judul: 'Pribadi', status: 'selesai' },
])
</script>

<template>
  <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
    <div class="py-6 px-4 md:px-6 xl:px-7.5"><h4 class="text-xl font-bold">Semua Data Konseling (Admin)</h4></div>
    <table class="w-full text-sm text-left">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-meta-4 dark:text-gray-400">
        <tr>
          <th class="px-6 py-3">Mahasiswa</th>
          <th class="px-6 py-3">Dosen Wali</th>
          <th class="px-6 py-3">Status</th>
          <th class="px-6 py-3">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in allData" :key="item.id" class="border-b dark:border-strokedark hover:bg-gray-50 dark:hover:bg-meta-4">
          <td class="px-6 py-4">{{ item.mhs }}</td>
          <td class="px-6 py-4">{{ item.dosen }}</td>
          <td class="px-6 py-4 font-bold uppercase">{{ item.status }}</td>
          <td class="px-6 py-4">
            <RouterLink :to="`/app/ajuan/${item.id}`" class="text-blue-600 hover:underline">Lihat Detail</RouterLink>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
