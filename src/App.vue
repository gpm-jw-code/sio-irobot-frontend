<template>
  <div id="app">
    <ScrollToTopButton></ScrollToTopButton>

    <Nav></Nav>
    <div class="mt-5">
      <keep-alive>
        <router-view v-slot="{Component}">
          <transition name="fade">
            <component :is="Component"></component>
          </transition>
        </router-view>
      </keep-alive>
    </div>
  </div>
</template>


<script>
import Nav from "./components/Nav/Nav.vue";
import ScrollToTopButton from "./components/ScrollToTop/ScrollTopButton.vue";
import { GetUIStartupConfig } from "./web-api/Backend/UIAPI.js";
export default {
  components: { Nav, ScrollToTopButton },
  data() {
    return {};
  },
};
</script>

<style >
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background-color: #2c3e50;
  color: white;
  height: 100%;
  width: 100%;
  position: fixed;
  overflow-y: scroll;
  z-index: 0;
}

body {
  margin: 0;
  padding: 0;
}

.selector-for-some-widget {
  box-sizing: content-box;
}
</style>
