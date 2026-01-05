<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import axios from 'axios'

// --- STATE ---
const allData = ref<any[]>([])
const isLoading = ref(false)

// Pagination Config
const currentPage = ref(1)
const itemsPerPage = 10

// Filter State (Default Kosong agar menampilkan semua)
const filter = ref({
  startDate: '',
  endDate: '',
  jenis: 'Semua',
  status: 'Semua'
})

// --- HELPER ---
const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}

// Warna Badge Status
const getStatusBadge = (status: string, tingkat: string) => {
    // Khusus Rujukan
    if (tingkat === 'Fakultas' && status !== 'selesai') return 'bg-purple-100 text-purple-700 border-purple-200'
    if (tingkat === 'Universitas') return 'bg-indigo-100 text-indigo-700 border-indigo-200'

    switch(status) {
      // Status Level Prodi (Dosen)
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'reschedule': return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'disetujui': return 'bg-green-100 text-green-700 border-green-200'
      case 'ditolak': return 'bg-red-100 text-red-700 border-red-200'

      // Status Level Fakultas (WD3)
      case 'pending wd3': return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'reschedule wd3': return 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200'
      case 'disetujui wd3': return 'bg-teal-100 text-teal-700 border-teal-200'
      case 'ditolak wd3': return 'bg-rose-100 text-rose-700 border-rose-200'

      // Status Akhir
      case 'rujuk universitas': return 'bg-indigo-100 text-indigo-700 border-indigo-200'
      case 'selesai': return 'bg-blue-100 text-blue-700 border-blue-200'

      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
}

// Label Status Custom
const getStatusLabel = (item: any) => {
    if (item.tingkat_penanganan === 'Universitas') return 'Rujuk Univ'
    if (item.tingkat_penanganan === 'Fakultas' && item.status !== 'selesai') return 'Rujuk Fakultas'
    return item.status
}

// --- FETCH DATA (TRIGGER TOMBOL) ---
const fetchData = async () => {
  isLoading.value = true
  try {
    const token = localStorage.getItem('token')

    // Kirim parameter filter ke backend
    const params: any = {}
    if (filter.value.jenis !== 'Semua') params.jenis = filter.value.jenis
    if (filter.value.status !== 'Semua') params.status = filter.value.status
    if (filter.value.startDate) params.start_date = filter.value.startDate
    if (filter.value.endDate) params.end_date = filter.value.endDate

    const response = await axios.get('http://localhost:8000/api/admin/ajuan', {
      headers: { Authorization: `Bearer ${token}` },
      params: params
    })

    allData.value = response.data
    currentPage.value = 1 // Reset ke halaman 1 setiap kali fetch baru

  } catch (error) {
    console.error("Gagal load data admin:", error)
    alert("Gagal mengambil data.")
  } finally {
    isLoading.value = false
  }
}

// Load otomatis saat pertama buka (tanpa filter = semua data)
onMounted(() => fetchData())

// --- LOGIC PAGINATION ---
const totalPages = computed(() => Math.ceil(allData.value.length / itemsPerPage))

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return allData.value.slice(start, end)
})

const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++ }
const prevPage = () => { if (currentPage.value > 1) currentPage.value-- }
</script>

