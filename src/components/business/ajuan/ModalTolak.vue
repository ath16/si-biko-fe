<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  isOpen: boolean,
  isLoading?: boolean
}>()

const emit = defineEmits(['close', 'submit'])
const alasan = ref('')

const handleSubmit = () => {
  if (!alasan.value) return alert("Mohon isi alasan penolakan.")
  emit('submit', alasan.value)
  alasan.value = ''
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[999999] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
    >
      <div class="w-full max-w-md rounded-lg bg-white p-8 shadow-2xl dark:bg-boxdark transform transition-all">
        <h3 class="mb-4 text-xl font-bold text-black dark:text-white">Tolak Ajuan</h3>
        <p class="mb-5 text-sm text-slate-500">
          Apakah Anda yakin ingin menolak ajuan ini? Mohon berikan alasan yang jelas kepada mahasiswa.
        </p>

        <div class="mb-5">
          <label class="mb-2.5 block font-medium text-black dark:text-white">Alasan Penolakan</label>
          <textarea
            v-model="alasan"
            rows="3"
            class="w-full rounded border border-stroke bg-transparent py-3 px-5 outline-none focus:border-red-300 dark:border-form-strokedark dark:bg-form-input"
            placeholder="Contoh: Jadwal bertabrakan dengan rapat Dekanat..."
          ></textarea>
        </div>

        <div class="flex gap-4 justify-end">
          <button @click="$emit('close')" class="rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white">
            Batal
          </button>
          <button @click="handleSubmit" class="rounded bg-red-600 py-2 px-6 font-medium text-white hover:bg-red-600/90">
            {{ isLoading ? 'Memproses...' : 'Tolak Ajuan' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
