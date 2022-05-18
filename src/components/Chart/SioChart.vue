<template >
  <div class="sio-chart ml-1">
    <b-row no-gutters class="text-right">
      <!-- <b-col cols="10 pl-5">{{eqid}}-{{field}}</b-col> -->
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
      ref="chart"
      :options="chartOptions"
      :series="series"
      v-observe-visibility="visibilityChanged"
    ></apexchart>
  </div>
</template>
<script>
import ThresholdSettingDialogVue from '../ThresholdSettingDialog.vue';
import moment from 'moment';
export default {
  components: { ThresholdSettingDialogVue },
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

  },
  data() {
    return {
      timer: undefined,
      ooSettingModalShow: false,
      isVisible: false,
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
          height: 250,
          animations: {
            enabled: false,
            animateGradually: {
              enabled: false,
            },
            dynamicAnimation: {
              enabled: false,
            },
          },
          background: 'rgb(51,51,51)',
          foreColor: '#fff',
          toolbar: {
            show: false,
          }
        },
        title: {
          text: 'Apex Chart Demo',
          align: 'left',
          style: {
            fontSize: '16px',
            fontWeight: 'bold',
            fontFamily: undefined,
            color: '#fff'
          },
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
            }
          }
        },
        yaxis: {
          labels: {
            formatter: (value) => {
              return value.toFixed(2);
            },
          }, title: {
            text: ""
          }
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
        }
      },
      series: [{
        name: "series",
        data: [123, 12, 233]
      }],
      ThresHolds: {
        OOS: -1,
        OOC: -1
      },
      lastData: -1,
      lastDataTime: -1,
      renderKey: "",
    }
  },
  computed: {
    id() {
      return `${this.eqid}${this.field}`
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
      this.$refs["chart"].updateOptions(this.chartOptions);

    },
    ChangeOOCData(val) {
      this.ThresHolds.OOC = val;
      this.chartOptions.annotations.yaxis[0].y = val;
      this.$refs["chart"].updateOptions(this.chartOptions);

    }
  },
  mounted() {
    this.chartOptions.title.text = `${this.eqid}-${this.field}`;
    this.thresHoldSettingOptions.sensor = { eqid: this.eqid, field: this.field }
    this.$refs["chart"].updateOptions(this.chartOptions);
    var that = this;
    this.timer = setInterval(async () => {
      if (this.isVisible) {
        await that.Sleep(1);
        var obj = that.$caches.realTimeDataCaches[`${that.eqid}${that.field}`];
        that.series[0].data = obj.data;
        that.chartOptions.xaxis.categories = obj.time;
        that.chartOptions.annotations.yaxis[2].y = obj.data.at(-1);
        that.chartOptions.annotations.yaxis[2].label.text = obj.data.at(-1).toFixed(3);
        that.$refs["chart"].updateOptions(that.chartOptions);
        that.$refs["chart"].updateSeries(that.series);
      }
    }, 1000);
  },
  destroyed() {
    clearInterval(this.timer);
    console.log('sio-chart-destroyed', this.eqid);
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
  height: 300px;
  border: 1px solid rgb(126, 126, 126);
  /* border-radius: 15px; */
  border-end-start-radius: 6px;
  border-end-end-radius: 6px;
  border-top-right-radius: 6px;
  padding: 10px;
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