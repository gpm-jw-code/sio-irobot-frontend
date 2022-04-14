<template>
  <BasicChart ref="baseChart" :chartOptions="Options"></BasicChart>
</template>

<script>
import BasicChart from "./BaseChart.vue";
import { Options, Series } from "./ChartViewModel";
export default {
  components: { BasicChart },
  props: {
    Series: {
      type: Array,
      default() {
        return [new Series("s1", [1, 2, 3])];
      },
    },
    Title: String,
  },
  watch: {
    Series: {
      handler: function (series) {
        this.UpdateSeries(series);
      },
      immediate: true,
      deep: true,
    },
  },
  data() {
    return {
      get Options() {
        let opt = new Options("line");
        opt.title.text = "Area Chart Demo";
        opt.xaxis.title.text = "Index";
        opt.yaxis.title.text = "Value";
        return opt;
      },
      baseChart: undefined,
    };
  },

  methods: {
    UpdateSeries(series) {
      if (this.baseChart) this.baseChart.UpdateSeries(series);
    },
  },
  mounted() {
    this.baseChart = this.$refs["baseChart"];
    this.baseChart.UpdateOptions(this.Options);
  },
};
</script>

<style>
</style>
