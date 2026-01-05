<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import axios from 'axios'
import ModalTolak from '@/components/business/ajuan/ModalTolak.vue'

const dataMasuk = ref([])
const isLoading = ref(true)
const showTolak = ref(false)
const selectedId = ref<number | null>(null)

const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}

// Fetch Data Ajuan Masuk
const fetchData = async () => {
  isLoading.value = true
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get('http://localhost:8000/api/staff/ajuan', {
      headers: { Authorization: `Bearer ${token}` }
    })
    dataMasuk.value = response.data
  } catch (error) {
    console.error("Gagal load data:", error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => fetchData())

// Logika Terima
const handleTerima = async (id: number) => {
  if (!confirm("Terima ajuan ini?")) return

  try {
    const token = localStorage.getItem('token')
    await axios.put(`http://localhost:8000/api/staff/ajuan/${id}/status`,
      { status: 'disetujui' },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    alert("Ajuan diterima.")
    fetchData() // Refresh data
  } catch (error) {
    console.error(error)
    alert("Gagal memperbarui status.")
  }
}

// Logika Tolak
const handleTolak = (id: number) => {
  selectedId.value = id
  showTolak.value = true
}

const onSubmitTolak = async (alasan: string) => {
  try {
    const token = localStorage.getItem('token')
    await axios.put(`http://localhost:8000/api/staff/ajuan/${selectedId.value}/status`,
      { status: 'ditolak', alasan_penolakan: alasan },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    alert("Ajuan berhasil ditolak.")
    showTolak.value = false
    fetchData() // Refresh data
  } catch (error) {
    console.error(error)
    alert("Gagal menolak ajuan.")
  }
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

    <div v-if="isLoading" class="p-6 text-center text-gray-500">Memuat data...</div>
    <div v-else-if="dataMasuk.length === 0" class="p-6 text-center text-gray-500">Tidak ada ajuan masuk.</div>

    <div v-else v-for="item in dataMasuk" :key="item.id_ajuan" class="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5 items-center hover:bg-gray-50 dark:hover:bg-meta-4 transition">
      <div class="col-span-3 sm:col-span-3">
        <p class="text-sm font-bold text-black dark:text-white">{{ item.mahasiswa?.nama_lengkap || 'Unknown' }}</p>
        <p class="text-xs text-slate-500">{{ item.nim }}</p>
      </div>
      <div class="col-span-2 sm:col-span-3">
        <p class="text-sm text-black dark:text-white truncate">{{ item.judul_konseling }}</p>
        <p class="text-xs text-slate-500">{{ formatDate(item.tanggal_pengajuan) }}</p>

        <span v-if="item.status !== 'pending'" class="mt-1 inline-block text-[10px] px-2 py-0.5 rounded bg-gray-100 border border-gray-300 uppercase">
            {{ item.status }}
        </span>
      </div>
      <div class="col-span-1 sm:col-span-2 flex flex-col sm:flex-row items-center justify-center gap-2">

        <template v-if="item.status === 'pending'">
            <button @click="handleTerima(item.id_ajuan)" class="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-600/90">Terima</button>
            <button @click="handleTolak(item.id_ajuan)" class="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-600/90">Tolak</button>
        </template>

        <RouterLink :to="`/app/ajuan/${item.id_ajuan}`" class="border border-blue-light-500 text-blue-600 px-2 py-1 rounded text-xs hover:bg-blue-700 hover:text-white">Detail</RouterLink>
      </div>
    </div>

    <ModalTolak :isOpen="showTolak" @close="showTolak = false" @submit="onSubmitTolak" />
  </div>
</template>
