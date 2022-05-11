<template>
  <div id="app">
    <Nav></Nav>
    <ScrollToTopButton></ScrollToTopButton>
    <div class="mt-5">
      <router-view />
    </div>
  </div>
</template>


<script>
import Nav from "./components/Nav/Nav.vue";
import ScrollToTopButton from "./components/ScrollToTop/ScrollTopButton.vue";
export default {
  components: { Nav, ScrollToTopButton },
  data() {
    return {};
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background-color: #2c3e50;
  color: white;
  height: 100%;
}

.selector-for-some-widget {
  box-sizing: content-box;
}
</style>
