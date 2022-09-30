<template>
  <div>
    <h1 class="mb-4 text-2xl font-bold">
      Famous
    </h1>

    <div>
      <div class="mb-4">
        <span class="font-bold">City:</span>
        <span>{{ headers['x-vercel-ip-city'] }}</span>
      </div>
      <div class="mb-4">
        <span class="font-bold">IP:</span>
        <span>{{ headers['x-forwarded-for'] }}</span>
      </div>
    </div>

    <ul>
      <li
        v-for="(website, i) in data"
        :key="i"
      >
        {{ i }}
        <img
          :src="`https://www.google.com/s2/favicons?sz=64&domain=${website.urlMain}`"
          width="32"
        >
        {{ website.urlMain }}
        <Website
          :key="i"
          :website="website"
        />
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import type { Website } from '~/core/Website'
const headers = useRequestHeaders(['x-forwarded-for', 'x-vercel-ip-city'])
const { data } = await useAsyncData(() => globalThis.$fetch<Record<string, Website>>("/api/all"))
</script>
