<template>
  <div class="admin-page">
    <h1>Admin Page</h1>
    <router-view></router-view>
  </div>
</template>

<script>
import { SetStartUpPageMode } from '../web-api/Backend/UIAPI';
export default {
  data() {
    return {
      key: "value"
    }
  },
  mounted() {
    SetStartUpPageMode();
  }
}
</script>
<style scoped>
.admin-page {
  background-color: black;
  color: white;
  height: 100vh;
}
</style>