<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import axios from 'axios' // Pastikan axios sudah terinstall

const router = useRouter()
const { setUser } = useAuth() // Asumsikan useAuth punya method setUser atau login yang fleksibel

const username = ref('')
const password = ref('')
const error = ref('')
const isSubmitting = ref(false)

const handleLogin = async () => {
  error.value = ''

  if (!username.value || !password.value) {
    error.value = 'Mohon isi username dan password.'
    return
  }

  isSubmitting.value = true

  try {
    // --- INTEGRASI BACKEND REAL ---
    // Sesuaikan URL dengan backend Anda (biasanya http://localhost:8000/api/login)
    const response = await axios.post('http://localhost:8000/api/login', {
      username: username.value,
      password: password.value
    })

    const { token, user } = response.data

    // 1. Simpan Token
    localStorage.setItem('token', token)

    // 2. Simpan User Data (agar bisa dibaca komponen lain)
    localStorage.setItem('user', JSON.stringify(user))

    // 3. Update State Global (Composable)
    // Jika useAuth Anda belum support setUser manual, Anda bisa modifikasi composable-nya nanti.
    // Untuk saat ini kita simpan di localStorage dan redirect.
    if(setUser) setUser(user)

    // 4. Redirect Sesuai Role (Logic Backend sudah handle role, kita tinggal baca)
    // Backend mengirim 'role' di dalam objek user
    router.push('/app/dashboard')

  } catch (err: any) {
    if (err.response && err.response.status === 401) {
      error.value = 'Username atau Password salah.'
    } else {
      error.value = 'Gagal terhubung ke server. Cek koneksi backend.'
    }
    console.error("Login Error:", err)
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
          <span class="mb-1.5 block font-medium">Selamat Datang Kembali</span>
          <h2 class="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
            Masuk ke Akun Anda
          </h2>

          <form @submit.prevent="handleLogin">

            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white">Username / NIM / NIP</label>
              <div class="relative">
                <input
                  v-model="username"
                  type="text"
                  placeholder="Masukkan username"
                  class="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-blue-light-500 focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-blue-light-500/30 text-black dark:text-white"
                />
                <span class="absolute right-4 top-4">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.1601 10.87C12.0601 10.86 11.9401 10.86 11.8301 10.87C9.45006 10.79 7.56006 8.84 7.56006 6.44C7.56006 3.99 9.54006 2 12.0001 2C14.4501 2 16.4401 3.99 16.4401 6.44C16.4301 8.84 14.5401 10.79 12.1601 10.87Z" stroke="#64748B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M7.15997 14.56C4.73997 16.18 4.73997 18.82 7.15997 20.43C9.90997 22.27 14.42 22.27 17.17 20.43C19.59 18.81 19.59 16.17 17.17 14.56C14.43 12.73 9.91997 12.73 7.15997 14.56Z" stroke="#64748B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </span>
              </div>
            </div>

            <div class="mb-6">
              <label class="mb-2.5 block font-medium text-black dark:text-white">Password</label>
              <div class="relative">
                <input
                  v-model="password"
                  type="password"
                  placeholder="Masukkan password"
                  class="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-blue-light-500 focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-blue-light-500/30 text-black dark:text-white"
                />
                <span class="absolute right-4 top-4">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 10V8C6 4.69 7 2 12 2C17 2 18 4.69 18 8V10" stroke="#64748B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 18.5C13.3807 18.5 14.5 17.3807 14.5 16C14.5 14.6193 13.3807 13.5 12 13.5C10.6193 13.5 9.5 14.6193 9.5 16C9.5 17.3807 10.6193 18.5 12 18.5Z" stroke="#64748B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M17 22H7C3 22 2 21 2 17V15C2 11 3 10 7 10H17C21 10 22 11 22 15V17C22 21 21 22 17 22Z" stroke="#64748B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </span>
              </div>
            </div>

            <div v-if="error" class="mb-5 text-red-500 text-sm font-medium bg-red-50 p-3 rounded border border-red-200">
              {{ error }}
            </div>

            <div class="mb-5">
              <input
                type="submit"
                :value="isSubmitting ? 'Memproses...' : 'Masuk Sekarang'"
                :disabled="isSubmitting"
                class="w-full cursor-pointer rounded-lg border border-blue-light-500 bg-blue-600 p-4 font-medium text-white transition hover:bg-blue-600/90 disabled:opacity-70 disabled:cursor-not-allowed"
              />
            </div>

            <div class="mt-6 text-center">
              <p class="font-medium">
                Belum punya akun?
                <RouterLink to="/auth/signup" class="text-blue-600 hover:underline">Daftar (Khusus Mahasiswa)</RouterLink>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
