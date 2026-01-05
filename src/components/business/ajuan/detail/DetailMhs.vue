<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { useAuth } from '@/composables/useAuth'
import ModalReschedule from '@/components/business/ajuan/ModalReschedule.vue'

const route = useRoute()
const router = useRouter()
const { isMahasiswa, isAdmin } = useAuth()
const idAjuan = route.params.id

const detailAjuan = ref<any>(null)
const isLoading = ref(true)
const showModalReschedule = ref(false)

const getBadgeClass = (status: string) => {
  const base = "rounded py-1 px-3 text-sm font-medium uppercase "
  switch(status) {
    case 'pending': return base + "bg-yellow-600/10 text-yellow-600"
    case 'reschedule': return base + "bg-purple-600/10 text-purple-600"
    case 'disetujui': return base + "bg-green-600/10 text-green-600"
    case 'ditolak': return base + "bg-red-600/10 text-red-600"
    case 'selesai': return base + "bg-blue-600/10 text-blue-600"
    default: return base + "bg-gray-100 text-slate-600"
  }
}

const fetchDetail = async () => {
  try {
    const token = localStorage.getItem('token')
    const url = `http://localhost:8000/api/${isAdmin.value ? 'admin' : 'mahasiswa'}/ajuan/${idAjuan}`
    const response = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } })
    detailAjuan.value = response.data
  } catch (error) {
    console.error("Gagal load detail:", error)
    router.push('/app/ajuan')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => fetchDetail())

