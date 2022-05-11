<template >
  <div class="fixed-top" sticky>
    <b-navbar toggleable="lg" ref="nav" :variant="nav_style" :type="nav_style">
      <b-navbar-brand v-b-toggle.sidebar>
        <b-icon-menu-button></b-icon-menu-button>
        {{ $configs.navTitle }}
      </b-navbar-brand>
      <b-sidebar id="sidebar" aria-labelledby="sidebar-title" no-header backdrop>
        <div id="sidebar-title">
          <h4>{{$configs.navTitle}}</h4>
        </div>
        <div id="sibar-container">
          <b-row v-for="route in sibarItems" :key="route.path">
            <b-button variant="light" block :to="route.path">{{route.name}}</b-button>
          </b-row>
        </div>
      </b-sidebar>
      <b-navbar-nav class="ml-auto">
        <b-avatar button @click="UserAvatarClickHandle" variant="light"></b-avatar>
      </b-navbar-nav>
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
        if (route.showInSideBar)
          this.sibarItems.push(route);
      }

    },
    UserAvatarClickHandle() {
      alert('login form');
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
#sidebar-title {
  background-color: black;
  color: white;
  padding: 5px;
}
#sibar-container {
  background-color: blue;
}
</style>
