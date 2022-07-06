<template >
  <div id="realtime-data-panel" @click="ModalClick">
    <div class="text-right pr-5 pt-5">
      <b-button variant="danger" pill @click="$emit('Close')">X</b-button>
    </div>
    <div class="rt-data-container" id="realtime-data-container">
      <h4>{{selectedCell.rowName}} - {{selectedCell.column}}</h4>
      <div style="height:92%">
        <GPMChart ref="chart" style="height:100%" :title="groupName"></GPMChart>
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
  top: 50px;
  position: relative;
}
.rt-data-container h4 {
  letter-spacing: 2px;
  padding: 10px;
}
</style>