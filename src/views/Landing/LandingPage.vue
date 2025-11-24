<script setup lang="ts">

</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-boxdark-2 text-gray-900 dark:text-white">

    <header class="w-full py-6 px-8 flex justify-between items-center bg-white dark:bg-boxdark shadow-sm">
      <div class="text-2xl font-bold text-primary">
        SI-BIKO
      </div>
      <nav>
        <router-link
          to="/auth/signin"
          class="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
        >
          Login
        </router-link>
      </nav>
    </header>

    <main class="flex-grow flex flex-col items-center justify-center text-center px-4">
      <h1 class="text-4xl md:text-6xl font-extrabold mb-6">
        Sistem Informasi <br />
        <span class="text-blue-600">Bimbingan Konseling</span>
      </h1>
      <p class="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl">
        Platform terpadu untuk layanan bimbingan akademik, konseling psikologi,
        dan pengembangan karier mahasiswa di lingkungan Fakultas.
      </p>

      <div class="flex gap-4">
        <router-link
          to="/auth/signin"
          class="px-8 py-3 text-base font-medium text-primary bg-white border border-primary rounded-lg shadow-lg hover:bg-opacity-90 transition"
        >
          Ajukan Konseling Sekarang
        </router-link>
        <button class="px-8 py-3 text-base font-medium text-primary bg-white border border-primary rounded-lg shadow-lg hover:bg-opacity-90 transition">
          Pelajari Alur
        </button>
      </div>
    </main>

    <footer class="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
      &copy; 2025 SI-BIKO Fakultas. All rights reserved.
    </footer>

  </div>
</template>
