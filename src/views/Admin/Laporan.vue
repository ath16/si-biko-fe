<script setup lang="ts">
import { ref, computed } from 'vue'
import Breadcrumb from '@/components/common/PageBreadcrumb.vue'
import { ChevronDownIcon } from '@/icons'
import html2pdf from 'html2pdf.js'

// --- STATE ---
const filter = ref({
  startDate: '',
  endDate: '',
  jenis: 'Semua'
})

const isGenerating = ref(false)

// Data Dummy Laporan
const reportData = ref([
  { id: 1, tanggal: '2025-12-01', mahasiswa: 'Atha Fajri', nim: '240001', jenis: 'Akademik', konselor: 'Dr. Budi', status: 'Selesai' },
  { id: 2, tanggal: '2025-12-05', mahasiswa: 'Siti Aminah', nim: '240005', jenis: 'Pribadi', konselor: 'Ibu Ratna', status: 'Rujuk WD3' },
  { id: 3, tanggal: '2025-12-10', mahasiswa: 'Budi Santoso', nim: '240010', jenis: 'Karir', konselor: 'Dr. Budi', status: 'Selesai' },
  { id: 4, tanggal: '2025-12-15', mahasiswa: 'Dewi Lestari', nim: '240015', jenis: 'Akademik', konselor: 'Ibu Ratna', status: 'Ditolak' },
])

// --- FILTER LOGIC ---
const filteredData = computed(() => {
  return reportData.value.filter(item => {
    // Filter Jenis
    const matchJenis = filter.value.jenis === 'Semua' || item.jenis === filter.value.jenis

    // Filter Tanggal
    let matchDate = true
    if (filter.value.startDate && filter.value.endDate) {
      matchDate = item.tanggal >= filter.value.startDate && item.tanggal <= filter.value.endDate
    }

    return matchJenis && matchDate
  })
})

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
            <select v-model="filter.jenis" class="w-full appearance-none rounded border border-stroke bg-transparent py-2 px-4 outline-none focus:border-blue-light-500 dark:border-form-strokedark dark:bg-form-input">
              <option value="Semua">Semua Layanan</option>
              <option value="Akademik">Akademik</option>
              <option value="Pribadi">Pribadi</option>
              <option value="Karir">Karir</option>
            </select>
            <span class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronDownIcon class="w-4 h-4" />
            </span>
          </div>
        </div>

        <div class="w-full md:w-1/4">
          <button @click="handlePrint" :disabled="isGenerating" class="flex w-full justify-center gap-2 rounded bg-blue-600 py-2 px-6 font-medium text-white hover:bg-opacity-90 disabled:opacity-70">
            <span v-if="isGenerating">Mencetak...</span>
            <span v-else>Cetak PDF</span>
          </button>
        </div>

      </div>
    </div>

    <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">

      <div id="report-area" class="p-8 bg-white text-black">
        <div class="text-center mb-8 border-b-2 border-black pb-4">
          <h2 class="text-2xl font-bold uppercase">Laporan Rekapitulasi Layanan Bimbingan Konseling</h2>
          <h3 class="text-xl font-semibold">Fakultas Matematika dan Ilmu Pengetahuan Alam</h3>
          <p class="text-sm mt-1">Periode: {{ filter.startDate || '...' }} s/d {{ filter.endDate || '...' }}</p>
        </div>

        <table class="w-full table-auto border-collapse border border-black">
          <thead>
            <tr class="bg-gray-200 text-left">
              <th class="border border-black py-2 px-3 text-sm font-bold">No</th>
              <th class="border border-black py-2 px-3 text-sm font-bold">Tanggal</th>
              <th class="border border-black py-2 px-3 text-sm font-bold">Mahasiswa</th>
              <th class="border border-black py-2 px-3 text-sm font-bold">NIM</th>
              <th class="border border-black py-2 px-3 text-sm font-bold">Jenis</th>
              <th class="border border-black py-2 px-3 text-sm font-bold">Konselor</th>
              <th class="border border-black py-2 px-3 text-sm font-bold">Status Akhir</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in filteredData" :key="item.id">
              <td class="border border-black py-2 px-3 text-sm text-center">{{ index + 1 }}</td>
              <td class="border border-black py-2 px-3 text-sm">{{ item.tanggal }}</td>
              <td class="border border-black py-2 px-3 text-sm">{{ item.mahasiswa }}</td>
              <td class="border border-black py-2 px-3 text-sm">{{ item.nim }}</td>
              <td class="border border-black py-2 px-3 text-sm">{{ item.jenis }}</td>
              <td class="border border-black py-2 px-3 text-sm">{{ item.konselor }}</td>
              <td class="border border-black py-2 px-3 text-sm">{{ item.status }}</td>
            </tr>
            <tr v-if="filteredData.length === 0">
              <td colspan="7" class="border border-black py-4 text-center text-sm italic">Tidak ada data pada periode ini.</td>
            </tr>
          </tbody>
        </table>

        <div class="mt-6 flex justify-end">
          <div class="w-1/3">
            <table class="w-full text-sm font-bold">
              <tr>
                <td class="py-1">Total Ajuan</td>
                <td class="text-right">{{ filteredData.length }}</td>
              </tr>
              <tr>
                <td class="py-1">Selesai</td>
                <td class="text-right">{{ filteredData.filter(i => i.status === 'Selesai').length }}</td>
              </tr>
              <tr>
                <td class="py-1">Rujuk Univ</td>
                <td class="text-right">{{ filteredData.filter(i => i.status.includes('Rujuk')).length }}</td>
              </tr>
            </table>
          </div>
        </div>

        <div class="mt-16 flex justify-end">
          <div class="text-center w-64">
            <p class="mb-20 text-sm">Denpasar, {{ new Date().toLocaleDateString('id-ID') }}</p>
            <p class="font-bold border-b border-black inline-block text-sm">Administrator SI-BIKO</p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
