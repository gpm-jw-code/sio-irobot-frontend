<template >
  <div class="sio-chart ml-1">
    <b-row no-gutters>
      <b-col cols="10 pl-5">{{eqid}}-{{field}}</b-col>
      <b-col cols="1">
        <b-button
          v-b-tooltip.hover
          title="OOC閥值(點擊設定)"
          block
          squared
          variant="primary"
          size="sm"
          @click="ChangeOOC"
        >{{oocThresHold}}</b-button>
      </b-col>
      <b-col cols="1">
        <b-button
          v-b-tooltip.hover
          title="OOS閥值(點擊設定)"
          block
          squared
          variant="danger"
          size="sm"
          @click="ChangeOOS"
        >{{oosThresHold}}</b-button>
      </b-col>
    </b-row>
    <b-modal
      size="sm"
      v-model="ooSettingModalShow"
      @ok="SettingThres"
      title="Threshold Value"
      cancel-title="取消"
    >
      {{settingWhatText}} 閥值設定 :
      <el-input-number step="0.01" size="small" v-model="thresHoldValSetting"></el-input-number>
    </b-modal>
    <reactive-chart :height="250" :chartData="chartDataSet"></reactive-chart>
    <!-- <button id="oos" class="oo-button">oos</button>
    <button id="ooc" class="oo-button">ooc</button>-->
  </div>
</template>
<script>
import ReactiveChart from '../Chart/ReaactiveChart.vue'
import { ThresHoldSetting } from '../../web-api/backend'
export default {
  components: { ReactiveChart },
  props: {
    eqid: String,
    field: String,
    oocThresHold: {
      type: Number,
      default: -1
    },
    oosThresHold: {
      type: Number,
      default: -1
    },
  },
  data() {
    return {
      ooSettingModalShow: false,
      settingWhatText: "OOS",
      thresHoldValSetting: 0,
      chartDataSet: {
        labels: ["1", "2", "3", "4", "5", "6",],
        datasets: [
          {
            label: this.field,
            borderColor: "black",
            backgroundColor: "black",
            data: [1, 39,],
          },
          {
            label: "OOS",
            borderColor: "blue",
            backgroundColor: "blue",
            data: [3, 3, 3, 3, 3, 3],
            borderWidth: 1
          },
          {
            label: "OOC",
            borderColor: "#d51919",
            backgroundColor: "#d51919",
            data: [1, 1, 1, 1, 1, 1, 1,],
            borderWidth: 1
          },
        ]

      }
    }
  },
  watch: {
    oocThresHold: {
      handler: function (val, old) {
        if (val == old) return;
        this.chartDataSet.datasets[2].data = [];
        for (let index = 0; index < this.chartDataSet.labels.length; index++) {
          this.chartDataSet.datasets[2].data.push(val);
        }
        document.documentElement.style.setProperty('--ooc-vale', (val + 30) + "px");
      },
      immediate: true
    },
    oosThresHold: {
      handler: function (val, old) {
        if (val == old) return;
        this.chartDataSet.datasets[1].data = [];
        for (let index = 0; index < this.chartDataSet.labels.length; index++) {
          this.chartDataSet.datasets[1].data.push(val);
        }
        document.documentElement.style.setProperty('--oos-vale', (val) + "px");
      }, immediate: true
    }
  },
  methods: {
    ChangeOOS() {
      this.ooSettingModalShow = true;
      this.settingWhatText = "OOS";
      this.thresHoldValSetting = this.oosThresHold;
    },
    ChangeOOC() {
      this.ooSettingModalShow = true;
      this.settingWhatText = "OOC";
      this.thresHoldValSetting = this.oocThresHold;
    },
    SettingThres() {
      if (this.settingWhatText == "OOS") {
        //TODO Call api
        ThresHoldSetting.SetOOS(`${this.eqid}${this.field}`, this.thresHoldValSetting);
      } else {
        //TODO Call api
        ThresHoldSetting.SetOOC(`${this.eqid}${this.field}`, this.thresHoldValSetting);
      }
    }
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