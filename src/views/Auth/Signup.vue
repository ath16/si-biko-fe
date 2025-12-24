<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const { login } = useAuth()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const handleSignup = () => {
  // Logic validasi sederhana
  if(password.value !== confirmPassword.value) {
    alert("Password tidak sama")
    return
  }
  // Simulasi sukses register -> Langsung login sebagai Mahasiswa
  login('mahasiswa')
}
</script>

<template>
  <div class="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
    <div class="flex flex-wrap items-center">

      <div class="hidden w-full xl:block xl:w-1/2">
        <div class="py-17.5 px-26 text-center">
          <RouterLink class="mb-5.5 inline-block" to="/">
            <h1 class="text-4xl font-extrabold text-white tracking-widest">SI-BIKO</h1>
          </RouterLink>
          <p class="font-medium 2xl:px-20 text-white">
            Pendaftaran Akun Baru Mahasiswa
          </p>
          <span class="mt-15 inline-block">
            <img src="/images/logo/auth-logo.svg" alt="Auth BG" class="h-40"/>
          </span>
        </div>
      </div>

      <div class="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
        <div class="w-full p-4 sm:p-12.5 xl:p-17.5">
          <span class="mb-1.5 block font-medium">Mulai Perjalanan Anda</span>
          <h2 class="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
            Daftar Akun SI-BIKO
          </h2>

          <form @submit.prevent="handleSignup">
            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white">Nama Lengkap</label>
              <input
                v-model="name"
                type="text"
                placeholder="Masukkan nama lengkap"
                class="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-blue-light-500 focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-blue-light-500/30 text-black dark:text-white"
              />
            </div>

            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white">Email Mahasiswa</label>
              <input
                v-model="email"
                type="email"
                placeholder="nama@student.unud.ac.id"
                class="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-blue-light-500 focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-blue-light-500/30 text-black dark:text-white"
              />
            </div>

            <div class="mb-4">
              <label class="mb-2.5 block font-medium text-black dark:text-white">Password</label>
              <input
                v-model="password"
                type="password"
                placeholder="Buat password"
                class="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-blue-light-500 focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-blue-light-500/30 text-black dark:text-white"
              />
            </div>

            <div class="mb-6">
              <label class="mb-2.5 block font-medium text-black dark:text-white">Ulangi Password</label>
              <input
                v-model="confirmPassword"
                type="password"
                placeholder="Ketik ulang password"
                class="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-blue-light-500 focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-blue-light-500/30 text-black dark:text-white"
              />
            </div>

            <div class="mb-5">
              <input
                type="submit"
                value="Buat Akun"
                class="w-full cursor-pointer rounded-lg border border-blue-light-500 bg-blue-600 p-4 font-medium text-white transition hover:bg-blue-600/90"
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
