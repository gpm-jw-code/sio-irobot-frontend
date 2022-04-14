<template >
  <div class="fixed-top" sticky>
    <b-navbar toggleable="lg" type="dark" :variant="$configs.navStyle" ref="nav">
      <b-navbar-brand href="#">{{$configs.navTitle}}</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item href="#">Link</b-nav-item>
          <b-nav-item href="#" disabled>Disabled</b-nav-item>
        </b-navbar-nav>
        <!-- Right aligned nav items -->

        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown dropleft>
            <!-- Using 'button-content' slot -->
            <template v-slot:button-content>
              <em>User</em>
            </template>
            <b-dropdown-item href="#/about">Pr?ofile</b-dropdown-item>
            <b-dropdown-item href="#">Sign Out</b-dropdown-item>
          </b-nav-item-dropdown>

          <b-nav-item-dropdown dropleft>
            <!-- Using 'button-content' slot -->
            <template v-slot:button-content>
              <em>STYLE</em>
            </template>
            <b-dropdown-item @click="SetStyle('dark')">Dark</b-dropdown-item>
            <b-dropdown-item @click="SetStyle('info')">Bright</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
export default {
  methods: {
    SetStyle(style) {
      this.$configs.navStyle = style;
      console.log(this.$configs.navStyle);
      this.$refs.nav.variant = style;
    },
  },
};
</script>

<style>
.nav-right {
  width: 100%;
}
</style>
