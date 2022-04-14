<template>
  <div v-if="show" class="scroll-to-top">
    <div class="h2 mb-0">
      <b-icon id="scroll-top-btn" class="rounded-circle" icon="chevron-up" variant="dark" @click="ScrollToTop"></b-icon>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
    };
  },
  methods: {
    ScrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
  },
  mounted() {
    window.addEventListener("scroll", () => {
      this.show = window.scrollY > 100;
    });
  },
};
</script>

<style>
.scroll-to-top {
  position: fixed;
  bottom: 20px;
  right: 20px;
}

#scroll-top-btn {
  cursor: pointer;
  padding: 5px;
  background-color: rgb(110, 110, 110);
}

#scroll-top-btn:hover {
  cursor: pointer;
  background-color: rgb(153, 153, 153);
}
</style>
