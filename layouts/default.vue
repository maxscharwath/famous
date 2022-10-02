<script setup lang="ts">
import { useHead } from '@vueuse/head'

useHead({
  titleTemplate: (title) => `Famous ${title}`,
});
</script>

<template>
  <div class="min-h-full">
    <div class="flex flex-col">
      <main class="flex-1">
        <slot />
      </main>
    </div>
  </div>
</template>

<style>
 body{
   @apply bg-gray-800
 }
</style>
