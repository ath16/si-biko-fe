<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// Import library html2pdf
import html2pdf from 'html2pdf.js'

const router = useRouter()
const isGenerating = ref(false)

// Data Dummy Surat
const surat = {
  nomor: 'B/123/UN14.1.28/KM.00.00/2025',
  tanggal: '24 Desember 2025',
  mahasiswa: {
    nama: 'Atha Fajri',
    nim: '240001',
    prodi: 'Informatika',
    fakultas: 'Matematika dan Ilmu Pengetahuan Alam'
  },
  perihal: 'Rujukan Penanganan Konseling Mahasiswa Tingkat Universitas'
}

// FUNGSI KHUSUS GENERATE PDF
const handleDownloadPDF = () => {
  isGenerating.value = true

  // 1. Ambil elemen HTML yang ingin dijadikan PDF (berdasarkan ID)
  const element = document.getElementById('area-surat-resmi')

  // 2. Konfigurasi PDF
  const opt = {
    margin:       0,
    filename:     `Surat_Rujukan_${surat.mahasiswa.nim}.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true, scrollY: 0 },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
  }

  // 3. Proses Generate & Download
  html2pdf().set(opt).from(element).save().then(() => {
    isGenerating.value = false
  })
}

const handleBack = () => {
  router.back()
}
</script>

<template>
  <div class="p-4 md:p-8 bg-gray-200 min-h-screen flex flex-col items-center">

    <div class="w-full max-w-[210mm] mb-6 flex justify-between items-center">
      <button
        @click="handleBack"
        class="flex items-center gap-2 text-slate-600 hover:text-black font-medium"
      >
        ← Kembali
      </button>

      <button
        @click="handleDownloadPDF"
        :disabled="isGenerating"
        class="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-600/90 flex items-center gap-2 disabled:bg-blue-600/70"
      >
        <span v-if="isGenerating">Memproses PDF...</span>
        <span v-else class="flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            Download PDF Resmi
        </span>
      </button>
    </div>

    <div id="area-surat-resmi" class="bg-white p-10 md:p-16 w-[210mm] min-h-full text-black shadow-lg">

      <div class="flex items-center gap-4 border-b-4 border-black pb-4 mb-6">
        <img src="/images/logo/unud-icon.png" alt="Logo Unud" class="w-24 h-24 opacity-80" />
        <div class="text-center w-full">
          <h1 class="text-xl font-bold uppercase tracking-wide">Kementerian Pendidikan Tinggi, Sains, dan Teknologi</h1>
          <h2 class="text-2xl font-extrabold uppercase">Universitas Udayana</h2>
          <h3 class="text-lg font-bold uppercase">Fakultas Matematika dan Ilmu Pengetahuan Alam</h3>
          <p class="text-sm mt-1">Jl. Kampus Bukit Jimbaran, Badung, Bali - 80361</p>
          <p class="text-sm">Laman: fmipa.unud.ac.id | Email: fmipa@unud.ac.id</p>
        </div>
      </div>

      <div class="flex justify-between mb-6">
        <div class="text-sm">
          <table class="w-full">
            <tr><td class="pr-4 py-1">Nomor</td><td>: {{ surat.nomor }}</td></tr>
            <tr><td class="pr-4 py-1">Lampiran</td><td>: 1 (Satu) Berkas</td></tr>
            <tr><td class="pr-4 py-1">Perihal</td><td class="font-bold">: {{ surat.perihal }}</td></tr>
          </table>
        </div>
        <div class="text-right text-sm">
          <p>{{ surat.tanggal }}</p>
        </div>
      </div>

      <div class="mb-6 text-sm">
        <p class="mb-2">Yth. Kepala Biro Kemahasiswaan (BKM)</p>
        <p class="mb-2">Universitas Udayana</p>
        <p>di Tempat</p>
      </div>

      <div class="text-justify leading-relaxed mb-2 space-y-4 text-sm">
        <p>Dengan hormat,</p>

        <p>
          Sehubungan dengan hasil konseling tingkat fakultas yang telah kami lakukan, bersama ini kami sampaikan permohonan rujukan penanganan lebih lanjut untuk mahasiswa berikut:
        </p>

        <table class="ml-8 my-4 w-3/4">
          <tr><td class="w-40 py-1">Nama</td><td>: <b>{{ surat.mahasiswa.nama }}</b></td></tr>
          <tr><td class="w-40 py-1">NIM</td><td>: {{ surat.mahasiswa.nim }}</td></tr>
          <tr><td class="w-40 py-1">Program Studi</td><td>: {{ surat.mahasiswa.prodi }}</td></tr>
          <tr><td class="w-40 py-1">Fakultas</td><td>: {{ surat.mahasiswa.fakultas }}</td></tr>
        </table>

        <p>
          Berdasarkan observasi dan sesi konseling awal oleh Tim BK Fakultas MIPA, kami menyimpulkan bahwa permasalahan yang dihadapi mahasiswa tersebut memerlukan penanganan khusus yang lebih intensif di tingkat Universitas (Layanan Psikologi/Kesehatan Universitas).
        </p>

        <p>
          Besar harapan kami agar mahasiswa tersebut dapat segera mendapatkan jadwal dan penanganan yang sesuai. Demikian surat rujukan ini kami sampaikan, atas perhatian dan kerjasamanya kami ucapkan terima kasih.
        </p>
      </div>

      <div class="flex justify-end mt-10">
        <div class="text-center w-64">
          <p class="mb-15 text-sm">Wakil Dekan Bidang Kemahasiswaan & Informasi</p>
          <p class="font-bold inline-block text-sm">Prof. I Made WD3, S.Si., M.Si.</p>
          <p class="mt-1 border-t border-black text-sm">NIP. 19750101 200012 1 001</p>
        </div>
      </div>

    </div>
  </div>
</template>
