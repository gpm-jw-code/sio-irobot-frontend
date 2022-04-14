<template>
  <div class="home">
    <TradeChart id="cr1"></TradeChart>
    <TradeChart id="cr2"></TradeChart>

    <LineChart :Series="SeriesData"></LineChart>
    <div id="light-chart" class="chart pl-5"></div>
    <img v-dummy="'400x300'" />
    <!-- Note: the quotes to pass the expression as a string -->
    <img v-dummy.400x300 /><!-- or, as a Vue modifier -->

    <TradeChart></TradeChart>
  </div>
</template>

<script>
// @ is an alias to /src
import LineChart from "../components/Chart/lineChart.vue";
import TradeChart from "../components/Chart/TradingChart.vue";
import { Series } from "../components/Chart/ChartViewModel";

export default {
  name: "Home",
  components: {
    LineChart,
    TradeChart,
  },
  data() {
    return {
      SeriesData: [
        new Series("rts", []),
        new Series("rts2", []),
        new Series("rts3", []),
      ],
    };
  },
  mounted() {
    // setInterval(() => {
    //   var random = Math.random();
    //   this.SeriesData[0].Append(random * 1);
    //   this.SeriesData[1].Append(random * 2);
    //   this.SeriesData[2].Append(random * 3);
    // }, 100);
  },
};
</script>

<style>
</style>