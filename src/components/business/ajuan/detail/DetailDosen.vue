<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

// State untuk Mode Penanganan
const statusPenanganan = ref<'pending' | 'proses' | 'selesai'>('pending')
const catatanDosen = ref('')

const handleTerima = () => {
  if(confirm("Terima ajuan ini dan mulai sesi konseling?")) {
    statusPenanganan.value = 'proses'
  }
}

const handleSelesai = () => {
  if(!catatanDosen.value) return alert("Wajib isi catatan hasil konseling!")
  alert("Kasus ditutup. Status: Selesai.")
  statusPenanganan.value = 'selesai'
}

const handleRujuk = () => {
  if(!catatanDosen.value) return alert("Wajib isi alasan rujukan di catatan!")
  if(confirm("Kasus akan diteruskan ke WD3?")) {
    alert("Berhasil dirujuk ke WD3.")
    statusPenanganan.value = 'selesai'
  }
}
</script>

<template>
  <div class="grid grid-cols-1 gap-9 sm:grid-cols-2">
    <div class="flex flex-col gap-9">
      <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div class="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 class="font-medium text-black dark:text-white">Data Mahasiswa</h3>
        </div>
        <div class="p-6.5 flex flex-col gap-4">
          <div class="flex items-center gap-4 mb-4">
            <div class="h-14 w-14 rounded-full overflow-hidden">
              <img src="/images/user/user-01.jpg" alt="User" />
            </div>
            <div>
              <h4 class="font-bold text-black dark:text-white">Atha Fajri</h4>
              <p class="text-sm">NIM: 240001</p>
              <p class="text-sm">Prodi: Informatika</p>
            </div>
          </div>

          <div class="border-t border-stroke pt-4 dark:border-strokedark">
            <p class="font-semibold text-black dark:text-white mb-2">Keluhan:</p>
            <p class="text-sm text-slate-600 dark:text-slate-300 italic">"Saya merasa kesulitan membagi waktu, nilai turun."</p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-9">
      <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div class="border-b border-stroke py-4 px-6.5 dark:border-strokedark bg-gray-50 dark:bg-meta-4">
          <h3 class="font-bold text-black dark:text-white">Tindakan Dosen</h3>
        </div>

        <div class="p-6.5">
          <div v-if="statusPenanganan === 'pending'" class="flex flex-col gap-4">
            <div class="bg-blue-50 text-blue-800 p-3 rounded text-sm mb-2 border border-blue-100">
              Jadwal yang diminta: <b>20 Des 2025, 09:00 WITA</b>
            </div>

            <button @click="handleTerima" class="flex justify-center rounded bg-blue-600 p-3 font-medium text-gray-100 hover:bg-blue-600/90 w-full">
              Terima & Mulai Konseling
            </button>

            <div class="grid grid-cols-2 gap-4">
              <button class="flex justify-center rounded border border-yellow-300 text-yellow-600 p-3 font-medium hover:bg-yellow-600 hover:text-white transition">
                Reschedule
              </button>
              <button class="flex justify-center rounded border border-red-300 text-red-600 p-3 font-medium hover:bg-red-600 hover:text-white transition">
                Tolak
              </button>
            </div>
          </div>

          <div v-else-if="statusPenanganan === 'proses'" class="flex flex-col gap-4">
            <div class="bg-green-50 text-green-800 p-3 rounded text-sm mb-2 border border-green-100 flex items-center gap-2">
              <span>✓</span> Sesi Konseling Sedang Berlangsung / Selesai
            </div>

            <div>
              <label class="mb-2 block text-sm font-medium text-black dark:text-white">Catatan Hasil Konseling (Wajib)</label>
              <textarea
                v-model="catatanDosen"
                rows="5"
                placeholder="Tuliskan hasil diskusi, solusi yang diberikan, atau alasan merujuk..."
                class="w-full rounded border border-stroke bg-transparent py-3 px-4 text-black outline-none focus:border-primary dark:border-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              ></textarea>
            </div>

            <p class="text-sm font-medium mt-2">Keputusan Akhir:</p>
            <div class="flex flex-col gap-3">
              <button @click="handleSelesai" class="flex justify-center rounded bg-green-600 p-3 font-medium text-white hover:bg-green-600/90 w-full">
                Masalah Selesai
              </button>
              <button @click="handleRujuk" class="flex justify-center rounded bg-black p-3 font-medium text-white hover:bg-black-600/90 w-full">
                Tidak Selesai (Rujuk ke WD3)
              </button>
            </div>
          </div>

          <div v-else class="text-center py-6">
            <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-600/20 mb-4">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h3 class="text-lg font-bold text-black dark:text-white">Penanganan Selesai</h3>
            <p class="text-sm text-slate-500 mt-2">Data telah disimpan ke sistem.</p>
            <RouterLink to="/app/ajuan" class="inline-block mt-6 text-blue-600 hover:underline">Kembali ke Daftar</RouterLink>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