<template>
  <div class="flex flex-col gap-6">

    <div class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      <h4 class="mb-4 font-semibold text-black dark:text-white">Filter Data Ajuan</h4>
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">

        <div>
            <label class="block text-sm font-medium mb-1">Dari Tanggal</label>
            <input v-model="filter.startDate" type="date" class="w-full h-10 rounded border border-stroke bg-transparent py-2 px-3 outline-none focus:border-blue-600 dark:border-form-strokedark dark:bg-form-input" />
        </div>

        <div>
            <label class="block text-sm font-medium mb-1">Sampai Tanggal</label>
            <input v-model="filter.endDate" type="date" class="w-full h-10 rounded border border-stroke bg-transparent py-2 px-3 outline-none focus:border-blue-600 dark:border-form-strokedark dark:bg-form-input" />
        </div>

        <div>
            <label class="block text-sm font-medium mb-1">Jenis Layanan</label>
            <select v-model="filter.jenis" class="w-full h-10 rounded border border-stroke bg-transparent py-2 px-3 outline-none focus:border-blue-600 dark:border-form-strokedark dark:bg-form-input">
                <option value="Semua">Semua</option>
                <option value="Akademik">Akademik</option>
                <option value="Pribadi">Pribadi</option>
                <option value="Karir">Karir</option>
                <option value="Sosial">Sosial</option>
            </select>
        </div>

        <div>
            <label class="block text-sm font-medium mb-1">Status</label>
            <select v-model="filter.status" class="w-full h-10 rounded border border-stroke bg-transparent py-2 px-3 outline-none focus:border-blue-600 dark:border-form-strokedark dark:bg-form-input">
                <option value="Semua">Semua</option>
                <option value="pending, pending wd3">Pending</option>
                <option value="reschedule, reschedule wd3">Reschedule</option>
                <option value="ditolak, ditolak wd3">Ditolak</option>
                <option value="disetujui, disetujui wd3">Disetujui</option>
                <option value="rujuk universitas">Rujuk Universitas</option>
                <option value="selesai">Selesai</option>
            </select>
        </div>

        <div>
            <button @click="fetchData" class="w-full h-10 rounded bg-blue-600 py-2 px-4 font-medium text-white hover:bg-blue-700 transition flex justify-center items-center gap-2">
                {{ isLoading ? 'Memuat...' : 'Tampilkan' }}
            </button>
        </div>

      </div>
    </div>

    <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div class="py-6 px-4 md:px-6 xl:px-7.5 border-b border-stroke dark:border-strokedark flex justify-between items-center">
          <h4 class="text-xl font-bold dark:text-white">Semua Data Konseling</h4>
          <span class="text-sm text-gray-500">Total: {{ allData.length }} Data</span>
      </div>

      <div v-if="isLoading" class="p-10 text-center text-gray-500">Sedang mengambil data...</div>

      <div v-else>
          <div class="overflow-x-auto">
              <table class="w-full text-sm text-left">
              <thead class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-meta-4 dark:text-gray-400">
                  <tr>
                  <th class="px-6 py-3">Tgl Pengajuan</th>
                  <th class="px-6 py-3">Mahasiswa</th>
                  <th class="px-6 py-3">Penanggung Jawab</th>
                  <th class="px-6 py-3">Topik</th>
                  <th class="px-6 py-3 text-center">Status</th>
                  </tr>
              </thead>
              <tbody>
                  <tr v-for="item in paginatedData" :key="item.id_ajuan" class="border-b dark:border-strokedark hover:bg-gray-50 dark:hover:bg-meta-4 transition">
                  <td class="px-6 py-4 font-medium dark:text-white">
                      {{ formatDate(item.tanggal_pengajuan) }}
                  </td>
                  <td class="px-6 py-4 font-medium dark:text-white">
                      <p>{{ item.mahasiswa?.nama_lengkap || 'Unknown' }}</p>
                      <p class="text-xs text-slate-500">{{ item.nim }}</p>
                  </td>
                  <td class="px-6 py-4 dark:text-white">
                      <p>{{ item.handler?.nama_lengkap || 'Belum Ditentukan' }}</p>
                      <p class="text-xs text-slate-500">{{ item.handler?.jabatan }}</p>
                  </td>
                  <td class="px-6 py-4 truncate max-w-[150px] dark:text-white">
                      <p class="truncate font-medium">{{ item.judul_konseling }}</p>
                      <p class="text-xs text-slate-500">{{ item.jenis_layanan }}</p>
                  </td>
                  <td class="px-6 py-4 text-center">
                      <span :class="`px-2 py-1 rounded text-xs font-bold uppercase border ${getStatusBadge(item.status, item.tingkat_penanganan)}`">
                          {{ getStatusLabel(item) }}
                      </span>
                  </td>
                  </tr>
                  <tr v-if="paginatedData.length === 0">
                      <td colspan="6" class="text-center py-8 text-slate-500">Tidak ada data ditemukan.</td>
                  </tr>
              </tbody>
              </table>
          </div>

          <div v-if="allData.length > 0" class="px-6 py-4 flex items-center justify-between border-t border-stroke dark:border-strokedark">
              <span class="text-sm text-slate-500">
                  Menampilkan {{ paginatedData.length }} dari total {{ allData.length }} data
              </span>
              <div class="flex gap-2">
                  <button
                      @click="prevPage"
                      :disabled="currentPage === 1"
                      class="px-3 py-1 rounded border border-stroke hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm dark:border-strokedark dark:hover:bg-meta-4"
                  >
                      Prev
                  </button>
                  <span class="px-3 py-1 text-sm font-medium">Hal {{ currentPage }} / {{ totalPages }}</span>
                  <button
                      @click="nextPage"
                      :disabled="currentPage >= totalPages"
                      class="px-3 py-1 rounded border border-stroke hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm dark:border-strokedark dark:hover:bg-meta-4"
                  >
                      Next
                  </button>
              </div>
          </div>
      </div>
    </div>
  </div>
</template>
