<template>
  <div v-if="show" id="sctbtn" v-bind:style="btnStyle">
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
      btnStyle: {
        bottom: '30px'
      },
      bottom_offset_tmp: ""
    };
  },
  methods: {
    ScrollToTop() {
      document.getElementById("app").scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
    Offset() {
    }
  },
  mounted() {
    window.addEventListener("scroll", (event) => {
      this.btnStyle.bottom = this.bottom_offset_tmp
      this.show = event.target.scrollTop > 100;
    }, true);

    this.$bus.$on('footPanelShow', (height) => {
      this.bottom_offset_tmp = `${height + 5}px`;
      if (!this.show)
        return;
      this.btnStyle.bottom = this.bottom_offset_tmp
    });

    this.$bus.$on('footPanelOnClose', () => {
      this.bottom_offset_tmp = '30px'
      if (!this.show)
        return;
      this.btnStyle.bottom = '30px'
    });

  },
};
</script>

<style>
#sctbtn {
  position: fixed;
  bottom: 30px;
  right: 42px;
  z-index: 12;
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
