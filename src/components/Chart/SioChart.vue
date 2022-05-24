<template >
  <div class="sio-chart ml-1">
    <b-row no-gutters class="text-right">
      <!-- <b-col cols="10 pl-1" class="text-left">{{eqid}}-{{field}}</b-col> -->
      <b-col cols="10" class="text-left">
        <b-button squared variant="light">{{field}}</b-button>
      </b-col>
      <b-col cols="1">
        <b-button
          v-b-tooltip.hover
          title="OOC閥值(點擊設定)"
          block
          squared
          variant="primary"
          size="sm"
          @click="ChangeOOCClickHandle"
        >{{ThresHolds.OOC}}</b-button>
      </b-col>
      <b-col cols="1">
        <b-button
          v-b-tooltip.hover
          title="OOS閥值(點擊設定)"
          block
          squared
          variant="danger"
          size="sm"
          @click="ChangeOOSClickHandle"
        >{{ThresHolds.OOS}}</b-button>
      </b-col>
    </b-row>
    <threshold-setting-dialog-vue
      :show="ooSettingModalShow"
      :options="thresHoldSettingOptions"
      @onSuccess="ThresHoldSetSuccessHandle"
      @hide="ooSettingModalShow=false"
    ></threshold-setting-dialog-vue>
    <apexchart
      v-show="!isPauseRealTimeDataRender"
      ref="chart"
      :options="chartOptions"
      :series="series"
      v-observe-visibility="visibilityChanged"
    ></apexchart>
    <!-- <TradingChartVue v-show="isPauseRealTimeDataRender" :id="queryChartId"></TradingChartVue> -->
    <div class="query-chart" v-show="isPauseRealTimeDataRender">
      <canvas :id="queryChartId"></canvas>
    </div>
  </div>