// AKSI MAHASISWA: Setuju Jadwal
const handleSetuju = async () => {
  if (!confirm("Setujui jadwal yang ditawarkan ini?")) return
  try {
    const token = localStorage.getItem('token')
    // Kirim status 'disetujui' ke update endpoint
    await axios.put(`http://localhost:8000/api/mahasiswa/ajuan/${idAjuan}`,
      { status: 'setuju' },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    alert("Jadwal disetujui.")
    fetchDetail()
  } catch (error) {
    alert("Gagal menyetujui jadwal.")
  }
}

// AKSI MAHASISWA: Ajukan Jadwal Lain
const onSubmitReschedule = async (data: any) => {
  try {
    const token = localStorage.getItem('token')
    const dateTime = `${data.tanggal} ${data.waktu}`
    await axios.put(`http://localhost:8000/api/mahasiswa/ajuan/${idAjuan}`,
      { tanggal_jadwal: dateTime }, // Mengirim tanggal baru = status jadi pending
      { headers: { Authorization: `Bearer ${token}` } }
    )
    alert("Pengajuan jadwal baru berhasil dikirim.")
    showModalReschedule.value = false
    fetchDetail()
  } catch (error) {
    alert("Gagal mengajukan jadwal baru.")
  }
}

const handleHapus = async () => {
  if(!confirm("Hapus ajuan ini?")) return
  try {
    const token = localStorage.getItem('token')
    await axios.delete(`http://localhost:8000/api/mahasiswa/ajuan/${idAjuan}`, {
        headers: { Authorization: `Bearer ${token}` }
    })
    alert("Ajuan dihapus.")
    router.push('/app/ajuan')
  } catch (error: any) { alert("Gagal menghapus.") }
}

const handleBack = () => router.back()
</script>

<template>
  <div v-if="isLoading" class="p-10 text-center">Memuat...</div>

  <div v-else-if="detailAjuan" class="grid grid-cols-1 gap-9 lg:grid-cols-2">
    <div class="flex flex-col gap-9">
      <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div class="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 class="font-medium text-black dark:text-white">Detail Ajuan</h3>
        </div>
        <div class="p-6.5">
          <div class="mb-6 flex items-center justify-between">
            <span class="text-sm text-slate-500">ID: #{{ detailAjuan.id_ajuan }}</span>
            <span :class="getBadgeClass(detailAjuan.status)">{{ detailAjuan.status }}</span>
          </div>
          <div class="mb-4.5"><label class="block font-semibold">Judul</label><p>{{ detailAjuan.judul_konseling }}</p></div>
          <div class="mb-4.5"><label class="block font-semibold">Jenis</label><p>{{ detailAjuan.jenis_layanan }}</p></div>
          <div class="mb-4.5"><label class="block font-semibold">Handler</label><p>{{ detailAjuan.handler?.nama_lengkap || 'Belum Ditentukan' }}</p></div>
          <div class="mb-4.5"><label class="block font-semibold">Deskripsi</label><p class="italic text-slate-600">"{{ detailAjuan.deskripsi_masalah }}"</p></div>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-9">
      <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div class="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 class="font-medium text-black dark:text-white">Status & Jadwal</h3>
        </div>
        <div class="p-6.5">

          <div v-if="detailAjuan.status === 'pending' || detailAjuan.status === 'pending wd3'" class="text-center py-4">
             <div class="bg-yellow-50 p-4 rounded mb-4 border border-yellow-200 text-yellow-800 text-sm">
                {{ detailAjuan.status === 'pending wd3' ? 'Menunggu respon Wakil Dekan 3.' : 'Menunggu respon Dosen.' }}
             </div>
             <p v-if="detailAjuan.tanggal_jadwal" class="text-sm text-gray-500">Jadwal diajukan:</p>
             <p v-if="detailAjuan.tanggal_jadwal" class="font-bold mb-6 text-lg">{{ detailAjuan.tanggal_jadwal }}</p>

             <div v-if="isMahasiswa" class="flex justify-center gap-3">
                <button @click="handleHapus" class="text-white bg-red-600 px-4 py-2 rounded text-sm hover:bg-red-700">Batalkan</button>
             </div>
          </div>

          <div v-else-if="detailAjuan.status === 'reschedule' || detailAjuan.status === 'reschedule wd3'" class="text-center py-4 flex flex-col gap-3">
             <div class="bg-purple-50 p-4 rounded mb-2 border border-purple-200 text-purple-800 text-sm">
                <p class="font-bold">Tawaran Jadwal Baru</p>
                <p>{{ detailAjuan.status.includes('wd3') ? 'WD3' : 'Dosen' }} menawarkan waktu baru.</p>
             </div>
             <p class="font-bold text-xl text-purple-700">{{ detailAjuan.tanggal_jadwal }}</p>

             <div v-if="isMahasiswa" class="flex flex-col gap-2 mt-2">
                <button @click="handleSetuju" class="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700">Setuju Jadwal Ini</button>
                <button @click="showModalReschedule = true" class="w-full border border-blue-600 text-blue-600 p-3 rounded hover:bg-blue-50">Ajukan Waktu Lain</button>
             </div>
          </div>

          <div v-else-if="detailAjuan.status === 'disetujui' || detailAjuan.status === 'disetujui wd3'" class="text-center py-4">
             <div class="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3 text-green-600">✓</div>
             <p class="font-bold text-green-600 mb-2">Jadwal Terkonfirmasi.</p>
             <p class="text-xl font-bold">{{ detailAjuan.tanggal_jadwal }}</p>
          </div>

          <div v-else class="text-center py-4">
             <p class="font-bold mb-2">{{ detailAjuan.status.toUpperCase() }}</p>
             <p v-if="detailAjuan.catatan_sesi" class="text-sm bg-gray-50 p-2 rounded text-left">Catatan: {{ detailAjuan.catatan_sesi }}</p>
             <p v-if="detailAjuan.alasan_penolakan" class="text-sm bg-red-50 p-2 rounded text-left text-red-700">Alasan: {{ detailAjuan.alasan_penolakan }}</p>
          </div>

          <button @click="handleBack" class="text-blue-600 font-medium hover:underline mt-6 block w-full">Kembali</button>
        </div>
      </div>
    </div>
    <ModalReschedule :isOpen="showModalReschedule" @close="showModalReschedule = false" @submit="onSubmitReschedule" />
  </div>
</template>
