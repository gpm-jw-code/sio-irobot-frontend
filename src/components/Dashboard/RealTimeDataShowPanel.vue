<template >
  <div id="realtime-data-panel" @click="ModalClick">
    <div class="rt-data-container" id="realtime-data-container">
      <b-row>
        <b-col cols="10" class="text-left pt-2 pl-3 border-bottom">
          <h4>{{selectedCell.rowName}} - {{selectedCell.column}}</h4>
        </b-col>
        <b-col cols="2" class="text-right pr-4 pt-2">
          <b-button variant="danger" pill @click="$emit('Close')">X</b-button>
        </b-col>
      </b-row>
      <div style="height:90%;margin-top: 3px;">
        <GPMChart
          class="pr-3 pl-1"
          ref="chart"
          style="height:100%; margin:0;border: none;"
          :title="groupName"
        ></GPMChart>
      </div>
    </div>
  </div>
</template>
<script>

import GPMChart from '../Chart/GPMChart.vue'

export default {
  components: {
    GPMChart,
  },
  props: {
    groupName: {
      type: String,
      default: "GroupName"
    },
    selectedCell: {
      type: Object,
      default() {
        return {
          column: 'col',
          rowName: 'row name',
          newestData: {
            time: 'undefined',
            value: undefined
          }
        }
      }
    },
  },
  data() {
    return {
      lastDataKey: ""
    }
  },
  watch: {
    selectedCell: {
      handler: function (newValue, oldValue) {
        if (newValue.column == undefined | oldValue.column == undefined)
          return;
        var key = ((newValue.column + newValue.rowName));
        if (key !== this.lastDataKey) {
          this.ClearChart();
        }
        this.RenderChart();
        this.lastDataKey = key;
      },
      deep: true
    }
  },
  methods: {
    ModalClick(e) {
      if (e.target.id == "realtime-data-panel") {
        this.$emit('Close');
      }
    },
    RenderChart() {
      if (this.selectedCell.newestData == undefined)
        return;

      var time = this.selectedCell.newestData.time;
      var dataSets = [{
        label: `${this.selectedCell.rowName}-${this.selectedCell.column}`,
        data: this.selectedCell.newestData.value,
        borderColor: 'gold',
        borderWidth: 3
      }]
      this.$refs.chart.FeedData(time, dataSets)
    },
    ClearChart() {

      this.$refs.chart.Clear();
    }

  },
}

</script>
<style >
#realtime-data-panel {
  position: fixed;
  height: 100vh;
  width: 100%;
  top: 0px;
  z-index: 2002;
  background-color: rgba(0, 0, 0, 0.77);
}

#realtime-data-container {
  background-color: rgba(255, 255, 255, 0.9);
  color: black;
  height: 78%;
  width: 90%;
  margin: 0 auto;
  padding: 0;
  top: 80px;
  position: relative;
  border-radius: 10px;
  border-bottom: 10px solid #171717;
}
.rt-data-container h4 {
  letter-spacing: 2px;
  padding: 10px;
}
</style>