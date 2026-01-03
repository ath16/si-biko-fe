<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router' // Import Router
import ModalTolak from '@/components/business/ajuan/ModalTolak.vue'
import ModalReschedule from '@/components/business/ajuan/ModalReschedule.vue'

const router = useRouter() // Init Router

// Tambahkan 'request_delete'
const statusPenanganan = ref<'pending' | 'ditolak' | 'reschedule' | 'proses' | 'selesai' | 'request_delete'>('pending') // Ubah default ke 'request_delete' untuk testing tampilan
const catatanDosen = ref('')

const showModalTolak = ref(false)
const showModalReschedule = ref(false)

// ... (Function Modal Tolak & Reschedule TETAP SAMA) ...
const handleTolak = () => showModalTolak.value = true
const onSubmitTolak = (alasan: string) => { /* logic lama */ statusPenanganan.value = 'ditolak'; showModalTolak.value = false }
const handleReschedule = () => showModalReschedule.value = true
const onSubmitReschedule = (data: any) => { /* logic lama */ statusPenanganan.value = 'reschedule'; showModalReschedule.value = false }
const handleTerima = () => { if(confirm("Terima ajuan?")) statusPenanganan.value = 'proses' }
const handleSelesai = () => { if(!catatanDosen.value) return alert("Isi catatan!"); statusPenanganan.value = 'selesai' }
const handleRujuk = () => { if(!catatanDosen.value) return alert("Isi catatan!"); statusPenanganan.value = 'selesai' }

// --- LOGIKA PERSETUJUAN HAPUS (BARU) ---
const handleApproveDelete = () => {
  if(confirm("Setujui penghapusan ajuan ini? Data akan hilang dari sistem.")) {
    alert("Ajuan berhasil dihapus.")
    router.push('/app/ajuan') // Kembali ke list karena data hilang
  }
}

const handleRejectDelete = () => {
  if(confirm("Tolak permintaan hapus? Status akan kembali Pending.")) {
    statusPenanganan.value = 'pending'
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
              <img src="/images/user/user.jpg" alt="User" />
            </div>
            <div>
              <h4 class="font-bold text-black dark:text-white">Atha Fajri</h4>
              <p class="text-sm">NIM: 240001</p>
            </div>
          </div>
          <p class="text-sm italic">"Saya ingin menghapus ajuan ini karena salah input."</p> </div>
      </div>
    </div>

    <div class="flex flex-col gap-9">
      <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div class="border-b border-stroke py-4 px-6.5 dark:border-strokedark bg-gray-50 dark:bg-meta-4">
          <h3 class="font-bold text-black dark:text-white">Tindakan Dosen</h3>
        </div>

        <div class="p-6.5">

          <div v-if="statusPenanganan === 'request_delete'" class="flex flex-col gap-4">
            <div class="bg-red-50 text-red-800 p-4 rounded border border-red-200">
              <div class="flex items-start gap-3">
                <svg class="w-6 h-6 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                <div>
                  <h4 class="font-bold text-lg">Permintaan Hapus</h4>
                  <p class="text-sm mt-1">Mahasiswa mengajukan penghapusan untuk ajuan ini. Apakah Anda mengizinkan?</p>
                </div>
              </div>
            </div>

            <div class="flex flex-col gap-3 mt-2">
              <button @click="handleApproveDelete" class="w-full bg-red-600 text-white p-3 rounded font-medium hover:bg-red-700 transition">
                Izinkan & Hapus Permanen
              </button>
              <button @click="handleRejectDelete" class="w-full border border-stroke text-slate-600 p-3 rounded font-medium hover:bg-gray-50 transition">
                Tolak (Kembalikan ke Pending)
              </button>
            </div>
          </div>

          <div v-else-if="statusPenanganan === 'pending'" class="flex flex-col gap-4">
            <div class="bg-blue-50 text-blue-800 p-3 rounded text-sm mb-2 border border-blue-100">
              Jadwal yang diminta: <b>20 Des 2025, 09:00 WITA</b>
            </div>
            <button @click="handleTerima" class="flex justify-center rounded bg-blue-600 p-3 font-medium text-gray-100 hover:bg-blue-600/90 w-full">Terima & Mulai Konseling</button>
            <div class="grid grid-cols-2 gap-4">
              <button @click="handleReschedule" class="flex justify-center rounded border border-yellow-300 text-yellow-600 p-3 font-medium hover:bg-yellow-600 hover:text-white transition">Reschedule</button>
              <button @click="handleTolak" class="flex justify-center rounded border border-red-300 text-red-600 p-3 font-medium hover:bg-red-600 hover:text-white transition">Tolak</button>
            </div>
          </div>

          <div v-else-if="statusPenanganan === 'proses'" class="flex flex-col gap-4">
             <p>Sesi Berlangsung...</p>
             <button @click="handleSelesai" class="bg-green-600 text-white p-3 rounded">Selesai</button>
          </div>

          <div v-else class="text-center p-6 bg-gray-50 rounded border border-gray-100">
             <h3 class="font-bold">Status: {{ statusPenanganan.toUpperCase() }}</h3>
             <RouterLink to="/app/ajuan" class="text-blue-600 underline">Kembali</RouterLink>
          </div>

        </div>
      </div>
    </div>

    <ModalTolak :isOpen="showModalTolak" @close="showModalTolak = false" @submit="onSubmitTolak" />
    <ModalReschedule :isOpen="showModalReschedule" @close="showModalReschedule = false" @submit="onSubmitReschedule" />
  </div>
</template>