</template>
<script>
import ThresholdSettingDialogVue from '../ThresholdSettingDialog.vue';
import { createChart } from "lightweight-charts";
import TradingChartVue from './TradingChart.vue';
import Chart from 'chart.js'
import moment from 'moment';
export default {
  components: { ThresholdSettingDialogVue, TradingChartVue },
  props: {
    eqid: String,
    field: String,
    oocThresHold: {
      type: Number,
      default: 0.9
    },
    oosThresHold: {
      type: Number,
      default: 0.3
    },
    dataObj: {
      type: Object,
      default() {
        return {
          time: [],
          data: []
        }
      }
    },
    showQueryData: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    oocThresHold: {
      handler: function (val, old) {
        if (val == old) return;
        this.ChangeOOCData(val);
      },
      immediate: true
    },
    oosThresHold: {
      handler: function (val, old) {
        if (val == old) return;
        this.ChangeOOSData(val);
      }, immediate: true
    },
    showQueryData: {
      handler: function (bval) {
        this.isPauseRealTimeDataRender = bval;

      },
      deep: true,
      immediate: true
    }

  },
  data() {
    return {
      timer: undefined,
      ooSettingModalShow: false,
      isVisible: false,
      isPauseRealTimeDataRender: false,
      thresHoldSettingOptions: {
        settingFor: {
          thresType: "OOS",
          originVal: -1
        },
        sensor: {
          eqid: "",
          field: ""
        },
      },
      thresHoldValSetting: 0,
      chartOptions: {
        dataLabels: {
          enabled: false,
        },
        chart: {
          type: "line",
          height: 270,
          animations: {
            enabled: false,
            animateGradually: {
              enabled: false,
            },
            dynamicAnimation: {
              enabled: false,
            },
          },
          background: 'rgb(255,255,255)',
          foreColor: 'black',
          toolbar: {
            show: false,
          }
        },
        xaxis: {
          categories: [],
          title: {
            text: "Time"
          },
          /**X軸Tick顯示的點數(label數量) */
          tickAmount: 5,
          labels: {
            formatter: function (value) {
              return moment(value).format("HH:mm:ss");
            },
            rotate: 0,
            rotateAlways: false,
            hideOverlappingLabels: true,
            showDuplicates: false,
            trim: false,
            minHeight: undefined,
            maxHeight: 100,
          },
          axisBorder: {
            show: true,
            color: '#78909C',
            height: '1',
            width: '100%',
            offsetX: 0,
            offsetY: 0
          },

        },
        yaxis: {
          labels: {
            formatter: (value) => {
              return value.toFixed(2);
            },
          },
          title: {
            text: "Unit"
          },
          axisBorder: {
            show: true,
            color: '#78909C',
            height: '100%',
            width: '1',
            offsetX: 0,
            offsetY: 0
          },
        },
        stroke: {
          show: true,
          curve: 'straight',
          lineCap: 'square',
          colors: undefined,
          width: 2,
          dashArray: 0,
        },
        annotations: {
          yaxis: [
            {
              y: 1,
              borderColor: 'blue',
              label: {
                borderColor: 'blue',
                style: {
                  color: '#fff',
                  background: 'blue'
                },
                text: 'OOC'
              }
            },
            {
              y: 1,
              borderColor: 'red',
              label: {
                borderColor: 'red',
                style: {
                  color: '#fff',
                  background: 'red'
                },
                text: 'OOS'
              }
            },
            {//最新一筆數據
              y: 1,
              borderColor: 'white',
              label: {
                borderColor: 'white',
                style: {
                  color: 'black',
                  background: 'white'
                },
                text: 'OOS'
              }
            }
          ]
        },
      },
      series: [{
        name: "series",
        data: []
      }],
      ThresHolds: {
        OOS: -1,
        OOC: -1
      },
      lastData: -1,
      lastDataTime: -1,
      renderKey: "",
      querySeries: [],
      QueryData: {
        chart: null,
        lastTimeKey: ''
      }
    }
  },
  computed: {
    id() {
      return `${this.eqid}${this.field}`
    },
    queryChartId() {
      return `query-chart-${this.id}`
    },
    apexChart() {
      return this.$refs["chart"];
    },

  },

  methods: {
    ChangeOOSClickHandle() {
      this.thresHoldSettingOptions.settingFor.thresType = "OOS";
      this.thresHoldSettingOptions.settingFor.originVal = this.ThresHolds.OOS;
      this.ooSettingModalShow = true;
    },
    ChangeOOCClickHandle() {
      this.thresHoldSettingOptions.settingFor.thresType = "OOC";
      this.thresHoldSettingOptions.settingFor.originVal = this.ThresHolds.OOC;
      this.ooSettingModalShow = true;
    },
    visibilityChanged(isVisible, _entry) {
      this.isVisible = isVisible;
    },
    Sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },
    ThresHoldSetSuccessHandle(threshold) {
      this.ooSettingModalShow = false;
      if (this.thresHoldSettingOptions.settingFor.thresType == "OOS")
        this.ChangeOOSData(threshold);
      else
        this.ChangeOOCData(threshold);
    },
    ChangeOOSData(val) {
      this.ThresHolds.OOS = val;
      this.chartOptions.annotations.yaxis[1].y = val;
      if (this.apexChart)
        this.apexChart.updateOptions(this.chartOptions);
      this.UpdateThresLine();
    },
    ChangeOOCData(val) {
      this.ThresHolds.OOC = val;
      this.chartOptions.annotations.yaxis[0].y = val;
      if (this.apexChart)
        this.apexChart.updateOptions(this.chartOptions);
      this.UpdateThresLine();
    },
    async RenderRealTimeData() {
      if (this.isVisible && !this.isPauseRealTimeDataRender) {
        await this.Sleep(1);
        var obj = this.$caches.realTimeDataCaches[`${this.eqid}${this.field}`];
        this.series[0].data = obj.data;
        this.chartOptions.xaxis.categories = obj.time;
        this.chartOptions.annotations.yaxis[2].y = obj.data.at(-1);
        this.chartOptions.annotations.yaxis[2].label.text = obj.data.at(-1).toFixed(3);
        this.$refs["chart"].updateOptions(this.chartOptions);
        this.$refs["chart"].updateSeries(this.series);
      }
    },
    ChangeToDisplayQueryDataMode() {
      this.isPauseRealTimeDataRender = true;
    },
    ChangeToDisplayRealTimeDataMode() {
      this.isPauseRealTimeDataRender = false;
    },

    async UpdateSeries(timeList, dataList, key = '123') {

      if (key == this.QueryData.lastTimeKey)
        return;
      var that = this;
      return new Promise(
        function (resolve) {
          setTimeout(() => {

            that.QueryData.lastTimeKey = key;
            that.QueryData.chart.data.labels = timeList;
            that.QueryData.chart.data.datasets[0].data = that.GenLine(timeList.length, that.ThresHolds.OOS);
            that.QueryData.chart.data.datasets[1].data = that.GenLine(timeList.length, that.ThresHolds.OOC);
            that.QueryData.chart.data.datasets[2].data = dataList;
            that.QueryData.chart.data.datasets[2].label = `${that.field}-(${timeList[0]}~${timeList[timeList.length - 1]})`;
            that.QueryData.chart.update();
            resolve(0);
            console.log('UpdateSeries');
          }, 1);
        }
      )
    },
    UpdateThresLine() {
      if (!this.QueryData.chart) return;
      var ptNum = this.QueryData.chart.data.datasets[2].data.length;
      this.QueryData.chart.data.datasets[0].data = this.GenLine(ptNum, this.ThresHolds.OOS);
      this.QueryData.chart.data.datasets[1].data = this.GenLine(ptNum, this.ThresHolds.OOC);
      this.QueryData.chart.update();
    },
    GenLine(ptNum, value) {
      var ls = [];
      for (let index = 0; index < ptNum; index++) {
        ls.push(value);
      }
      return ls;
    },
    CreateQueryChart() {
      const ctx = document.getElementById(this.queryChartId);
      this.QueryData.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ["水星", "金星", "地球", "火星", "木星", "土星", "天王星", "海王星"],
          datasets: [
            {
              label: "OOS",
              data: [0, 0, 1, 2, 79, 82, 27, 14],
              backgroundColor: "",
              borderColor: "red",
              borderWidth: 1,
              fill: false,
              pointStyle: 'none',
              pointRadius: 0, lineTension: 0,
            },
            {
              label: "OOC",
              data: [0, 0, 1, 2, 79, 82, 27, 14],
              backgroundColor: "",
              borderColor: "blue",
              borderWidth: 1,
              fill: false,
              pointStyle: 'none',
              pointRadius: 0, lineTension: 0,
            }, {
              label: "行星卫星数量",
              data: [0, 0, 1, 2, 79, 82, 27, 14],
              backgroundColor: "",
              borderColor: "#36495d",
              borderWidth: 2,
              fill: false,
              pointStyle: 'none',
              pointRadius: 0, lineTension: 0,
            },
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          lineTension: 0,
          layout: {
            padding: {
              bottom: 20
            }
          },
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  padding: 25
                }
              }
            ],
            xAxes: [{
              type: 'time',
              time: {
                unit: 'second'
              },
              ticks: {
                autoskip: true,
                autoSkipPadding: 130,
                maxRotation: 0,
                minRotation: 0
              },
            }]
          },
        },
      });
      this.QueryData.chart.options.animation = false; // disables all animations

    }
  },
  mounted() {
    this.CreateQueryChart();
    this.thresHoldSettingOptions.sensor = { eqid: this.eqid, field: this.field }
    this.$refs["chart"].updateOptions(this.chartOptions);
    this.timer = setInterval(async () => {
      this.RenderRealTimeData();
    }, 1000);
  },
  destroyed() {
    clearInterval(this.timer);
  }

}
</script>
<style>
:root {
  --oos-vale: 12px;
  --ooc-vale: 32px;
}
.sio-chart {
  width: 100%;
  height: 320px;
  border: 1px solid rgb(126, 126, 126);
  /* border-radius: 15px; */
  border-end-start-radius: 6px;
  border-end-end-radius: 6px;
  border-top-right-radius: 6px;
  padding: 10px;
}

.query-chart {
  /* background-color: red; */
  height: 100%;
  padding: 10px;
  margin: 0 auto;
}

.rchart {
  background-color: rgb(179, 179, 179);
  color: white;
}
.oo-button {
  background-color: red;
  position: absolute;
  left: 200;
}
#oos {
  bottom: var(--oos-vale);
}
#ooc {
  bottom: var(--ooc-vale);
}
</style>