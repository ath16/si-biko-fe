<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Breadcrumb from '@/components/common/PageBreadcrumb.vue'
import axios from 'axios'

const router = useRouter()
const route = useRoute()

// Deteksi Mode Edit berdasarkan parameter URL ID
const idAjuan = route.params.id
const isEditMode = computed(() => !!idAjuan)

const formData = ref({
  judul: '',
  kategori: '', // Mapping ke 'jenis_layanan'
  tanggal: '',
  waktu: '',
  deskripsi: '' // Mapping ke 'deskripsi_masalah'
})

const isSubmitting = ref(false)
const isLoading = ref(false)

// --- 1. LOAD DATA (JIKA EDIT MODE) ---
const fetchDetail = async () => {
  if (!isEditMode.value) return

  isLoading.value = true
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get(`http://localhost:8000/api/mahasiswa/ajuan/${idAjuan}`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    const data = response.data

    // Validasi Status: Hanya 'pending' yang boleh diedit
    if (data.status !== 'pending') {
      alert(`Ajuan dengan status "${data.status}" tidak dapat diubah.`)
      router.push('/app/ajuan')
      return
    }

    // Mapping Data Backend ke Form Frontend
    formData.value.judul = data.judul_konseling
    formData.value.kategori = data.jenis_layanan
    formData.value.deskripsi = data.deskripsi_masalah

    // Pecah '2025-12-20 09:00:00' menjadi Tanggal dan Waktu
    if (data.tanggal_jadwal) {
      const [datePart, timePart] = data.tanggal_jadwal.split(' ')
      formData.value.tanggal = datePart
      // Ambil HH:mm saja (5 karakter pertama) dari timePart
      formData.value.waktu = timePart ? timePart.substring(0, 5) : ''
    }

  } catch (error) {
    console.error("Gagal load data:", error)
    alert("Data tidak ditemukan atau terjadi kesalahan.")
    router.push('/app/ajuan')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchDetail()
})

