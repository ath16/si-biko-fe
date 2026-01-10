<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import ModalTolak from '@/components/business/ajuan/ModalTolak.vue'
import ModalReschedule from '@/components/business/ajuan/ModalReschedule.vue'

const route = useRoute()
const router = useRouter()
const idAjuan = route.params.id

const detailAjuan = ref<any>(null)
const isLoading = ref(true)
const catatanDosen = ref('')

const showModalTolak = ref(false)
const showModalReschedule = ref(false)

const fetchDetail = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get(`http://localhost:8000/api/staff/ajuan/${idAjuan}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    detailAjuan.value = response.data
    if(detailAjuan.value.catatan_dosen) {
        catatanDosen.value = detailAjuan.value.catatan_dosen
    }
  } catch (error) {
    alert("Data tidak ditemukan atau Anda tidak memiliki akses.")
    router.push('/app/ajuan')
  } finally {
    isLoading.value = false
  }
}
onMounted(() => fetchDetail())

const handleTerima = async () => {
  if(!confirm("Terima ajuan ini?")) return
  try {
    const token = localStorage.getItem('token')
    await axios.put(`http://localhost:8000/api/staff/ajuan/${idAjuan}/status`,
      { status: 'disetujui' },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    fetchDetail()
  } catch (error) { alert("Gagal update status") }
}

