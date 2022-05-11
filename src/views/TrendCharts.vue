<template>
  <div class="trend-charts">
    <h1>趨勢圖</h1>
    {{$route.params.eqid}} - {{$route.params.field}}
  </div>
</template>

<script>
export default {
  data() {
    return {
      parameters: {
        eqid: 0,
        column: {
          field: "",
          label: ""
        }
      }
    }
  },
  mounted() {
    console.log('mounted');
  },
  beforeDestroy() {
    console.log('beforeDestroy');
  }
}
</script>

<style>
</style>