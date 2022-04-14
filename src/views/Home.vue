<template>
  <div class="home">
    <LineChart Title="chart1" :Series="SeriesData"></LineChart>
    <LineChart :Series="SeriesData"></LineChart>
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <img v-dummy="'400x300'" /> <!-- Note: the quotes to pass the expression as a string -->
    <img v-dummy.400x300 /><!-- or, as a Vue modifier -->
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import LineChart from "../components/Chart/lineChart.vue";
import { Series } from "../components/Chart/ChartViewModel";

export default {
  name: "Home",
  components: {
    HelloWorld,
    LineChart,
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
    setInterval(() => {
      var random = Math.random();
      this.SeriesData[0].Append(random * 1);
      this.SeriesData[1].Append(random * 2);
      this.SeriesData[2].Append(random * 3);
    }, 1000);
  },
};
</script>
