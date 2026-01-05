<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
// Pastikan axios diimport (atau gunakan import api from '@/services/api')
import axios from 'axios'

const router = useRouter()

const form = ref({
  nim: '',
  nama_lengkap: '',
  email: '',
  prodi: '',
  no_hp: '',
  nip_dosen_pa: '',
  password: '',
  confirmPassword: ''
})

const isSubmitting = ref(false)
const errorMessage = ref('') // Tambahkan state untuk pesan error

const handleSignup = async () => {
  // 1. Reset Error
  errorMessage.value = ''

  // 2. Validasi Password
  if (form.value.password !== form.value.confirmPassword) {
    alert("Password dan Konfirmasi Password tidak sama!")
    return
  }

  // 3. Validasi Data Wajib
  if (!form.value.nim || !form.value.nama_lengkap || !form.value.prodi || !form.value.nip_dosen_pa) {
    alert("Mohon lengkapi semua data wajib!")
    return
  }

  isSubmitting.value = true

  try {
    // --- INTEGRASI REAL KE BACKEND ---
    const payload = {
      nim: form.value.nim,
      nama_lengkap: form.value.nama_lengkap,
      email: form.value.email,
      prodi: form.value.prodi,
      no_hp: form.value.no_hp,
      nip_dosen_pa: form.value.nip_dosen_pa,
      password: form.value.password
    }

    // Sesuaikan URL API Register Anda
    // Jika backend running di port 8000
    const response = await axios.post('http://localhost:8000/api/register', payload)

    console.log("Response Register:", response.data)

    alert("Registrasi Berhasil! Akun Anda telah dibuat. Silakan Login.")
    router.push('/auth/signin') // Redirect ke halaman login

  } catch (error: any) {
    console.error("Register Error:", error)

    // Menangkap pesan error dari backend (misal: NIM sudah ada, NIP Dosen salah)
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage.value = error.response.data.message
      alert("Gagal Mendaftar: " + errorMessage.value)
    } else {
      alert("Terjadi kesalahan sistem. Cek koneksi backend.")
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
    <div class="flex flex-wrap items-center">

      <div class="hidden w-full xl:block xl:w-1/2">
        <div class="py-17.5 px-26 text-center">
          <RouterLink class="mb-5.5 inline-block" to="/">
            <h1 class="text-4xl font-extrabold text-gray-900 tracking-widest">SI-BIKO</h1>
          </RouterLink>
          <p class="font-medium 2xl:px-20 text-gray-900">
            Sistem Informasi Bimbingan Konseling <br> Fakultas MIPA Universitas Udayana
          </p>
          <span class="mt-15 inline-block">
            <img src="/images/logo/fmipa-icon.png" alt="Auth BG" class="h-40"/>
          </span>
        </div>
      </div>

      <div class="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
        <div class="w-full p-4 sm:p-12.5 xl:p-17.5">
          <span class="mb-1.5 block font-medium">Bergabunglah Sekarang</span>
          <h2 class="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
            Registrasi Mahasiswa
          </h2>

          <form @submit.prevent="handleSignup">

            <div class="mb-4 flex flex-col gap-4 sm:flex-row">
              <div class="w-full sm:w-1/2">
                <label class="mb-2.5 block font-medium text-black dark:text-white">NIM <span class="text-red-500">*</span></label>
                <input
                  v-model="form.nim"
                  type="text"
                  placeholder="240xxxxx"
                  class="w-full rounded-lg border border-stroke bg-transparent py-3 px-5 outline-none focus:border-blue-600 dark:border-form-strokedark dark:bg-form-input"
                  required
                />
              </div>
              <div class="w-full sm:w-1/2">
                <label class="mb-2.5 block font-medium text-black dark:text-white">Nama Lengkap <span class="text-red-500">*</span></label>
                <input
                  v-model="form.nama_lengkap"
                  type="text"
                  placeholder="Nama sesuai KTM"
                  class="w-full rounded-lg border border-stroke bg-transparent py-3 px-5 outline-none focus:border-blue-600 dark:border-form-strokedark dark:bg-form-input"
                  required
                />
              </div>
            </div>

            <div class="mb-4 flex flex-col gap-4 sm:flex-row">
              <div class="w-full sm:w-1/2">
                <label class="mb-2.5 block font-medium text-black dark:text-white">Program Studi <span class="text-red-500">*</span></label>
                <div class="relative z-20 bg-transparent dark:bg-form-input">
                  <select v-model="form.prodi" class="relative z-20 w-full appearance-none rounded border border-stroke bg-transparent py-3 px-5 outline-none transition focus:border-blue-600 active:border-blue-600 dark:border-form-strokedark dark:bg-form-input" required>
                    <option value="" disabled selected>Pilih Prodi</option>
                    <option value="Informatika">Informatika</option>
                    <option value="Matematika">Matematika</option>
                    <option value="Fisika">Fisika</option>
                    <option value="Kimia">Kimia</option>
                    <option value="Biologi">Biologi</option>
                    <option value="Farmasi">Farmasi</option>
                  </select>
                  <span class="absolute top-1/2 right-4 z-30 -translate-y-1/2">
                    <svg class="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z" fill=""></path></svg>
                  </span>
                </div>
              </div>
              <div class="w-full sm:w-1/2">
                <label class="mb-2.5 block font-medium text-black dark:text-white">No. HP / WA <span class="text-red-500">*</span></label>
                <input
                  v-model="form.no_hp"
                  type="text"
                  placeholder="0812..."
                  class="w-full rounded-lg border border-stroke bg-transparent py-3 px-5 outline-none focus:border-blue-600 dark:border-form-strokedark dark:bg-form-input"
                  required
                />
              </div>
            </div>

            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white">Email <span class="text-red-500">*</span></label>
              <input
                v-model="form.email"
                type="email"
                placeholder="nama@student.unud.ac.id"
                class="w-full rounded-lg border border-stroke bg-transparent py-3 px-5 outline-none focus:border-blue-600 dark:border-form-strokedark dark:bg-form-input"
                required
              />
            </div>

            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white">NIP Dosen PA <span class="text-red-500">*</span></label>
              <input
                v-model="form.nip_dosen_pa"
                type="text"
                placeholder="Masukkan NIP Dosen Pembimbing Akademik"
                class="w-full rounded-lg border border-stroke bg-transparent py-3 px-5 outline-none focus:border-blue-600 dark:border-form-strokedark dark:bg-form-input"
                required
              />
              <p class="text-xs text-slate-500 mt-1">*Pastikan NIP Dosen PA benar agar data terhubung.</p>
            </div>

            <div class="mb-4 flex flex-col gap-4 sm:flex-row">
              <div class="w-full sm:w-1/2">
                <label class="mb-2.5 block font-medium text-black dark:text-white">Password <span class="text-red-500">*</span></label>
                <input
                  v-model="form.password"
                  type="password"
                  placeholder="Min. 6 karakter"
                  class="w-full rounded-lg border border-stroke bg-transparent py-3 px-5 outline-none focus:border-blue-600 dark:border-form-strokedark dark:bg-form-input"
                  required
                />
              </div>
              <div class="w-full sm:w-1/2">
                <label class="mb-2.5 block font-medium text-black dark:text-white">Ulangi Password</label>
                <input
                  v-model="form.confirmPassword"
                  type="password"
                  placeholder="Ketik ulang"
                  class="w-full rounded-lg border border-stroke bg-transparent py-3 px-5 outline-none focus:border-blue-600 dark:border-form-strokedark dark:bg-form-input"
                  required
                />
              </div>
            </div>

            <div class="mb-5">
              <input
                type="submit"
                :value="isSubmitting ? 'Memproses...' : 'Daftar Akun'"
                :disabled="isSubmitting"
                class="w-full cursor-pointer rounded-lg border border-blue-light-500 bg-blue-600 p-4 font-medium text-white transition hover:bg-blue-600/90 disabled:bg-blue-600/70"
              />
            </div>

            <div class="mt-6 text-center">
              <p class="font-medium">
                Sudah punya akun?
                <RouterLink to="/auth/signin" class="text-blue-600 hover:underline">Masuk Disini</RouterLink>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
