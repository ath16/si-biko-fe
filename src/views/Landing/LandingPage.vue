<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white text-slate-800 font-satoshi">

    <nav class="w-full bg-white/90 backdrop-blur-sm border-b border-stroke py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50 shadow-sm">
      <div class="flex items-center gap-2">
        <img src="/images/logo/logo-icon.svg" alt="Logo" class="w-8 h-8" />
        <span class="text-xl font-bold text-blue-600">SI-BIKO</span>
      </div>
      <div>
        <RouterLink
          to="/auth/signin"
          class="bg-blue-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-blue-700 transition shadow-md"
        >
          Masuk/Login
        </RouterLink>
      </div>
    </nav>

    <header
      class="relative flex-grow flex flex-col justify-center items-center text-center px-6 py-32 bg-[url('/images/bg-landing.jpg')] bg-cover bg-center bg-no-repeat"
    >
      <div class="absolute inset-0 bg-black/60 z-0"></div>

      <div class="relative z-10 max-w-4xl mx-auto">
        <span class="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-md text-white text-sm font-semibold mb-6 border border-white/30">
          Sistem Informasi Bimbingan & Konseling
        </span>

        <h1 class="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg">
          Teman Cerita & Solusi <br/> Masalah Akademik Anda
        </h1>

        <p class="text-lg text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
          Layanan konseling terintegrasi Fakultas MIPA. Ajukan jadwal konsultasi dengan Dosen PA atau Konselor secara privat, aman, dan terstruktur.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <RouterLink
            to="/auth/signin"
            class="bg-blue-600 text-white text-lg px-8 py-4 rounded-lg font-bold hover:bg-blue-700 hover:shadow-lg transition duration-300"
          >
            Mulai Konseling
          </RouterLink>
          <a
            href="#tentang"
            class="bg-white/10 backdrop-blur-md text-white border border-white/50 text-lg px-8 py-4 rounded-lg font-bold hover:bg-white/50 hover:text-blue-700 transition duration-300"
          >
            Pelajari Alurnya
          </a>
        </div>
      </div>
    </header>

    <section id="tentang" class="py-20 px-6 bg-white">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-black mb-4">Bagaimana SI-BIKO Membantu Anda?</h2>
          <p class="text-slate-500">Proses bimbingan dan konseling yang mudah dalam 3 langkah.</p>
        </div>

        <div class="grid md:grid-cols-3 gap-10">
          <div class="p-8 rounded-2xl bg-gray-50 border border-slate-100 hover:shadow-lg transition group">
            <div class="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-black mb-3">1. Buat Ajuan</h3>
            <p class="text-slate-500">
              Isi formulir keluhan atau permasalahan (Akademik, Pribadi, Karir) dan pilih jadwal yang Anda inginkan. Privasi terjaga.
            </p>
          </div>

          <div class="p-8 rounded-2xl bg-gray-50 border border-slate-100 hover:shadow-lg transition group">
            <div class="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6 text-green-600 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-black mb-3">2. Jadwal Dikonfirmasi</h3>
            <p class="text-slate-500">
              Dosen PA atau Konselor akan meninjau ajuan Anda. Anda akan mendapat notifikasi persetujuan jadwal atau penawaran waktu baru.
            </p>
          </div>

          <div class="p-8 rounded-2xl bg-gray-50 border border-slate-100 hover:shadow-lg transition group">
            <div class="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6 text-purple-600 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-black mb-3">3. Sesi Konseling</h3>
            <p class="text-slate-500">
              Lakukan sesi tatap muka sesuai jadwal. Jika masalah kompleks, sistem mendukung rujukan ke tingkat Universitas (WD3).
            </p>
          </div>
        </div>
      </div>
    </section>

    <footer class="bg-slate-900 text-white py-8 border-t border-slate-800">
      <div class="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        <div class="mb-4 md:mb-0 text-center md:text-left">
          <span class="font-bold text-xl block">SI-BIKO</span>
          <p class="text-slate-400 text-sm mt-1">Sistem Informasi Bimbingan Konseling FMIPA</p>
        </div>
        <div class="text-slate-500 text-sm">
          &copy; 2025 Universitas Udayana.
        </div>
      </div>
    </footer>

  </div>
</template>
