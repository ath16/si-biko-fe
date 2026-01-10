<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import axios from 'axios'

const dataAjuan = ref([])
const isLoading = ref(true)

const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}

const fetchData = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get('http://localhost:8000/api/mahasiswa/ajuan', {
      headers: { Authorization: `Bearer ${token}` }
    })
    dataAjuan.value = response.data
  } catch (error) {
    console.error("Gagal memuat data ajuan:", error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => fetchData())

const getStatusBadge = (status: string) => {
  switch(status) {
    case 'pending': return 'bg-yellow-100 text-yellow-700 border border-yellow-200'
    case 'reschedule': return 'bg-purple-100 text-purple-700 border border-purple-200'
    case 'disetujui': return 'bg-blue-100 text-blue-700 border border-blue-200'
    case 'ditolak': return 'bg-red-100 text-red-700 border border-red-200'

    case 'pending wd3': return 'bg-orange-100 text-orange-700 border border-orange-200'
    case 'reschedule wd3': return 'bg-fuchsia-100 text-fuchsia-700 border border-fuchsia-200'
    case 'disetujui wd3': return 'bg-indigo-100 text-indigo-700 border border-indigo-200'

    case 'selesai': return 'bg-green-100 text-green-700 border border-green-200'
    case 'rujuk universitas': return 'bg-teal-100 text-teal-700 border border-teal-200'

    default: return 'bg-gray-100 text-gray-600'
  }
}

const getStatusLabel = (status: string) => {
    if (status === 'rujuk universitas') return 'Dirujuk ke Univ'
    if (status === 'pending wd3') return 'Proses di Fakultas'
    if (status === 'reschedule wd3') return 'Jadwal Ulang WD3'
    return status
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

    <div v-if="isLoading" class="p-8 text-center text-gray-500">Memuat data...</div>

    <div v-else-if="dataAjuan.length === 0" class="p-8 text-center text-gray-500">
      Belum ada riwayat ajuan.
    </div>

    <div v-else v-for="item in dataAjuan" :key="item.id_ajuan" class="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5 items-center hover:bg-gray-50 dark:hover:bg-meta-4 transition">
      <div class="col-span-3 sm:col-span-4">
        <p class="text-sm font-medium text-black dark:text-white truncate">{{ item.judul_konseling }}</p>
        <p class="text-xs text-slate-500">{{ item.jenis_layanan }}</p>
      </div>
      <div class="col-span-2 hidden sm:block">
        <p class="text-sm text-black dark:text-white">{{ formatDate(item.tanggal_pengajuan) }}</p>
      </div>
      <div class="col-span-3 sm:col-span-2 flex items-center justify-center gap-2">
        <span :class="`px-2 py-1 rounded text-xs font-medium uppercase ${getStatusBadge(item.status)}`">
          {{ getStatusLabel(item.status) }}
        </span>
        <RouterLink :to="`/app/ajuan/${item.id_ajuan}`" class="text-blue-600 hover:underline text-sm ml-2">
          Detail
        </RouterLink>
      </div>
    </div>
  </div>
</template>
