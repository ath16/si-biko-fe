<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import ModalReschedule from '@/components/business/ajuan/ModalReschedule.vue'

const router = useRouter()

const status = ref('pending') // Status ajuan

const detailAjuan = ref({
  id: 101,
  judul: 'Bimbingan Skripsi Bab 1',
  jenis: 'Akademik',
  konselor: 'Dr. Budi Santoso',
  tanggalAwal: '20 Des 2025, 09:00 WITA',
  keterangan: 'Saya ingin konsultasi mengenai latar belakang masalah.',
  jadwalBaru: {
    tanggal: '22 Des 2025',
    waktu: '13:00 WITA',
    pesan: 'Maaf tanggal 20 saya ada rapat dekanat, bisakah di waktu ini?'
  }
})

const showModalReschedule = ref(false)

// --- HELPER CLASS ---
const getBadgeClass = (statusKey: string) => {
  const base = "rounded py-1 px-3 text-sm font-medium "
  switch(statusKey) {
    case 'pending': return base + "bg-yellow-600/10 text-yellow-600"
    case 'reschedule': return base + "bg-blue-600/10 text-blue-600"
    case 'disetujui': return base + "bg-green-600/10 text-green-600"
    case 'ditolak': return base + "bg-red-600/10 text-red-600"
    default: return base + "bg-gray-100 text-slate-600"
  }
}

// --- ACTIONS ---
const handleBack = () => router.back()

const handleSetuju = () => {
  if(confirm("Setujui jadwal ini?")) {
    status.value = 'disetujui'
    detailAjuan.value.tanggalAwal = `${detailAjuan.value.jadwalBaru.tanggal}, ${detailAjuan.value.jadwalBaru.waktu}`
  }
}

const handleAjukanLagi = () => showModalReschedule.value = true

const onSubmitReschedule = (data: any) => {
  console.log("Reschedule:", data)
  status.value = 'pending'
  showModalReschedule.value = false
}

// --- HAPUS LANGSUNG (BACKEND SUPPORT) ---
const handleHapus = () => {
  // Karena backend sudah mengizinkan hapus jika pending
  if(confirm("Hapus ajuan ini secara permanen?")) {
    // Panggil API DELETE /api/ajuan/{id}
    console.log("Menghapus ajuan ID:", detailAjuan.value.id)
    alert("Ajuan berhasil dihapus.")
    router.push('/app/ajuan')
  }
}
</script>

<template>
  <div class="grid grid-cols-1 gap-9 lg:grid-cols-2">
    <div class="flex flex-col gap-9">
      <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div class="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 class="font-medium text-black dark:text-white">Detail Ajuan Konseling</h3>
        </div>
        <div class="p-6.5">

          <div class="mb-6 flex items-center justify-between">
            <span class="text-sm text-slate-500">ID: #{{ detailAjuan.id }}</span>
            <span v-if="status === 'pending'" :class="getBadgeClass('pending')">Menunggu Konfirmasi</span>
            <span v-else-if="status === 'reschedule'" :class="getBadgeClass('reschedule')">Tawaran Jadwal Baru</span>
            <span v-else-if="status === 'disetujui'" :class="getBadgeClass('disetujui')">Disetujui</span>
            <span v-else-if="status === 'ditolak'" :class="getBadgeClass('ditolak')">Ditolak</span>
            <span v-else :class="getBadgeClass('selesai')">Selesai</span>
          </div>

          <div class="mb-4.5">
            <label class="mb-2.5 block text-black dark:text-white font-semibold">Judul Konseling</label>
            <p class="text-slate-600 dark:text-slate-300">{{ detailAjuan.judul }}</p>
          </div>
          <div class="mb-4.5">
            <label class="mb-2.5 block text-black dark:text-white font-semibold">Jenis Layanan</label>
            <p class="text-slate-600 dark:text-slate-300">{{ detailAjuan.jenis }}</p>
          </div>
          <div class="mb-4.5">
            <label class="mb-2.5 block text-black dark:text-white font-semibold">Dosen PA / Konselor</label>
            <p class="text-black dark:text-white">{{ detailAjuan.konselor }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-9">
      <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div class="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 class="font-medium text-black dark:text-white">Tindakan</h3>
        </div>
        <div class="p-6.5">

          <div v-if="status === 'reschedule'" class="flex flex-col gap-4">
             <div class="bg-blue-50 p-4 rounded border border-blue-100 text-blue-800 text-sm">
                <p class="font-bold">Tawaran Jadwal Baru:</p>
                <p>{{ detailAjuan.jadwalBaru.tanggal }} {{ detailAjuan.jadwalBaru.waktu }}</p>
             </div>
             <button @click="handleSetuju" class="w-full bg-blue-600 text-white p-3 rounded hover:bg-opacity-90">Setuju</button>
             <button @click="handleAjukanLagi" class="w-full border border-blue-600 text-blue-600 p-3 rounded hover:bg-gray-50">Ajukan Lain</button>
          </div>

          <div v-else-if="status === 'pending'" class="text-center py-4">
             <div class="bg-yellow-50 p-4 rounded mb-4 border border-yellow-100 text-yellow-800 text-sm">
                Ajuan menunggu konfirmasi Dosen.
             </div>
             <p class="font-bold mb-6">{{ detailAjuan.tanggalAwal }}</p>

             <div class="flex justify-center gap-3">
                <RouterLink
                  :to="`/app/ajuan/edit/${detailAjuan.id}`"
                  class="text-white bg-blue-600 border-blue-light-500 px-4 py-2 rounded text-sm hover:bg-blue-600/90 transition"
                >
                  Edit
                </RouterLink>

                <button @click="handleHapus" class="text-white bg-red-600 border border-red-300 px-4 py-2 rounded text-sm hover:bg-red-600/90 transition">
                  Hapus
                </button>
             </div>
          </div>

          <div v-else class="text-center py-4">
             <p class="font-bold text-green-600" v-if="status==='disetujui'">Terjadwal.</p>
             <p class="font-bold text-slate-600" v-else>Selesai/Ditutup.</p>
             <button @click="handleBack" class="mt-4 text-blue-600 hover:underline">Kembali</button>
          </div>

        </div>
      </div>
    </div>

    <ModalReschedule :isOpen="showModalReschedule" @close="showModalReschedule = false" @submit="onSubmitReschedule" />
  </div>
</template>
