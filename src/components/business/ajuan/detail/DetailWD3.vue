<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ModalTolak from '@/components/business/ajuan/ModalTolak.vue'
import ModalReschedule from '@/components/business/ajuan/ModalReschedule.vue'

const router = useRouter()

const statusPenanganan = ref<'pending' | 'ditolak' | 'reschedule' | 'proses' | 'selesai'>('pending')
const catatanWD3 = ref('')

const showModalTolak = ref(false)
const showModalReschedule = ref(false)

const handleTolak = () => {
  showModalTolak.value = true
}

const onSubmitTolak = (alasan: string) => {
  console.log("WD3 Menolak dengan alasan:", alasan)
  alert("Kasus dikembalikan/ditolak.")
  statusPenanganan.value = 'ditolak'
  showModalTolak.value = false
}

const handleReschedule = () => {
  showModalReschedule.value = true
}

const onSubmitReschedule = (data: any) => {
  console.log("WD3 Reschedule:", data)
  alert(`Jadwal pengganti berhasil diajukan: ${data.tanggal} jam ${data.waktu}`)
  statusPenanganan.value = 'reschedule'
  showModalReschedule.value = false
}

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
            <button @click="handleTolak" class="w-full border border-red-300 text-red-600 p-3 rounded font-medium">Tolak / Kembalikan</button>
            <button @click="handleReschedule" class="w-full border border-yellow-300 text-yellow-600 p-3 rounded font-medium">Ubah Jadwal</button>
            <button @click="handleTerima" class="w-full bg-blue-600 text-white p-3 rounded font-medium">Tangani Kasus Ini</button>
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

           <div v-else class="text-center p-6 bg-gray-50 rounded border border-gray-100">

            <div v-if="statusPenanganan === 'selesai'">
              <div class="mb-3 flex justify-center">
                <div class="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
              </div>
              <h3 class="text-green-600 font-bold text-lg">Masalah Selesai</h3>
              <p class="text-sm text-gray-500">Penanganan kasus telah ditutup di tingkat Fakultas.</p>
            </div>

            <div v-else-if="statusPenanganan === 'ditolak'">
              <div class="mb-3 flex justify-center">
                <div class="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                  <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </div>
              </div>
              <h3 class="text-red-600 font-bold text-lg">Ajuan Dikembalikan</h3>
              <p class="text-sm text-gray-500">Ajuan rujukan telah ditolak/dikembalikan ke Dosen.</p>
            </div>

            <div v-else-if="statusPenanganan === 'reschedule'">
              <div class="mb-3 flex justify-center">
                <div class="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
              </div>
              <h3 class="text-yellow-600 font-bold text-lg">Menunggu Jadwal Baru</h3>
              <p class="text-sm text-gray-500">Permintaan ubah jadwal telah dikirim.</p>
            </div>

            <RouterLink to="/app/ajuan" class="text-blue-600 font-medium hover:underline mt-6 block">← Kembali ke Daftar Ajuan</RouterLink>

           </div>
        </div>
      </div>
    </div>

    <ModalTolak
      :isOpen="showModalTolak"
      @close="showModalTolak = false"
      @submit="onSubmitTolak"
    />

    <ModalReschedule
      :isOpen="showModalReschedule"
      @close="showModalReschedule = false"
      @submit="onSubmitReschedule"
    />

  </div>
</template>