const onSubmitTolak = async (alasan: string) => {
  try {
    const token = localStorage.getItem('token')
    await axios.put(`http://localhost:8000/api/staff/ajuan/${idAjuan}/status`,
      { status: 'ditolak', alasan_penolakan: alasan },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    showModalTolak.value = false
    fetchDetail()
  } catch (error) { alert("Gagal menolak") }
}

const onSubmitReschedule = async (data: any) => {
  try {
    const token = localStorage.getItem('token')
    const dateTime = `${data.tanggal} ${data.waktu}`
    await axios.put(`http://localhost:8000/api/staff/ajuan/${idAjuan}/status`,
      { status: 'reschedule', tanggal_jadwal: dateTime },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    showModalReschedule.value = false
    fetchDetail()
  } catch (error) { alert("Gagal reschedule") }
}

const handleSelesai = async (tingkat: string) => {
  if(!catatanDosen.value) return alert("Mohon isi catatan sesi terlebih dahulu!")
  if(!confirm(tingkat === 'Fakultas' ? "Rujuk kasus ini ke WD3?" : "Selesaikan kasus ini?")) return

  try {
    const token = localStorage.getItem('token')
    await axios.put(`http://localhost:8000/api/staff/ajuan/${idAjuan}/complete`,
      {
        catatan_sesi: catatanDosen.value,
        tingkat_penanganan: tingkat
      },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    alert("Status berhasil diperbarui.")

    fetchDetail()
  } catch (error) { alert("Gagal menyelesaikan sesi") }
}
</script>

<template>
  <div v-if="isLoading" class="p-10 text-center">Memuat...</div>

  <div v-else class="grid grid-cols-1 gap-9 sm:grid-cols-2">
    <div class="flex flex-col gap-9">
      <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div class="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 class="font-medium text-black dark:text-white">Data Mahasiswa</h3>
        </div>
        <div class="p-6.5 flex flex-col gap-4">
           <div class="flex items-center gap-4 mb-4">
            <div class="h-14 w-14 rounded-full overflow-hidden bg-gray-200">
              <img :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(detailAjuan.mahasiswa?.nama_lengkap || 'M')}&background=random`" alt="User" />
            </div>
            <div>
              <h4 class="font-bold text-black dark:text-white">{{ detailAjuan.mahasiswa?.nama_lengkap }}</h4>
              <p class="text-sm">NIM: {{ detailAjuan.nim }}</p>
              <p class="text-sm text-gray-500">{{ detailAjuan.mahasiswa?.prodi }}</p>
            </div>
          </div>
          <div class="bg-gray-50 p-4 rounded border border-gray-100">
             <p class="text-xs font-bold text-gray-500 mb-1">MASALAH:</p>
             <p class="text-sm italic">"{{ detailAjuan.deskripsi_masalah }}"</p>
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

          <div v-if="detailAjuan.status === 'pending'" class="flex flex-col gap-4">
            <div class="bg-blue-50 text-blue-800 p-3 rounded text-sm mb-2 border border-blue-100">
              Jadwal yang diminta: <b>{{ detailAjuan.tanggal_jadwal }}</b>
            </div>
            <button @click="handleTerima" class="flex justify-center rounded bg-blue-600 p-3 font-medium text-gray-100 hover:bg-blue-600/90 w-full">Terima & Mulai Konseling</button>
            <div class="grid grid-cols-2 gap-4">
              <button @click="showModalReschedule = true" class="flex justify-center rounded border border-yellow-300 text-yellow-600 p-3 font-medium hover:bg-yellow-600 hover:text-white transition">Reschedule</button>
              <button @click="showModalTolak = true" class="flex justify-center rounded border border-red-300 text-red-600 p-3 font-medium hover:bg-red-600 hover:text-white transition">Tolak</button>
            </div>
          </div>

          <div v-else-if="detailAjuan.status === 'disetujui' || detailAjuan.status === 'reschedule'" class="flex flex-col gap-4">
             <div class="bg-green-50 p-3 rounded text-green-800 border border-green-100 text-sm mb-2">
                 Sesi Konseling Aktif / Terjadwal.
             </div>

             <label class="block text-sm font-medium">Catatan Sesi / Hasil Konseling</label>
             <textarea v-model="catatanDosen" rows="4" class="w-full border p-3 rounded outline-none focus:border-blue-500" placeholder="Tulis hasil konseling disini..."></textarea>

             <div class="flex flex-col gap-2 mt-2">
                <button @click="handleSelesai('Prodi')" class="bg-green-600 text-white p-3 rounded font-medium hover:bg-green-700">Masalah Selesai</button>
                <button @click="handleSelesai('Fakultas')" class="bg-purple-600 text-white p-3 rounded font-medium hover:bg-purple-700">Rujuk ke WD3 (Fakultas)</button>
             </div>
          </div>

          <div v-else class="text-center p-6 bg-gray-50 rounded border border-gray-100">
            <div v-if="detailAjuan.tingkat_penanganan === 'Fakultas' || detailAjuan.status.includes('wd3') || detailAjuan.status === 'rujuk universitas'" class="mb-4">
                <h3 class="font-bold text-purple-600">Dirujuk ke Fakultas</h3>
                <p class="text-xs text-gray-500 mt-1">Anda telah melimpahkan kasus ini ke WD3.</p>
                <span class="inline-block mt-2 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">Status WD3: {{ detailAjuan.status }}</span>
            </div>

            <div v-else-if="detailAjuan.status === 'selesai'" class="mb-4">
                <h3 class="font-bold text-green-600">Selesai di Prodi</h3>
                <p class="text-xs text-gray-500 mt-1">Anda telah menyelesaikan kasus ini.</p>
            </div>

            <div v-else-if="detailAjuan.status === 'ditolak'" class="mb-4">
                <h3 class="font-bold text-red-600">Ditolak</h3>
            </div>

            <div class="text-left mt-4 border-t pt-4 mb-4">
              <p class="text-xs font-bold text-gray-500 mb-1">CATATAN ANDA:</p>
              <div class="text-sm bg-white p-3 border rounded text-gray-700">
                {{ detailAjuan.catatan_dosen || '-' }}
              </div>
            </div>

            <div v-if="detailAjuan.catatan_wd3" class="text-left mt-4 border-t pt-4 border-purple-200 bg-purple-50 p-4 rounded">
              <p class="text-xs font-bold text-purple-700 mb-1">CATATAN DARI WD3:</p>
              <p class="text-sm text-gray-800">{{ detailAjuan.catatan_wd3 }}</p>
            </div>

            <RouterLink to="/app/ajuan" class="text-blue-600 underline mt-6 block font-medium">Kembali ke Daftar</RouterLink>
          </div>

        </div>
      </div>
    </div>

    <ModalTolak :isOpen="showModalTolak" @close="showModalTolak = false" @submit="onSubmitTolak" />
    <ModalReschedule :isOpen="showModalReschedule" @close="showModalReschedule = false" @submit="onSubmitReschedule" />
  </div>
</template>
