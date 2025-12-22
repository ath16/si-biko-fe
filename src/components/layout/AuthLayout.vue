<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-boxdark-2 px-4 py-10 sm:px-6 lg:px-8">
    <div class="w-full max-w-[1000px] rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div class="flex flex-wrap items-center">

        <div class="hidden w-full xl:block xl:w-1/2">
          <div class="py-17.5 px-26 text-center">
            <RouterLink class="mb-5.5 inline-block" to="/">
              <img class="dark:hidden w-40 mx-auto" src="/images/logo/logo.svg" alt="Logo" />
              <img class="hidden dark:block w-40 mx-auto" src="/images/logo/logo-dark.svg" alt="Logo" />
            </RouterLink>

            <p class="font-medium 2xl:px-20">
              Sistem Informasi Bimbingan Konseling (SI-BIKO)
            </p>

            <span class="mt-15 inline-block">
              <img src="/images/grid-image/image-01.png" alt="illustration" class="opacity-80" />
            </span>
          </div>
        </div>

        <div class="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
          <div class="w-full p-4 sm:p-12.5 xl:p-17.5">
            <slot></slot>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
