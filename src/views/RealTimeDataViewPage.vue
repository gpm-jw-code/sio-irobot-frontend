<template >
  <div class="pt-3">
    <h1>REAL-TIME VIEWER</h1>
    <div class="rt-chart-container">
      <GPMChartVue class="h-100" ref="chart" id="rt-chart" :title="ChartOptions.title"></GPMChartVue>
    </div>
  </div>
</template>
<script>
import GPMChartVue from '../components/Chart/GPMChart.vue'
import moment from 'moment';
export default {
  components: {
    GPMChartVue,
  },
  data() {
    return {
      ChartOptions: {
        title: 'T-'
      }
    }
  },
  computed: {
    chart() {
      return this.$refs.chart;
    }
  },
  mounted() {

    /**測試 */
    setInterval(() => {
      var timestr = moment(Date.now()).format('yyyy/MM/DD HH:mm:ss')
      var data = moment(Date.now()).millisecond() / 10.0;
      var data2 = moment(Date.now()).millisecond() / 60.0;

      this.chart.FeedData(timestr, [{
        data: data,
        label: 'data',
        borderColor: 'gold',
        borderWidth: 3
      }, {
        data: data2,
        label: 'data2',
        borderColor: 'red',
        borderWidth: 3
      }])
    }, 1000);
  }
}
</script>

<style >
.rt-chart-container {
  height: 400px;
  margin: 10px;
}
</style>