// --- 2. SUBMIT DATA (CREATE / UPDATE) ---
const handleSubmit = async () => {
  // Validasi Frontend Sederhana
  if (!formData.value.judul || !formData.value.kategori || !formData.value.tanggal || !formData.value.waktu) {
    alert("Mohon lengkapi data wajib: Judul, Jenis Layanan, Tanggal, dan Waktu.")
    return
  }

  isSubmitting.value = true

  try {
    const token = localStorage.getItem('token')
    const config = { headers: { Authorization: `Bearer ${token}` } }

    // Persiapan Payload (Sesuai validasi AjuanController)
    const payload = {
      judul_konseling: formData.value.judul,
      jenis_layanan: formData.value.kategori,
      deskripsi_masalah: formData.value.deskripsi,
      // Gabungkan Tanggal & Waktu -> YYYY-MM-DD HH:mm
      tanggal_jadwal: `${formData.value.tanggal} ${formData.value.waktu}`
    }

    if (isEditMode.value) {
      // UPDATE
      await axios.put(`http://localhost:8000/api/mahasiswa/ajuan/${idAjuan}`, payload, config)
      alert("Perubahan berhasil disimpan!")
    } else {
      // CREATE
      await axios.post('http://localhost:8000/api/mahasiswa/ajuan', payload, config)
      alert("Ajuan berhasil dikirim! Menunggu konfirmasi Dosen.")
    }

    // Redirect kembali ke list
    router.push('/app/ajuan')

  } catch (error: any) {
    console.error("Submit error:", error)
    if (error.response) {
      // Tampilkan pesan error dari Backend (misal: validasi gagal)
      alert("Gagal: " + (error.response.data.message || "Terjadi kesalahan pada server."))
    } else {
      alert("Gagal terhubung ke server.")
    }
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => router.back()
</script>

<template>
  <div>
    <Breadcrumb :pageTitle="isEditMode ? 'Edit Ajuan Konseling' : 'Buat Ajuan Baru'" />

    <div v-if="isLoading" class="p-10 text-center text-slate-500">
      Memuat data formulir...
    </div>

    <div v-else class="grid grid-cols-1 gap-9 sm:grid-cols-2">
      <div class="flex flex-col gap-9">
        <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div class="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 class="font-medium text-black dark:text-white">
              {{ isEditMode ? 'Perbarui Data Ajuan' : 'Formulir Konseling' }}
            </h3>
          </div>

          <form @submit.prevent="handleSubmit">
            <div class="p-6.5">

              <div class="mb-4.5">
                <label class="mb-2.5 block text-black dark:text-white">
                  Judul / Topik Masalah <span class="text-meta-1">*</span>
                </label>
                <input
                  v-model="formData.judul"
                  type="text"
                  placeholder="Contoh: Kesulitan Akademik Semester 5"
                  class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-blue-600 dark:border-form-strokedark dark:bg-form-input dark:focus:border-blue-600"
                />
              </div>

              <div class="mb-4.5">
                <label class="mb-2.5 block text-black dark:text-white">
                  Jenis Permasalahan <span class="text-meta-1">*</span>
                </label>
                <div class="relative z-20 bg-transparent dark:bg-form-input">
                  <select
                    v-model="formData.kategori"
                    class="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-blue-600 dark:border-form-strokedark dark:bg-form-input dark:focus:border-blue-600 text-black dark:text-white"
                  >
                    <option value="" disabled>Pilih Kategori</option>
                    <option value="Akademik">Akademik (Nilai, KRS, Cuti)</option>
                    <option value="Pribadi">Pribadi (Keluarga, Ekonomi)</option>
                    <option value="Karir">Karir & Masa Depan</option>
                    <option value="Sosial">Sosial & Pergaulan</option>
                  </select>
                  <span class="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                    <svg class="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z" fill=""></path></svg>
                  </span>
                </div>
              </div>

              <div class="mb-4.5 flex flex-col gap-6 xl:flex-row">
                <div class="w-full xl:w-1/2">
                  <label class="mb-2.5 block text-black dark:text-white">
                    Tanggal Rencana <span class="text-meta-1">*</span>
                  </label>
                  <input
                    v-model="formData.tanggal"
                    type="date"
                    class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-blue-600 dark:border-form-strokedark dark:bg-form-input dark:focus:border-blue-600"
                  />
                </div>

                <div class="w-full xl:w-1/2">
                  <label class="mb-2.5 block text-black dark:text-white">
                    Jam <span class="text-meta-1">*</span>
                  </label>
                  <input
                    v-model="formData.waktu"
                    type="time"
                    class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-blue-600 dark:border-form-strokedark dark:bg-form-input dark:focus:border-blue-600"
                  />
                </div>
              </div>

              <div class="mb-6">
                <label class="mb-2.5 block text-black dark:text-white">
                  Deskripsi Masalah (Opsional)
                </label>
                <textarea
                  v-model="formData.deskripsi"
                  rows="6"
                  placeholder="Ceritakan sedikit tentang masalah yang ingin Anda konsultasikan..."
                  class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-blue-600 dark:border-form-strokedark dark:bg-form-input dark:focus:border-blue-600"
                ></textarea>
              </div>

              <div class="flex gap-4">
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="flex w-full justify-center rounded bg-blue-600 p-3 font-medium text-gray-100 hover:bg-blue-600/90 disabled:opacity-70 transition"
                >
                  {{ isSubmitting ? 'Memproses...' : (isEditMode ? 'Simpan Perubahan' : 'Kirim Ajuan') }}
                </button>
                <button
                  type="button"
                  @click="handleCancel"
                  class="flex w-full justify-center rounded border border-stroke p-3 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white transition"
                >
                  Batal
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>

      <div class="flex flex-col gap-9">
        <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div class="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
            <h3 class="font-medium text-black dark:text-white">
              Informasi Pengajuan
            </h3>
          </div>
          <div class="p-6.5">
            <ul class="list-disc pl-5 text-sm text-slate-500 space-y-3">
              <li>
                <b>Pilih Kategori:</b> Sistem akan otomatis mengarahkan ajuan Anda ke Dosen PA atau Konselor yang sesuai.
                <ul class="list-none pl-2 mt-1 text-xs space-y-1 border-l-2 border-slate-200">
                  <li><b>Akademik dan Karir:</b> Ditangani Dosen PA.</li>
                  <li><b>Pribadi dan Sosial:</b> Ditangani Dosen Konselor.</li>
                </ul>
              </li>
              <li>
                <b>Jadwal:</b> Jadwal yang Anda pilih bersifat <i>rencana</i>. Dosen dapat menyetujui atau mengajukan jadwal pengganti (Reschedule).
              </li>
              <li>
                <b>Kerahasiaan:</b> Semua data dan cerita yang Anda sampaikan dijamin kerahasiaannya.
              </li>
              <li v-if="isEditMode" class="text-blue-600 bg-blue-50 p-2 rounded border border-blue-100">
                <b>Catatan Edit:</b> Jika Anda mengubah jenis layanan, ajuan mungkin akan dialihkan ke pembimbing yang berbeda. Status ajuan akan tetap "Pending".
              </li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
