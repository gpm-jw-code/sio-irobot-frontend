<template >
  <div class="line-chart-container" :id="chartId">
    <b-button @click="test">test</b-button>
    <LineChartGenerator
      :id="`line-${chartId}`"
      :ref="`line-${chartId}`"
      :chart-options="chartOptions"
      :chart-data="chartData"
      :chart-id="chartId"
      :dataset-id-key="datasetIdKey"
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
    chartData: {
      type: Object,
      default() {
        return {
        };
      },
    },
    ThresHoldLines: {
      type: Array,
      default() {
        return [{ name: "oos", value: 2.3, color: "red", type: 'line' },
        { name: "ooc", value: 0.1, color: "blue", type: 'line' }]
      }
    }
  },
  watch: {
    // datasetIdKey: {
    //   handler: function (newkey) {
    //     console.log(newkey);
    //     this.$refs["line-chart"].renderChart(this.chartData, this.chartOptions);
    //   },
    // }
  },
  methods: {
    test() {
      console.log(`line-${this.chartId}`);
      this.$refs[`line-${this.chartId}`].renderChart(this.chartData, this.chartOptions);
    }
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
        plugins: {
          autocolors: false,
          annotation: {
            annotations: {
              // line1: {
              //   type: 'line',
              //   yMin: 1,
              //   yMax: 1,
              //   borderColor: 'rgb(255, 99, 132)',
              //   borderWidth: 2,
              // }
            }
          }
        }
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
