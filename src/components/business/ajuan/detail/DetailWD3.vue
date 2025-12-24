<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const statusPenanganan = ref<'pending' | 'proses' | 'selesai'>('pending')
const catatanWD3 = ref('')

const handleTerima = () => statusPenanganan.value = 'proses'

const handleSelesai = () => {
  if(!catatanWD3.value) return alert("Catatan wajib diisi!")
  statusPenanganan.value = 'selesai'
}
// Logika Cetak Surat
const handleRujukUniv = () => {
   if(!catatanWD3.value) return alert("Catatan wajib diisi!")
   // Arahkan ke halaman cetak
   // window.location.href = '/app/ajuan/101/cetak'
   router.push('/print/surat-rujukan/101')
}
</script>

<template>
  <div class="grid grid-cols-1 gap-9 sm:grid-cols-2">
    <div class="flex flex-col gap-9">
      <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div class="border-b border-stroke py-4 px-6.5 dark:border-strokedark bg-red-600/10">
          <h3 class="font-bold text-red-600">⚠️ Kasus Rujukan</h3>
        </div>
        <div class="p-6.5 flex flex-col gap-4">
          <p class="text-sm"><b>Dari Dosen:</b> Dr. Budi Santoso</p>
          <p class="text-sm"><b>Mahasiswa:</b> Atha Fajri (Informatika)</p>
          <div class="bg-gray-50 p-3 rounded text-sm italic border border-gray-200">
            "Masalah mahasiswa ini cukup berat terkait depresi berat, saya merujuk ke WD3 untuk penanganan lebih lanjut atau rujukan ke Psikolog Universitas."
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-9">
      <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div class="border-b border-stroke py-4 px-6.5 dark:border-strokedark bg-gray-50">
          <h3 class="font-bold text-black">Penanganan WD3</h3>
        </div>
        <div class="p-6.5">
           <div v-if="statusPenanganan === 'pending'" class="flex flex-col gap-3">
             <button @click="handleTerima" class="w-full bg-blue-600 text-white p-3 rounded font-medium">Tangani Kasus Ini</button>
             <button class="w-full border border-red-300 text-red-600 p-3 rounded font-medium">Tolak / Kembalikan</button>
           </div>

           <div v-else-if="statusPenanganan === 'proses'" class="flex flex-col gap-4">
             <textarea v-model="catatanWD3" rows="4" placeholder="Catatan penanganan WD3..." class="w-full border p-3 rounded"></textarea>

             <div class="flex flex-col gap-3">
               <button @click="handleSelesai" class="bg-green-600 text-white p-3 rounded">Masalah Selesai di Fakultas</button>
               <button @click="handleRujukUniv" class="bg-purple-600 text-white p-3 rounded flex justify-center gap-2">
                 <span>🖨️</span> Tidak Selesai (Cetak Surat Rujukan Univ)
               </button>
             </div>
           </div>

           <div v-else class="text-center">
             <h3 class="text-green-600 font-bold">Kasus Ditutup.</h3>
             <RouterLink to="/app/ajuan" class="text-blue-600 underline mt-2 block">Kembali</RouterLink>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>
