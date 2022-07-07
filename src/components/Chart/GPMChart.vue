<template>
  <div v-bind:style="chart_style" v-loading="loading">
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
      loading: false,
      chart_style: {
        backgroundColor: '#202020',
        border: '1px solid grey',
        margin: '3px',
        borderRadius: '4px'
      },
      chartInstance: {},
      options: {
        responsive: true,
        maintainAspectRatio: false,
        lineTension: 0,
        tooltips: {
          mode: 'index',
          intersect: true
        },
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
        annotation: {
          drawTime: 'afterDraw',
          annotations: [{
            type: 'line',
            id: 'line',
            mode: 'horizontal',
            scaleID: 'y-axis-0',
            value: 2,
            borderWidth: 2,
            borderColor: 'red'
          }]
        },

      },
      xlabels: [],
      datasets: [],
    }
  },
  methods: {
    ChartInit() {
      const ctx = document.getElementById(this.id);
      this.chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: [],
          datasets: []
        },
        options: this.options,
      });
      this.chartInstance.options.animation = false;
    },
    Update(timeList, dataSetsInput) {
      this.loading = true;
      this.xlabels = timeList;
      this.datasets = [];
      dataSetsInput.forEach(dataObj => {
        this.datasets.push({
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
      setTimeout(() => {
        this.loading = false;
        this.RenderData();
      }, 200);
    },

    FeedData(time, dataSets) {
      if (dataSets.length == 0)
        return;
      if (time == undefined)
        return;

      this.xlabels.push(time);
      dataSets.forEach(dataObj => {
        var series = this.datasets.find(s => s.label == dataObj.label);
        if (series) {
          series.data.push(dataObj.data);
        } else {
          this.datasets.push({
            label: dataObj.label,
            data: [dataObj.data],
            backgroundColor: "",
            borderColor: dataObj.borderColor ? dataObj.borderColor : 'blue',
            borderWidth: dataObj.borderWidth ? dataObj.borderWidth : 1,
            fill: false,
            pointStyle: 'none',
            pointRadius: 0, lineTension: 0,
          })
        }
      })
      this.DataFIFO();
      this.RenderData();
    },
    Clear() {
      this.xlabels = [];
      this.datasets = [];
      this.RenderData();
    },
    RenderData() {
      this.chartInstance.data.labels = this.xlabels;
      this.chartInstance.data.datasets = this.datasets;
      this.chartInstance.update();
    },
    DataFIFO() {
      if (this.xlabels.length > 50) {
        this.xlabels.splice(0, 1);
        this.datasets.forEach(s => {
          s.data.splice(0, 1)
        })
      }
    }
  },
  computed: {
    currentDataSet() {
      var dataAry = [];
      this.chartInstance.data.datasets.forEach(s => {
        dataAry.push(s.data)
      })

      return {
        labels: this.chartInstance.data.labels,
        datas: dataAry
      }
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