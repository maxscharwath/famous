<template>
  <div
    class="bg-animate fixed top-0 left-0 -z-10 h-full w-full"
    :style="{backgroundImage:`url('/background.png')`}"
  />
</template>

<style scoped>

@keyframes bg-scroll {
  0% {
    background-position: -1440px -1440px;
  }
  100% {
    background-position: 1440px 1440px;
  }
}

.bg-animate {
  animation: bg-scroll 120s linear infinite;
  mask-image: radial-gradient(black 0%,transparent 100%);
}

.bg-animate::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(10px);
  mask-image: radial-gradient(transparent 0%,black 75%);
}

</style>
