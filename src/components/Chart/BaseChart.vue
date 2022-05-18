<template>
  <div class="chart">
    <apexchart height="250" ref="chart" :options="chartOptions" :series="series"></apexchart>
  </div>
</template>

<script>
import { Options, Series } from "./ChartViewModel";
export default {
  data() {
    return {
      chart: null,
    };
  },
  props: {
    chartOptions: {
      type: Object,
      default() {
        return new Options("line");
      },
    },
    series: {
      type: Array,
      default() {
        var series1 = new Series("test", [1, 2, 32]);
        return [series1];
      },
    },
  },
  watch: {},

  methods: {
    UpdateOptions(options) {
      this.$refs["chart"].updateOptions(options);
    },
    UpdateSeries(series) {
      this.$refs["chart"].updateSeries(series);
    },
  },
};
</script>

<style>
</style>
