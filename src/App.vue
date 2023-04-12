<script setup>
import HelloCroket from "./components/HelloCroket.vue";
import TheSelect from "./components/TheSelect.vue";
</script>

<template>
  <header>
    <img
      alt="Vue logo"
      class="logo"
      src="https://image.rocketpunch.com/company/38438/yolo-2_logo_1640049226.png?s=400x400&t=inside"
      width="125"
      height="125"
      style="border-radius: 10px"
    />

    <div class="wrapper">
      <HelloCroket msg="croket" />
    </div>
  </header>

  <main>
    <Suspense>
      <TheSelect category="default" />
    </Suspense>
    <Suspense>
      <TheSelect category="doll" />
    </Suspense>
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
