<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import axios from 'axios'

const dataMasuk = ref([])
const isLoading = ref(true)

const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}

const fetchData = async () => {
  isLoading.value = true
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get('http://localhost:8000/api/wd3/ajuan', {
      headers: { Authorization: `Bearer ${token}` }
    })
    dataMasuk.value = response.data
  } catch (error) {
    console.error("Gagal load data WD3:", error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => fetchData())
</script>

<template>
  <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
    <div class="py-6 px-4 md:px-6 xl:px-7.5">
      <h4 class="text-xl font-bold text-black dark:text-white">Daftar Rujukan Masuk (Fakultas)</h4>
    </div>

    <div class="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5 bg-gray-50 dark:bg-meta-4">
      <div class="col-span-3 sm:col-span-3"><p class="font-medium">Mahasiswa</p></div>
      <div class="col-span-2 sm:col-span-3"><p class="font-medium">Masalah / Perujuk</p></div>
      <div class="col-span-1 sm:col-span-2 text-center"><p class="font-medium">Status</p></div>
    </div>

    <div v-if="isLoading" class="p-6 text-center text-gray-500">Memuat data...</div>
    <div v-else-if="dataMasuk.length === 0" class="p-6 text-center text-gray-500">Tidak ada rujukan masuk.</div>

    <div v-else v-for="item in dataMasuk" :key="item.id_ajuan" class="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5 items-center hover:bg-gray-50 dark:hover:bg-meta-4 transition">
      <div class="col-span-3 sm:col-span-3">
        <p class="text-sm font-bold text-black dark:text-white">{{ item.mahasiswa?.nama_lengkap }}</p>
        <p class="text-xs text-slate-500">{{ item.nim }}</p>
      </div>
      <div class="col-span-2 sm:col-span-3">
        <p class="text-sm text-black dark:text-white truncate">{{ item.judul_konseling }}</p>
        <p class="text-xs text-slate-500">Dari: {{ item.handler?.nama_lengkap }}</p>
      </div>
      <div class="col-span-1 sm:col-span-2 flex flex-col items-center justify-center gap-2">
        <span class="text-[10px] px-2 py-0.5 rounded bg-purple-100 text-purple-700 border border-purple-200 uppercase">
            {{ item.status }}
        </span>
        <RouterLink :to="`/app/ajuan/${item.id_ajuan}`" class="text-blue-600 hover:underline text-xs">
            Proses
        </RouterLink>
      </div>
    </div>
  </div>
</template>
