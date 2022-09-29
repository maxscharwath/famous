<template>
  <div>
    {{ data?.status }}
  </div>
</template>

<script lang="ts" setup>

import { useRoute } from '#imports'

const props = defineProps<{
  website: any
}>()

const username = useRoute().query.username as string;

if(!username) {
  throw createError({ statusCode: 404, statusMessage: 'Not Found' })
}

const { data } = useFetch('/api/check', {
  method: 'post',
  body: {
      website: props.website,
      username
    },
  server: false
  });
</script>
