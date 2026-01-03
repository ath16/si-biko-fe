<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Breadcrumb from '@/components/common/PageBreadcrumb.vue'

const router = useRouter()
const route = useRoute()

// Deteksi Mode Edit
const isEditMode = computed(() => route.name === 'edit-ajuan' || !!route.params.id)

const formData = ref({
  judul: '',
  kategori: '',
  dosenId: '',
  tanggal: '',
  waktu: '',
  deskripsi: ''
})

const isSubmitting = ref(false)

// Data Dummy Dosen
const listDosen = [
  { id: '198001', nama: 'Dr. Budi Santoso (PA)' },
  { id: '198002', nama: 'Prof. Made (Kaprodi)' },
  { id: 'K001', nama: 'Ibu Ratna, M.Psi (Konselor)' },
]

// Load Data jika Edit Mode
onMounted(() => {
  if (isEditMode.value) {
    // Simulasi Fetch Data dari API berdasarkan ID
    // const ajuanId = route.params.id
    // const data = await api.getAjuan(ajuanId)

    // Kita isi dummy data untuk simulasi
    formData.value = {
      judul: 'Konsultasi KRS Semester 5',
      kategori: 'Akademik',
      dosenId: '198001',
      tanggal: '2025-12-20',
      waktu: '09:00',
      deskripsi: 'Saya bingung memilih mata kuliah pilihan yang sesuai dengan skripsi saya nanti.'
    }
  }
})

// Fungsi Submit (Create / Update)
const handleSubmit = () => {
  if (!formData.value.judul || !formData.value.dosenId || !formData.value.tanggal) {
    alert("Mohon lengkapi semua data wajib!")
    return
  }

  isSubmitting.value = true

  // Simulasi API Call
  setTimeout(() => {
    const pesan = isEditMode.value
      ? "Perubahan berhasil disimpan!"
      : "Ajuan berhasil dikirim! Menunggu persetujuan Dosen."

    alert(pesan)
    isSubmitting.value = false
    router.push('/app/ajuan')
  }, 1000)
}

const handleCancel = () => router.back()
</script>

<template>
  <div>
    <Breadcrumb :pageTitle="isEditMode ? 'Edit Ajuan Konseling' : 'Buat Ajuan Baru'" />

    <div class="grid grid-cols-1 gap-9 sm:grid-cols-2">
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
                  class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-blue-light-500 active:border-blue-light-500 dark:border-form-strokedark dark:bg-form-input dark:focus:border-blue-light-500"
                />
              </div>

              <div class="mb-4.5">
                <label class="mb-2.5 block text-black dark:text-white">
                  Jenis Permasalahan <span class="text-meta-1">*</span>
                </label>
                <div class="relative z-20 bg-transparent dark:bg-form-input">
                  <select
                    v-model="formData.kategori"
                    class="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-blue-light-500 active:border-blue-light-500 dark:border-form-strokedark dark:bg-form-input dark:focus:border-blue-light-500"
                  >
                    <option value="" disabled selected>Pilih Kategori</option>
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

              <div class="mb-4.5">
                <label class="mb-2.5 block text-black dark:text-white">
                  Tujuan Konseling (Dosen/Konselor) <span class="text-meta-1">*</span>
                </label>
                <div class="relative z-20 bg-transparent dark:bg-form-input">
                  <select
                    v-model="formData.dosenId"
                    class="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-blue-light-500 active:border-blue-light-500 dark:border-form-strokedark dark:bg-form-input dark:focus:border-blue-light-500"
                  >
                    <option value="" disabled selected>Pilih Dosen Pembimbing</option>
                    <option v-for="dosen in listDosen" :key="dosen.id" :value="dosen.id">
                      {{ dosen.nama }}
                    </option>
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
                    class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-blue-light-500 active:border-blue-light-500 dark:border-form-strokedark dark:bg-form-input dark:focus:border-blue-light-500"
                  />
                </div>

                <div class="w-full xl:w-1/2">
                  <label class="mb-2.5 block text-black dark:text-white">
                    Jam <span class="text-meta-1">*</span>
                  </label>
                  <input
                    v-model="formData.waktu"
                    type="time"
                    class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-blue-light-500 active:border-blue-light-500 dark:border-form-strokedark dark:bg-form-input dark:focus:border-blue-light-500"
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
                  class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-blue-light-500 active:border-blue-light-500 dark:border-form-strokedark dark:bg-form-input dark:focus:border-blue-light-500"
                ></textarea>
              </div>

              <div class="flex gap-4">
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="flex w-full justify-center rounded bg-blue-600 p-3 font-medium text-gray-100 hover:bg-blue-600/90 disabled:opacity-70"
                >
                  {{ isSubmitting ? 'Memproses...' : (isEditMode ? 'Simpan Perubahan' : 'Kirim Ajuan') }}
                </button>
                <button
                  type="button"
                  @click="handleCancel"
                  class="flex w-full justify-center rounded border border-stroke p-3 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
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
              Tips Pengajuan
            </h3>
          </div>
          <div class="p-6.5">
            <ul class="list-disc pl-5 text-sm text-slate-500 space-y-2">
              <li>Pilih kategori yang paling sesuai dengan masalah Anda.</li>
              <li>Dosen Pembimbing Akademik (PA) adalah prioritas utama untuk masalah akademik.</li>
              <li>Jadwal yang Anda ajukan bersifat <b>Pengajuan</b>, Dosen berhak mengajukan jadwal pengganti (Reschedule).</li>
              <li v-if="isEditMode" class="text-blue-600">
                <b>Catatan Edit:</b> Mengubah jadwal akan membuat status ajuan kembali menjadi "Pending" menunggu persetujuan ulang.
              </li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
