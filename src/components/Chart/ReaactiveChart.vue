<template >
  <div class="line-chart-container">
    <LineChartGenerator
      ref="line-chart"
      :chart-options="chartOptions"
      :chart-data="chartData"
      :chart-id="chartId"
      :dataset-id-key="datasetIdKey"
      :plugins="plugins"
      :css-classes="cssClasses"
      :styles="styles"
      :width="width"
      :height="height"
    />
  </div>
</template>

<script>
import { Line as LineChartGenerator } from "vue-chartjs/legacy";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement
);

export default {
  name: "LineChart",
  components: {
    LineChartGenerator,
  },
  props: {
    chartId: {
      type: String,
      default: "line-chart",
    },
    datasetIdKey: {
      type: String,
      default: "label",
    },
    width: {
      type: Number,
      default: 400,
    },
    height: {
      type: Number,
      default: 180,
    },
    cssClasses: {
      default: "",
      type: String,
    },
    styles: {
      type: Object,
      default: () => { },
    },
    plugins: {
      type: Array,
      default: () => [],
    },
    chartData: {
      type: Object,
      default() {
        return {
          labels: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
          ],
          datasets: [
            {
              label: "Data One",
              borderColor: "rgba(215, 22, 192, 1)",
              backgroundColor: "rgba(215, 22, 192, 1)",
              data: [40, 39, 10, 40, 39, 80, 40],
            },
            {
              label: "Data 2",
              backgroundColor: "rgba(25, 92, 192, 1)",
              borderColor: "rgba(25, 92, 192, 1)",
              data: [30, 2, 10, 40, 39, 80, 40],
              fill: true,
              borderWidth: 1,
            },
          ],
        };
      },
    },
  },
  watch: {
    datasetIdKey: {
      handler: function (newkey) {
        console.info(newkey);
        this.$refs["line-chart"].renderChart(this.chartData, this.chartOptions);
      },
    },
  },
  data() {
    return {
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        elements: {
          point: {
            borderWidth: 0,
            radius: 0,
          },
        },
        animation: false,
      },
    };
  },
};
</script>

<style>
.line-chart-container {
  /* border: 1px solid rgb(160, 160, 160); */
  border-radius: 0px;
}
</style>>
