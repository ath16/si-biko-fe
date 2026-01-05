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
    if(detailAjuan.value.catatan_sesi) catatanWD3.value = detailAjuan.value.catatan_sesi
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

// --- PERBAIKAN: Tambahkan Fungsi Cetak ---
const handleCetak = () => {
   router.push(`/print/surat-rujukan/${idAjuan}`)
}
</script>

<template>
  <div v-if="isLoading" class="p-10 text-center">Memuat...</div>
  <div v-else class="grid grid-cols-1 gap-9 sm:grid-cols-2">
    <div class="flex flex-col gap-9">
      <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div class="p-6.5 flex flex-col gap-4">
          <h3 class="font-bold text-black">Info Rujukan</h3>
          <p class="text-sm"><b>Dari Dosen:</b> {{ detailAjuan.handler?.nama_lengkap }}</p>
          <p class="text-sm"><b>Masalah:</b> "{{ detailAjuan.deskripsi_masalah }}"</p>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-9">
      <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div class="p-6.5">

           <div v-if="detailAjuan.status === 'pending wd3' && !detailAjuan.tanggal_jadwal" class="flex flex-col gap-3">
             <div class="bg-red-50 p-3 rounded text-sm text-red-800 border border-red-200 mb-2">
                Jadwal Belum Ditentukan.
             </div>
             <button @click="handleSetJadwal" class="w-full bg-blue-600 text-white p-3 rounded font-medium hover:bg-blue-700">
                 Atur Jadwal Pertemuan
             </button>
           </div>

           <div v-else-if="detailAjuan.status === 'reschedule wd3'" class="text-center py-4">
              <p class="font-bold text-purple-600">Menunggu Konfirmasi Mahasiswa</p>
              <p class="text-sm text-gray-500 mb-4">Jadwal ditawarkan: {{ detailAjuan.tanggal_jadwal }}</p>
              <button @click="handleSetJadwal" class="text-sm text-blue-600 hover:underline">Ubah Jadwal</button>
           </div>

           <div v-else-if="detailAjuan.status === 'disetujui wd3'" class="flex flex-col gap-4">
             <div class="bg-green-50 p-3 rounded text-green-800 border border-green-200 mb-2">
                 Jadwal Fix: <strong>{{ detailAjuan.tanggal_jadwal }}</strong>
             </div>
             <textarea v-model="catatanWD3" rows="4" placeholder="Catatan hasil pertemuan..." class="w-full border p-3 rounded outline-none"></textarea>
             <div class="flex flex-col gap-3">
               <button @click="handleSelesai('Fakultas')" class="bg-green-600 text-white p-3 rounded">Masalah Selesai</button>
               <button @click="handleSelesai('Universitas')" class="bg-purple-600 text-white p-3 rounded">Rujuk ke Universitas</button>
             </div>
           </div>

           <div v-else class="text-center p-6 bg-gray-50 rounded border border-gray-100">

             <div v-if="detailAjuan.tingkat_penanganan === 'Universitas'">
                 <h3 class="font-bold text-purple-600 text-lg mb-2">Dirujuk ke Universitas</h3>
                 <p class="text-sm text-gray-500 mb-4">Surat rujukan telah dibuat.</p>
                 <button @click="handleCetak" class="bg-gray-800 text-white px-4 py-2 rounded flex items-center justify-center gap-2 mx-auto hover:bg-gray-900 transition">
                    Cetak Surat Rujukan
                 </button>
             </div>

             <div v-else>
                  <h3 class="text-green-600 font-bold text-lg">Masalah Selesai</h3>
                  <p class="text-sm text-gray-500">Penanganan kasus ditutup di tingkat Fakultas.</p>
             </div>

             <button @click="router.push('/app/ajuan')" class="text-blue-600 font-medium hover:underline mt-6 block w-full">Kembali</button>
           </div>

        </div>
      </div>
    </div>
    <ModalReschedule :isOpen="showModalReschedule" @close="showModalReschedule = false" @submit="onSubmitReschedule" />
  </div>
</template>
