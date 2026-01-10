<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import ModalReschedule from '@/components/business/ajuan/ModalReschedule.vue'

const router = useRouter()
const route = useRoute()
const idAjuan = route.params.id

const detailAjuan = ref<any>(null)
const isLoading = ref(true)
const catatanWD3 = ref('')
const showModalReschedule = ref(false)

const fetchDetail = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get(`http://localhost:8000/api/wd3/ajuan/${idAjuan}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    detailAjuan.value = response.data

    if(detailAjuan.value.catatan_wd3) catatanWD3.value = detailAjuan.value.catatan_wd3
  } catch (error) { console.error(error); isLoading.value = false }
  finally { isLoading.value = false }
}
onMounted(() => fetchDetail())

const handleSetJadwal = () => showModalReschedule.value = true

const onSubmitReschedule = async (data: any) => {
  try {
    const token = localStorage.getItem('token')
    const dateTime = `${data.tanggal} ${data.waktu}`
    await axios.put(`http://localhost:8000/api/wd3/ajuan/${idAjuan}/jadwal`,
      { tanggal_jadwal: dateTime },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    alert("Jadwal ditawarkan ke mahasiswa.")
    showModalReschedule.value = false
    fetchDetail()
  } catch (error) { alert("Gagal set jadwal") }
}

const handleSelesai = async (tingkat: string) => {
  if(!catatanWD3.value) return alert("Catatan wajib diisi!")

  const message = tingkat === 'Universitas'
    ? "Rujuk kasus ini ke Universitas dan buat surat rujukan?"
    : "Tandai kasus ini sebagai Selesai di Fakultas?";

  if(!confirm(message)) return

  try {
    const token = localStorage.getItem('token')
    await axios.put(`http://localhost:8000/api/wd3/ajuan/${idAjuan}/complete`,
      {
        catatan_sesi: catatanWD3.value,
        tingkat_penanganan: tingkat
      },
      { headers: { Authorization: `Bearer ${token}` } }
    )

    if (tingkat === 'Universitas') {
      alert("Berhasil dirujuk. Mengalihkan ke halaman cetak surat...")
      router.push(`/print/surat-rujukan/${idAjuan}`)
    } else {
      alert("Status berhasil diperbarui: Masalah Selesai.")
      fetchDetail()
    }
  } catch (error) {
    console.error(error)
    alert("Gagal update status")
  }
}

const handleCetak = () => {
   router.push(`/print/surat-rujukan/${idAjuan}`)
}
</script>

