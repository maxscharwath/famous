<template>
  <div>
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
import { useFetch } from '#imports'

const url="https://raw.githubusercontent.com/sherlock-project/sherlock/master/sherlock/resources/data.json"
const { data } = useFetch<Record<string, Website>>(url,{
  parseResponse: JSON.parse
})
</script>
