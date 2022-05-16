<template >
  <div class="sio-chart ml-1">
    {{eqid}}-{{field}}
    <reactive-chart :height="250" :chartData="chartDataSet"></reactive-chart>
    <!-- <button id="oos" class="oo-button">oos</button>
    <button id="ooc" class="oo-button">ooc</button>-->
  </div>
</template>
<script>
import ReactiveChart from '../Chart/ReaactiveChart.vue'
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
      chartDataSet: {
        labels: ["1", "2", "3", "4", "5", "6",],
        datasets: [
          {
            label: this.field,
            borderColor: "rgba(215, 22, 192, 1)",
            backgroundColor: "rgba(215, 22, 192, 1)",
            data: [1, 39,],
          },
          {
            label: "OOS",
            borderColor: "#6262f9",
            backgroundColor: "#6262f9",
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
  /* border-radius: 5px; */
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