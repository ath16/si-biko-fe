<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

// Data Dummy Satu Ajuan
const detail = ref({
  id: 'REQ-001',
  judul: 'Bimbingan Akademik Semester 5',
  deskripsi: 'Saya merasa kesulitan membagi waktu antara organisasi dan kuliah, nilai saya turun drastis.',
  dosen: 'Dr. Budi Santoso',
  jadwal: '20 Des 2025, 09:00 WITA',
  status: 'pending', // Bisa diganti 'disetujui', 'selesai', 'ditolak'
  catatan: ''
})
</script>

<template>
  <div class="grid grid-cols-1 gap-9 sm:grid-cols-2">
    <div class="flex flex-col gap-9">
      <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div class="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 class="font-medium text-black dark:text-white">Informasi Ajuan</h3>
        </div>
        <div class="p-6.5 flex flex-col gap-5">
          <div>
            <label class="mb-2 block text-sm font-medium text-black dark:text-white">Judul Konseling</label>
            <div class="w-full rounded border border-stroke bg-gray py-3 px-4 text-black focus:border-blue-light-500 focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-blue-light-500">
              {{ detail.judul }}
            </div>
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-black dark:text-white">Dosen Pembimbing</label>
            <div class="w-full rounded border border-stroke bg-gray py-3 px-4 text-black dark:bg-meta-4 dark:text-white">
              {{ detail.dosen }}
            </div>
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-black dark:text-white">Deskripsi Masalah</label>
            <textarea disabled rows="4" class="w-full rounded border border-stroke bg-gray py-3 px-4 text-black dark:bg-meta-4 dark:text-white">{{ detail.deskripsi }}</textarea>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-9">
      <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div class="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 class="font-medium text-black dark:text-white">Status Terkini</h3>
        </div>
        <div class="p-6.5">
          <div class="mb-4 flex items-center gap-3">
            <span class="font-semibold">Status:</span>
            <span class="inline-flex rounded-full bg-yellow-600/10 py-1 px-3 text-sm font-medium text-yellow-600">
              {{ detail.status.toUpperCase() }}
            </span>
          </div>
          <div class="mb-6">
            <label class="mb-2 block text-sm font-medium text-black dark:text-white">Jadwal Diajukan</label>
            <div class="w-full rounded border border-stroke bg-gray py-3 px-4 text-black dark:bg-meta-4 dark:text-white">
              {{ detail.jadwal }}
            </div>
          </div>

          <div v-if="detail.status === 'pending'" class="flex gap-4">
            <button class="flex justify-center rounded bg-blue-600 p-3 font-medium text-gray-100 hover:bg-blue-600/90 w-full">
              Edit Ajuan
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
