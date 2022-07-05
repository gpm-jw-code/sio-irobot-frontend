<template>
  <div v-if="show" class="scroll-to-top" id="sctbtn">
    <div class="h2 mb-0">
      <b-icon
        id="scroll-top-btn"
        class="rounded-circle"
        icon="chevron-up"
        variant="info"
        @click="ScrollToTop"
      ></b-icon>
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
      document.getElementById("app").scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
  },
  mounted() {
    window.addEventListener("scroll", (event) => {
      this.show = event.target.scrollTop > 100;
    }, true);


  },
};
</script>

<style>
.scroll-to-top {
  position: fixed;
  bottom: 30px;
  right: 42px;
  z-index: 12312312;
}

#scroll-top-btn {
  cursor: pointer;
  padding: 5px;
  background-color: rgb(255, 255, 255);
}

#scroll-top-btn:hover {
  cursor: pointer;
  background-color: rgb(23, 76, 156);
}
</style>
