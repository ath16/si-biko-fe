<script setup lang="ts">
import { ref } from 'vue'
import AuthLayout from "@/components/layout/AuthLayout.vue"
import InputGroup from "@/components/forms/FormElements/InputGroup.vue"
import { RouterLink } from 'vue-router'

const form = ref({
  email: '',
  password: ''
})

const handleSignIn = () => {
  // TODO: Validasi password match dll.
  console.log('Form Data Loged In:', form.value)
  // Panggil API login di sini nanti
}
</script>

<template>
  <AuthLayout>
    <div class="mb-10 text-center">
      <h2 class="mb-2 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
        Masuk
      </h2>
      <p class="font-medium text-bodydark2">Masukkan data Anda untuk masuk ke SI-BIKO</p>
    </div>

    <form @submit.prevent="handleSignIn">
      <div class="mb-4">
        <InputGroup
          label="Email"
          type="email"
          placeholder="Contoh: @student.unud.ac.id"
          v-model="form.email"
          customClasses="mb-4"
          required
        />

        <InputGroup
          label="Password"
          type="password"
          placeholder="Masukkan password"
          v-model="form.password"
          customClasses="mb-4"
          required
        />

        <button
          type="submit"
          class="w-full cursor-pointer rounded-lg border border-white bg-blue-600 hover:bg-blue-700 p-4 text-white transition hover:bg-opacity-90"
        >
          Daftar Sekarang
        </button>

        <div class="mt-6 text-center font-medium text-bodydark2">
          Belum punya akun?
          <RouterLink to="/auth/signup" class="text-blue-600">Daftar di sini</RouterLink>
        </div>
      </div>
    </form>
  </AuthLayout>
</template>
