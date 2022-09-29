<template>
  <div>
    <ul>
      <li
        v-for="website in data"
        :key="website"
      >
        <img
          :src="`https://www.google.com/s2/favicons?sz=64&domain=${website.urlMain}`"
          width="32"
        >
        {{ website.urlMain }}
        <Website :website="website" />
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>

const url="https://raw.githubusercontent.com/sherlock-project/sherlock/master/sherlock/resources/data.json"
const { data } = useFetch(url,{
  parseResponse: JSON.parse
})
</script>
