<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import ModalTolak from '@/components/business/ajuan/ModalTolak.vue'

// Dummy Data (Ajuan Masuk)
const dataMasuk = ref([
  { id: 101, mhs: 'Atha Fajri', nim: '240001', judul: 'Bimbingan Skripsi Bab 1', tgl: '21 Des 2025', status: 'pending' },
  { id: 102, mhs: 'Siti Aminah', nim: '240005', judul: 'Konsultasi Nilai E', tgl: '22 Des 2025', status: 'pending' },
])

const showTolak = ref(false)
const selectedId = ref<number | null>(null) // Menyimpan ID item yang sedang diklik

const handleTerima = (id: number) => {
  alert(`Ajuan #${id} Ajuan diterima.`)
}

const handleTolak = (id: number) => {
  selectedId.value = id
  showTolak.value = true
}
const onSubmitTolak = (alasan: string) => {
  console.log(`Menolak ID ${selectedId.value} karena: ${alasan}`)
  // Hapus dari list atau update status
  dataMasuk.value = dataMasuk.value.filter(item => item.id !== selectedId.value)
  showTolak.value = false
  alert("Berhasil menolak ajuan.")
}
</script>

<template>
  <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
    <div class="py-6 px-4 md:px-6 xl:px-7.5">
      <h4 class="text-xl font-bold text-black dark:text-white">Daftar Ajuan Masuk</h4>
    </div>

    <div class="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5 bg-gray-50 dark:bg-meta-4">
      <div class="col-span-3 sm:col-span-3"><p class="font-medium">Mahasiswa</p></div>
      <div class="col-span-2 sm:col-span-3"><p class="font-medium">Judul Konseling</p></div>
      <div class="col-span-1 sm:col-span-2 text-center"><p class="font-medium">Aksi</p></div>
    </div>

    <div v-for="item in dataMasuk" :key="item.id" class="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5 items-center hover:bg-gray-50 dark:hover:bg-meta-4 transition">
      <div class="col-span-3 sm:col-span-3">
        <p class="text-sm font-bold text-black dark:text-white">{{ item.mhs }}</p>
        <p class="text-xs text-slate-500">{{ item.nim }}</p>
      </div>
      <div class="col-span-2 sm:col-span-3">
        <p class="text-sm text-black dark:text-white truncate">{{ item.judul }}</p>
        <p class="text-xs text-slate-500">{{ item.tgl }}</p>
      </div>
      <div class="col-span-1 sm:col-span-2 flex flex-col sm:flex-row items-center justify-center gap-2">
        <button @click="handleTerima(item.id)" class="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-600/90">Terima</button>
        <button @click="handleTolak(item.id)" class="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-600/90">Tolak</button>
        <RouterLink :to="`/app/ajuan/${item.id}`" class="border border-blue-light-500 text-blue-600 px-2 py-1 rounded text-xs hover:bg-blue-700 hover:text-white">Detail</RouterLink>
      </div>
    </div>
    <ModalTolak
      :isOpen="showTolak"
      @close="showTolak = false"
      @submit="onSubmitTolak"
    />
  </div>
</template>
