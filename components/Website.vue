<template>
  <div>
    {{ data?.status }}
  </div>
</template>

<script lang="ts" setup>

import {useAsyncData, useRoute } from '#imports'
import type { Website } from '~/core/Website'

const props = defineProps<{
  website: Website
}>()

const username = useRoute().query.username as string;

const id = `${props.website.url}-${username}`
const { data } = await useAsyncData(id, () => {
  if(!username) {
    return null
  }
  return $fetch('/api/check', {
    method: 'post',
    body: {
      website: props.website,
      username
    },
  })
},{
  server: false
})
</script>
