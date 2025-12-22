<script setup lang="ts">
import { ref } from 'vue'
import AuthLayout from "@/components/layout/AuthLayout.vue"
import InputGroup from "@/components/forms/FormElements/InputGroup.vue"
import { RouterLink } from 'vue-router'

const form = ref({
  namaLengkap: '',
  nim: '',
  prodi: '',
  email: '',
  noHp: '',
  password: '',
  confirmPassword: ''
})

// Data Dummy Prodi (Nanti bisa diambil dari API)
const prodiOptions = ref([
  { value: 'KI', label: 'Kimia' },
  { value: 'FI', label: 'Fisika' },
  { value: 'BIO', label: 'Biologi' },
  { value: 'MTK', label: 'Matematika' },
  { value: 'FARM', label: 'Farmasi' },
  { value: 'IF', label: 'Informatika' }
])

const handleSignUp = () => {
  // TODO: Validasi password match dll.
  console.log('Form Data Registered:', form.value)
  // Panggil API register di sini nanti
}
</script>

<template>
  <AuthLayout>
    <div class="mb-10 text-center">
      <h2 class="mb-2 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
        Daftar Akun Mahasiswa
      </h2>
      <p class="font-medium text-bodydark2">Lengkapi data diri Anda untuk mengakses SI-BIKO</p>
    </div>

    <form @submit.prevent="handleSignUp">
      <div class="mb-4">
        <InputGroup
          label="Nama Lengkap"
          type="text"
          placeholder="Masukkan nama lengkap sesuai KTM"
          v-model="form.namaLengkap"
          customClasses="mb-4"
          required
        />

        <InputGroup
          label="NIM"
          type="text"
          placeholder="Nomor Induk Mahasiswa"
          v-model="form.nim"
          customClasses="mb-4"
          required
        />

        <div class="mb-4">
          <label class="mb-2.5 block font-medium text-black dark:text-white"> Program Studi </label>
          <div class="relative z-20 bg-transparent dark:bg-form-input">
            <select
              v-model="form.prodi"
              class="relative z-20 w-full appearance-none rounded-lg border border-stroke bg-transparent py-4 px-5 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              required
            >
              <option value="" disabled selected>Pilih Program Studi</option>
              <option v-for="option in prodiOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
            <span class="absolute top-1/2 right-4 z-30 -translate-y-1/2">
              <svg
                class="fill-current"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                  fill=""
                ></path>
              </svg>
            </span>
          </div>
        </div>

        <InputGroup
          label="Email Kampus"
          type="email"
          placeholder="Contoh: @student.unud.ac.id"
          v-model="form.email"
          customClasses="mb-4"
          required
        />

        <InputGroup
          label="Nomor HP/WhatsApp"
          type="tel"
          placeholder="08xxxxxxxxxx"
          v-model="form.noHp"
          customClasses="mb-4"
          required
        />

        <InputGroup
          label="Password"
          type="password"
          placeholder="Buat password yang kuat"
          v-model="form.password"
          customClasses="mb-4"
          required
        />

        <InputGroup
          label="Konfirmasi Password"
          type="password"
          placeholder="Ulangi password"
          v-model="form.confirmPassword"
          customClasses="mb-6"
          required
        />

        <button
          type="submit"
          class="w-full cursor-pointer rounded-lg border border-white bg-blue-600 hover:bg-blue-700 p-4 text-white transition hover:bg-opacity-90"
        >
          Daftar Sekarang
        </button>

        <div class="mt-6 text-center font-medium text-bodydark2">
          Sudah punya akun?
          <RouterLink to="/auth/signin" class="text-blue-600">Masuk di sini</RouterLink>
        </div>
      </div>
    </form>
  </AuthLayout>
</template>