<template>
  <div v-if="isLoading" class="p-10 text-center">Memuat...</div>
  <div v-else class="grid grid-cols-1 gap-9 sm:grid-cols-2">

    <div class="flex flex-col gap-9">
      <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div class="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 class="font-medium text-black dark:text-white">Info Rujukan</h3>
        </div>
        <div class="p-6.5 flex flex-col gap-4">

          <div class="flex items-center gap-4 mb-4 pb-4 border-b border-stroke dark:border-strokedark">
            <div class="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-500">
               {{ detailAjuan.mahasiswa?.nama_lengkap?.charAt(0) || 'M' }}
            </div>
            <div>
              <h4 class="font-bold text-black dark:text-white">{{ detailAjuan.mahasiswa?.nama_lengkap }}</h4>
              <p class="text-sm">NIM: {{ detailAjuan.nim }}</p>
              <p class="text-sm text-gray-500">{{ detailAjuan.mahasiswa?.prodi }}</p>
            </div>
          </div>

          <p class="text-sm"><b>Dari Dosen:</b> {{ detailAjuan.handler?.nama_lengkap }}</p>
          <p class="text-sm"><b>Masalah:</b> "{{ detailAjuan.deskripsi_masalah }}"</p>

          <div v-if="detailAjuan.catatan_dosen" class="bg-gray-100 p-3 rounded border border-gray-200 mt-2">
            <p class="text-xs font-bold text-gray-500 mb-1">CATATAN DOSEN:</p>
            <p class="text-sm italic text-gray-700">"{{ detailAjuan.catatan_dosen }}"</p>
          </div>

        </div>
      </div>
    </div>

    <div class="flex flex-col gap-9">
      <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div class="border-b border-stroke py-4 px-6.5 dark:border-strokedark bg-gray-50 dark:bg-meta-4">
          <h3 class="font-bold text-black dark:text-white">Tindakan WD3</h3>
        </div>
        <div class="p-6.5">

          <div v-if="detailAjuan.status === 'pending wd3' && !detailAjuan.tanggal_jadwal" class="flex flex-col gap-3">
            <div class="bg-red-50 p-3 rounded text-sm text-red-800 border border-red-200 mb-2">
              Jadwal Belum Ditentukan.
            </div>
            <button @click="handleSetJadwal" class="w-full bg-blue-600 text-white p-3 rounded font-medium hover:bg-blue-700 transition">
              Atur Jadwal Pertemuan
            </button>
          </div>

          <div v-else-if="detailAjuan.status === 'reschedule wd3'" class="text-center py-4">
            <p class="font-bold text-purple-600">Menunggu Konfirmasi Mahasiswa</p>
            <p class="text-sm text-gray-500 mb-4">Jadwal ditawarkan: <strong>{{ detailAjuan.tanggal_jadwal }}</strong></p>
            <button @click="handleSetJadwal" class="text-sm text-blue-600 hover:underline">Ubah Jadwal</button>
          </div>

          <div v-else-if="detailAjuan.status === 'disetujui wd3'" class="flex flex-col gap-4">
            <div class="bg-green-50 p-3 rounded text-green-800 border border-green-200 mb-2 text-sm">
              Jadwal Fix: <strong>{{ detailAjuan.tanggal_jadwal }}</strong>
            </div>

            <label class="block text-sm font-medium">Catatan Penanganan / Hasil</label>
            <textarea v-model="catatanWD3" rows="4" placeholder="Tulis hasil penanganan atau alasan rujukan..." class="w-full border p-3 rounded outline-none focus:border-blue-500"></textarea>

            <div class="flex flex-col gap-3 mt-2">
              <button @click="handleSelesai('Fakultas')" class="bg-green-600 text-white p-3 rounded font-medium hover:bg-green-700 transition">Masalah Selesai</button>
              <button @click="handleSelesai('Universitas')" class="bg-purple-600 text-white p-3 rounded font-medium hover:bg-purple-700 transition">Rujuk ke Universitas</button>
            </div>
          </div>

          <div v-else class="text-center p-6 bg-gray-50 rounded border border-gray-100">

            <div v-if="detailAjuan.tingkat_penanganan === 'Universitas'">
              <h3 class="font-bold text-purple-600 text-lg mb-2">Dirujuk ke Universitas</h3>
              <p class="text-sm text-gray-500 mb-4">Surat rujukan telah dibuat.</p>

              <div class="text-left bg-white p-3 border rounded mb-4">
                <p class="text-xs font-bold text-gray-500 mb-1">CATATAN ANDA:</p>
                <p class="text-sm text-gray-700">{{ detailAjuan.catatan_wd3 }}</p>
              </div>

              <button @click="handleCetak" class="bg-gray-800 text-white px-4 py-2 rounded flex items-center justify-center gap-2 mx-auto hover:bg-gray-900 transition text-sm">
                Cetak Surat Rujukan
              </button>
            </div>

            <div v-else>
              <h3 class="text-green-600 font-bold text-lg mb-2">Masalah Selesai</h3>
              <p class="text-sm text-gray-500 mb-4">Penanganan kasus ditutup di tingkat Fakultas.</p>

              <div class="text-left bg-white p-3 border rounded">
                <p class="text-xs font-bold text-gray-500 mb-1">CATATAN ANDA:</p>
                <p class="text-sm text-gray-700">{{ detailAjuan.catatan_wd3 }}</p>
              </div>
            </div>

            <button @click="router.push('/app/ajuan')" class="text-blue-600 font-medium hover:underline mt-6 block w-full text-sm">← Kembali ke Daftar</button>
          </div>

        </div>
      </div>
    </div>

    <ModalReschedule :isOpen="showModalReschedule" @close="showModalReschedule = false" @submit="onSubmitReschedule" />
  </div>
</template>
