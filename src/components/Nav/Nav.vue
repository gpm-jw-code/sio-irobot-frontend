<template >
  <div class="fixed-top" sticky>
    <b-navbar toggleable="lg" ref="nav" :variant="nav_style" :type="nav_style">
      <b-navbar-brand v-b-toggle.sidebar>{{ $configs.navTitle }}</b-navbar-brand>
      <b-sidebar id="sidebar" :title="$configs.navTitle" backdrop>
        <b-row v-for="route in sibarItems" :key="route.path">
          <b-button variant="light" block :to="route.path">{{route.name}}</b-button>
        </b-row>
      </b-sidebar>
    </b-navbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nav_style: "dark",
      sibarItems: []
    };
  },
  methods: {
    SetStyle(style) {
      this.nav_style = style;
      this.$configs.navStyle = style;
    },
    CreateSideBar() {
      console.log(this.$router.options.routes.length);
      for (let index = 0; index < this.$router.options.routes.length; index++) {
        const route = this.$router.options.routes[index];
        this.sibarItems.push(route);
      }

    }
  },
  mounted() {
    this.CreateSideBar();
    this.nav_style = this.$configs.navStyle;
    window.addEventListener("scroll", () => {
      this.nav_style = window.scrollY != 0 ? "light" : "dark";
    });
  },
};
</script>

<style>
.nav-right {
  width: 100%;
}
</style>
