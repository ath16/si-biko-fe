<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import Breadcrumb from '@/components/common/PageBreadcrumb.vue'
import { ChevronDownIcon } from '@/icons'
import html2pdf from 'html2pdf.js'
import axios from 'axios'

// --- STATE ---
const filter = ref({
  startDate: '',
  endDate: '',
  jenis: 'Semua'
})

const reportData = ref([])
const isLoading = ref(false)
const isGenerating = ref(false)

// Helper Format Tanggal Indonesia
const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
}

// Helper Menentukan Status Tampilan
const getDisplayStatus = (item: any) => {
  if (item.tingkat_penanganan === 'Universitas') return 'Rujuk Universitas'
  if (item.tingkat_penanganan === 'Fakultas') return 'Rujuk Fakultas'
  if (item.status === 'selesai') return 'Selesai'
  if (item.status === 'ditolak') return 'Ditolak'
  return 'Proses'
}

// --- FETCH DATA (INTEGRASI BE) ---
const fetchLaporan = async () => {
  isLoading.value = true
  try {
    const token = localStorage.getItem('token')

    // Siapkan parameter query
    const params: any = {}
    if (filter.value.jenis !== 'Semua') params.jenis = filter.value.jenis
    if (filter.value.startDate) params.start_date = filter.value.startDate
    if (filter.value.endDate) params.end_date = filter.value.endDate

    const response = await axios.get('http://localhost:8000/api/admin/laporan', {
      headers: { Authorization: `Bearer ${token}` },
      params: params
    })

    // Mapping Data Backend ke Format Laporan
    reportData.value = response.data.map((item: any) => ({
      id: item.id_ajuan,
      tanggal: formatDate(item.tanggal_pengajuan),
      mahasiswa: item.mahasiswa?.nama_lengkap || 'Unknown',
      nim: item.nim,
      jenis: item.jenis_layanan,
      konselor: item.handler?.nama_lengkap || 'Belum Ditentukan',
      status_raw: item.status, // Untuk logic hitungan
      tingkat: item.tingkat_penanganan, // Untuk logic hitungan
      display_status: getDisplayStatus(item) // Untuk tampilan tabel
    }))

  } catch (error) {
    console.error("Gagal memuat laporan:", error)
    alert("Gagal memuat data laporan.")
  } finally {
    isLoading.value = false
  }
}

// Load data saat pertama kali buka
onMounted(() => {
  fetchLaporan()
})

// --- COMPUTED STATS ---
const totalSelesai = computed(() => reportData.value.filter((i: any) => i.status_raw === 'selesai').length)
const totalRujuk = computed(() => reportData.value.filter((i: any) => i.tingkat === 'Fakultas' || i.tingkat === 'Universitas').length)

