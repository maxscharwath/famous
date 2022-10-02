<template>
  <Background />
  <div
    class="z-10 mx-5 flex h-screen flex-col items-center justify-center"
  >
    <div
      key="container"
      class="w-full max-w-4xl rounded-lg border-2 border-gray-200/50 bg-gray-200/90 p-10 shadow-2xl backdrop-blur-sm"
    >
      <form @submit.prevent="check">
        <input
          v-model="username"
          type="text"
          class="w-full rounded-lg border-2 border-gray-300 p-4"
          placeholder="Enter your username"
        >
      </form>

      <div class="my-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          class="rounded-l-full bg-blue-600 p-0.5 text-center text-xs font-medium leading-none text-blue-100"
          :style="{width: `${progress}%`}"
        >
          {{ progress }}%
        </div>
      </div>
      <div class="max-h-52 overflow-y-auto">
        <ul>
          <li
            v-for="account in accountsClaimed"
            :key="account"
          >
            {{ account.url_user }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { QueryStatus, Response } from '~/core/Famous'

const username = ref('');
const websites = Object.entries(await globalThis.$fetch("/api/all"));
const i = ref(0);
const accountsClaimed = ref<Response[]>([])
const progress = computed(() => Math.round((i.value / (websites.length-1)) * 100));
const check = async () => {
  i.value = 0;
  accountsClaimed.value = [];
  await Promise.allSettled(websites.map(async ([_name, website]) => {
    const response = await globalThis.$fetch('/api/check', {
      method: 'POST',
      body: {
        username: username.value,
        website,
      },
    });
    i.value++;
    if( response.status === QueryStatus.CLAIMED){
      accountsClaimed.value.push(response);
    }
  }));
};
</script>
