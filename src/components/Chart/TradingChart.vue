<template>
  <div class="mb-3">
    <div>
      <b-button class="mr-2" @click="syncToDarkTheme">Dark</b-button>
      <b-button class="mr-2" @click="syncToLightTheme">Light</b-button>
    </div>
    <div class="chart" :id="id"></div>
  </div>
</template>

<script>
import { createChart } from "lightweight-charts";
export default {
  data() {
    return {
      chart: "",
      themesData: {
        Dark: {
          height: 100,
          layout: {
            backgroundColor: "#2B2B43",
            lineColor: "#2B2B43",
            textColor: "#D9D9D9",
          },
          watermark: {
            color: "rgba(0, 0, 0, 0)",
          },
          crosshair: {
            color: "#758696",
          },
          grid: {
            vertLines: {
              color: "#2B2B43",
            },
            horzLines: {
              color: "#363C4E",
            },
          },
        },
        Light: {
          layout: {
            backgroundColor: "#FFFFFF",
            lineColor: "#2B2B43",
            textColor: "#191919",
          },
          watermark: {
            color: "rgba(0, 0, 0, 0)",
          },
          grid: {
            vertLines: {
              visible: false,
            },
            horzLines: {
              color: "#f0f3fa",
            },
          },
        },
      },
    };
  },
  props: {
    id: String,
  },
  methods: {
    syncToDarkTheme() {
      this.chart.applyOptions(this.themesData.Dark);
    },
    syncToLightTheme() {
      this.chart.applyOptions(this.themesData.Light);
    },
  },
  mounted() {
    this.chart = createChart(this.id, { width: window.width, height: 400 });
    const lineSeries = this.chart.addLineSeries({
      topColor: "rgba(32, 226, 47, 0.56)",
      bottomColor: "rgba(32, 226, 47, 0.04)",
      lineColor: "rgba(32, 226, 47, 1)",
    });

    this.syncToDarkTheme();

    setInterval(() => {
      var random = Math.random();
      lineSeries.update({ time: Date.now(), value: random });
    }, 1000);
  },
};
</script>

<style>
</style>