// --- PRINT LOGIC ---
const handlePrint = () => {
  isGenerating.value = true
  const element = document.getElementById('report-area')

  const opt = {
    margin:       10,
    filename:     `Laporan_Konseling_${new Date().toISOString().slice(0,10)}.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'landscape' }
  }

  html2pdf().set(opt).from(element).save().then(() => {
    isGenerating.value = false
  })
}
</script>

<template>
  <div class="mx-auto max-w-7xl">
    <Breadcrumb pageTitle="Laporan Statistik" />

    <div class="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark mb-6">
      <h3 class="mb-4 font-semibold text-black dark:text-white">Filter Laporan</h3>
      <div class="flex flex-col md:flex-row gap-4 items-end">

        <div class="w-full md:w-1/4">
          <label class="mb-2 block text-sm font-medium text-black dark:text-white">Dari Tanggal</label>
          <input v-model="filter.startDate" type="date" class="w-full rounded border border-stroke bg-transparent py-2 px-4 outline-none focus:border-blue-light-500 dark:border-form-strokedark dark:bg-form-input" />
        </div>

        <div class="w-full md:w-1/4">
          <label class="mb-2 block text-sm font-medium text-black dark:text-white">Sampai Tanggal</label>
          <input v-model="filter.endDate" type="date" class="w-full rounded border border-stroke bg-transparent py-2 px-4 outline-none focus:border-blue-light-500 dark:border-form-strokedark dark:bg-form-input" />
        </div>

        <div class="w-full md:w-1/4 relative">
          <label class="mb-2 block text-sm font-medium text-black dark:text-white">Jenis Layanan</label>
          <div class="relative">
            <select v-model="filter.jenis" class="w-full appearance-none rounded border border-stroke bg-transparent py-2 px-4 outline-none focus:border-blue-light-500 dark:border-form-strokedark dark:bg-form-input text-black dark:text-white">
              <option value="Semua">Semua Layanan</option>
              <option value="Akademik">Akademik</option>
              <option value="Pribadi">Pribadi</option>
              <option value="Karir">Karir</option>
              <option value="Sosial">Sosial</option>
            </select>
            <span class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
              <ChevronDownIcon class="w-4 h-4" />
            </span>
          </div>
        </div>

        <div class="w-full md:w-1/4 flex gap-2">
          <button @click="fetchLaporan" class="flex-1 justify-center rounded bg-blue-600 py-2 px-4 font-medium text-white hover:bg-blue-700 transition">
             Tampilkan
          </button>

          <button @click="handlePrint" :disabled="isGenerating || reportData.length === 0" class="flex-1 justify-center rounded bg-gray-800 py-2 px-4 font-medium text-white hover:bg-gray-900 disabled:opacity-70 disabled:cursor-not-allowed transition">
            {{ isGenerating ? '...' : 'PDF' }}
          </button>
        </div>

      </div>
    </div>

    <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark overflow-auto">

      <div v-if="isLoading" class="p-10 text-center text-gray-500">
        Mengambil data laporan...
      </div>

      <div v-else id="report-area" class="p-8 bg-white text-black min-w-[800px]">
        <div class="text-center mb-8 border-b-2 border-black pb-4">
          <h2 class="text-2xl font-bold uppercase">Laporan Rekapitulasi Layanan Bimbingan Konseling</h2>
          <h3 class="text-xl font-semibold">Fakultas Matematika dan Ilmu Pengetahuan Alam</h3>
          <p class="text-sm mt-1">
            Periode: {{ filter.startDate ? formatDate(filter.startDate) : 'Awal' }}
            s/d {{ filter.endDate ? formatDate(filter.endDate) : 'Sekarang' }}
          </p>
        </div>

        <table class="w-full table-auto border-collapse border border-black">
          <thead>
            <tr class="bg-gray-200 text-left">
              <th class="border border-black py-2 px-3 text-sm font-bold">No</th>
              <th class="border border-black py-2 px-3 text-sm font-bold">Tanggal</th>
              <th class="border border-black py-2 px-3 text-sm font-bold">Mahasiswa</th>
              <th class="border border-black py-2 px-3 text-sm font-bold">NIM</th>
              <th class="border border-black py-2 px-3 text-sm font-bold">Jenis</th>
              <th class="border border-black py-2 px-3 text-sm font-bold">PA / Konselor</th>
              <th class="border border-black py-2 px-3 text-sm font-bold">Status Akhir</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in reportData" :key="item.id">
              <td class="border border-black py-2 px-3 text-sm text-center">{{ index + 1 }}</td>
              <td class="border border-black py-2 px-3 text-sm">{{ item.tanggal }}</td>
              <td class="border border-black py-2 px-3 text-sm">{{ item.mahasiswa }}</td>
              <td class="border border-black py-2 px-3 text-sm">{{ item.nim }}</td>
              <td class="border border-black py-2 px-3 text-sm">{{ item.jenis }}</td>
              <td class="border border-black py-2 px-3 text-sm">{{ item.konselor }}</td>
              <td class="border border-black py-2 px-3 text-sm">
                <span class="font-medium"
                  :class="item.status_raw === 'selesai' ? 'text-green-700' : (item.status_raw === 'ditolak' ? 'text-red-700' : 'text-black')">
                  {{ item.display_status }}
                </span>
              </td>
            </tr>
            <tr v-if="reportData.length === 0">
              <td colspan="7" class="border border-black py-4 text-center text-sm italic">Tidak ada data ditemukan pada periode ini.</td>
            </tr>
          </tbody>
        </table>

        <div class="mt-6 flex justify-end">
          <div class="w-1/3">
            <table class="w-full text-sm font-bold">
              <tr>
                <td class="py-1">Total Ajuan</td>
                <td class="text-right">{{ reportData.length }}</td>
              </tr>
              <tr>
                <td class="py-1">Status Selesai</td>
                <td class="text-right">{{ totalSelesai }}</td>
              </tr>
              <tr>
                <td class="py-1">Rujukan (Fakultas/Univ)</td>
                <td class="text-right">{{ totalRujuk }}</td>
              </tr>
            </table>
          </div>
        </div>

        <div class="mt-16 flex justify-end">
          <div class="text-center w-64">
            <p class="mb-20 text-sm">Denpasar, {{ new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }}</p>
            <p class="font-bold inline-block text-sm">Administrator SI-BIKO</p>
            <p class="font-bold border-t border-black inline-block text-sm text-white">Administrator SI-BIKO</p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
