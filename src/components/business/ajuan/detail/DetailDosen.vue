<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import ModalTolak from '@/components/business/ajuan/ModalTolak.vue'
import ModalReschedule from '@/components/business/ajuan/ModalReschedule.vue'

const router = useRouter()

const statusPenanganan = ref<'pending' | 'ditolak' | 'reschedule' | 'proses' | 'selesai'>('pending')
const catatanDosen = ref('')

const showModalTolak = ref(false)
const showModalReschedule = ref(false)

const handleTolak = () => showModalTolak.value = true
const onSubmitTolak = (alasan: string) => { statusPenanganan.value = 'ditolak'; showModalTolak.value = false }
const handleReschedule = () => showModalReschedule.value = true
const onSubmitReschedule = (data: any) => { statusPenanganan.value = 'reschedule'; showModalReschedule.value = false }
const handleTerima = () => { if(confirm("Terima ajuan?")) statusPenanganan.value = 'proses' }
const handleSelesai = () => { if(!catatanDosen.value) return alert("Isi catatan!"); statusPenanganan.value = 'selesai' }
const handleRujuk = () => { if(!catatanDosen.value) return alert("Isi catatan!"); statusPenanganan.value = 'selesai' }
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
          <p class="text-sm italic">"Saya ingin menghapus ajuan ini karena salah input."</p>
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
