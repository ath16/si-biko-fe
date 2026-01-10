<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import html2pdf from 'html2pdf.js'

const router = useRouter()
const route = useRoute()
const idAjuan = route.params.id

const isGenerating = ref(false)
const isLoading = ref(true)

const surat = ref({
  nomor_surat: '...',
  tanggal: '...',
  perihal: '...',
  mahasiswa: {
    nama: '...',
    nim: '...',
    prodi: '...',
    fakultas: '...'
  }
})

const fetchSurat = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await axios.get(`http://localhost:8000/api/wd3/ajuan/${idAjuan}/cetak`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    surat.value = response.data.data
  } catch (error) {
    console.error("Gagal load surat:", error)
    alert("Gagal memuat data surat. Pastikan status sudah dirujuk ke Universitas.")
    router.back()
  } finally {
    isLoading.value = false
  }
}

onMounted(() => fetchSurat())

const handleDownloadPDF = () => {
  isGenerating.value = true
  const element = document.getElementById('area-surat-resmi')
  const opt = {
    margin:       0,
    filename:     `Surat_Rujukan_${surat.value.mahasiswa.nim}.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
  }

  html2pdf().set(opt).from(element).save().then(() => {
    isGenerating.value = false
  })
}

const handleBack = () => router.back()
</script>

<template>
  <div class="p-4 md:p-8 bg-gray-200 min-h-screen flex flex-col items-center">

    <div v-if="isLoading" class="flex items-center justify-center h-64">
        <p class="text-xl font-bold text-gray-500">Menyiapkan Dokumen...</p>
    </div>

    <div v-else>
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

        <div id="area-surat-resmi" class="bg-white p-10 md:p-16 w-[210mm] text-black shadow-lg">

        <div class="flex items-center gap-4 border-b-4 border-black pb-4 mb-6">
            <img src="/images/logo/unud-icon.png" alt="Logo Unud" class="w-24 h-24 object-contain" />
            <div class="text-center w-full">
            <h1 class="text-lg font-bold uppercase tracking-wide">Kementerian Pendidikan Tinggi, Sains, dan Teknologi</h1>
            <h2 class="text-xl font-extrabold uppercase">Universitas Udayana</h2>
            <h3 class="text-lg font-bold uppercase">Fakultas Matematika dan Ilmu Pengetahuan Alam</h3>
            <p class="text-xs mt-1">Jl. Kampus Bukit Jimbaran, Badung, Bali - 80361</p>
            <p class="text-xs">Laman: fmipa.unud.ac.id | Email: fmipa@unud.ac.id</p>
            </div>
        </div>

        <div class="flex justify-between mb-3 text-sm">
            <div class="w-2/3">
            <table class="w-full">
                <tr><td class="pr-2 py-1 align-top w-20">Nomor</td><td class="align-top">: {{ surat.nomor_surat }}</td></tr>
                <tr><td class="pr-2 py-1 align-top">Lampiran</td><td class="align-top">: 1 (Satu) Berkas</td></tr>
                <tr><td class="pr-2 py-1 align-top">Perihal</td><td class="align-top font-bold">: {{ surat.perihal }}</td></tr>
            </table>
            </div>
            <div class="text-right w-1/3">
            <p>Jimbaran, {{ surat.tanggal }}</p>
            </div>
        </div>

        <div class="mb-6 text-sm">
            <p class="mb-1">Yth. Kepala Biro Kemahasiswaan (BKM)</p>
            <p class="mb-1">Universitas Udayana</p>
            <p>di Tempat</p>
        </div>

        <div class="text-justify leading-relaxed space-y-2 text-sm">
            <p>Dengan hormat,</p>
            <p>
            Sehubungan dengan hasil konseling tingkat fakultas yang telah kami lakukan, bersama ini kami sampaikan permohonan rujukan penanganan lebih lanjut untuk mahasiswa berikut:
            </p>

            <table class="ml-4 my-4 w-full">
            <tr><td class="w-32 py-1">Nama</td><td>: <b>{{ surat.mahasiswa.nama }}</b></td></tr>
            <tr><td class="w-32 py-1">NIM</td><td>: {{ surat.mahasiswa.nim }}</td></tr>
            <tr><td class="w-32 py-1">Program Studi</td><td>: {{ surat.mahasiswa.prodi }}</td></tr>
            <tr><td class="w-32 py-1">Fakultas</td><td>: {{ surat.mahasiswa.fakultas }}</td></tr>
            </table>

            <p>
            Berdasarkan observasi dan sesi konseling awal oleh Tim BK Fakultas MIPA, kami menyimpulkan bahwa permasalahan yang dihadapi mahasiswa tersebut memerlukan penanganan khusus yang lebih intensif di tingkat Universitas.
            </p>

            <p>
            Besar harapan kami agar mahasiswa tersebut dapat segera mendapatkan jadwal dan penanganan yang sesuai. Demikian surat rujukan ini kami sampaikan, atas perhatian dan kerjasamanya kami ucapkan terima kasih.
            </p>
        </div>

        <div class="flex justify-end mt-10">
            <div class="text-center w-64">
            <p class="mb-20 text-sm">Wakil Dekan Bidang Kemahasiswaan & Informasi</p>
            <p class="font-bold underline text-sm">Ni Nyoman Rupiasih, S.Si., M.Si., Ph.D.</p>
            <p class="text-sm">NIP. 19690408 199412 2 001</p>
            </div>
        </div>

        </div>
    </div>
  </div>
</template>
