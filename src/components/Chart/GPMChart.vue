<template>
  <div v-bind:style="chart_style">
    <canvas :id="id"></canvas>
  </div>
</template>
<script>
import Chart from 'chart.js'
export default {
  props: {
    id: {
      type: String,
      default: 'dchart'
    },
    title: {
      type: String,
      default: "Title"
    },
    xAxisLabel: {
      type: String,
      default: "時間"
    },
    yAxisLabel: {
      type: String,
      default: "YLabel"
    }
  },

  data() {
    return {
      chart_style: {
        backgroundColor: '#202020',
        border: '1px solid grey',
        margin: '3px'
      },
      chartInstance: {},
      options: {
        responsive: true,
        maintainAspectRatio: false,
        lineTension: 0,
        layout: {
          padding: {
            bottom: 20
          },
        },
        title: {
          display: true,
          text: this.title,
          fontSize: 20,
          fontColor: 'white'
        },
        scales: {
          yAxes: [
            {
              gridLines: {
                color: '#313131',
              },
              ticks: {
                beginAtZero: true,
                padding: 25,
                fontColor: 'white'
              },
              scaleLabel: {
                display: true,
                labelString: this.yAxisLabel,
                fontSize: 16,
                fontColor: 'white'
              }
            }
          ],
          xAxes: [{
            type: 'time',
            time: {
              unit: 'second'
            },
            gridLines: {
              color: '#313131'
            },
            ticks: {
              autoskip: true,
              autoSkipPadding: 130,
              maxRotation: 0,
              minRotation: 0,
              fontColor: 'white'
            },
            scaleLabel: {
              display: true,
              labelString: this.xAxisLabel,
              fontSize: 16,
              fontColor: 'white'
            }
          }]
        },
      },
      datasets: []
    }
  },
  methods: {
    ChartInit() {
      console.info('chartini', this.id);
      const ctx = document.getElementById(this.id);

      console.info(this.options);
      this.chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: [],
          datasets: []
        },
        options: this.options
      });
      this.chartInstance.options.animation = false;
    },
    Update(timeList, dataSets) {
      console.info('chart render');
      this.chartInstance.data.labels = timeList;
      this.chartInstance.data.datasets = [];

      dataSets.forEach(dataObj => {
        this.chartInstance.data.datasets.push({
          label: dataObj.label,
          data: dataObj.data,
          backgroundColor: "",
          borderColor: dataObj.borderColor ? dataObj.borderColor : 'blue',
          borderWidth: dataObj.borderWidth ? dataObj.borderWidth : 1,
          fill: false,
          pointStyle: 'none',
          pointRadius: 0, lineTension: 0,
        })
      })

      //   this.chartInstance.options = this.options;
      this.chartInstance.update();

    }
  },
  mounted() {
    this.ChartInit();
  },
  created() {
  }
}
</script>
<style >
</style>