<template>
  <div class="pt-4">
    <el-divider></el-divider>
    <h1>圖表元件</h1>
    <b-button @click="UpdateChart" variant="light">更新圖表</b-button>
    <gchart
      ref="gchart"
      id="demo-chart"
      title="圖標題"
      xAxisLabel="X軸 Title"
      yAxisLabel="Y軸 Title"
      style="width:100%;height:400px"
    ></gchart>
    <gchart
      ref="gchart2"
      id="demo-chart2"
      title="圖標題"
      xAxisLabel="X軸 Title"
      yAxisLabel="Y軸 Title"
      style="width:100%;height:400px"
    ></gchart>
    <el-divider></el-divider>
    <h1>Others</h1>
  </div>
</template>
<script>
import gchart from '../components/Chart/GPMChart.vue'
export default {
  components: {
    gchart,
  },
  methods: {
    UpdateChart() {
      var timeList = ['2022/07/05 12:00:00', '2022/07/05 12:00:10',
        '2022/07/05 12:00:20', '2022/07/05 12:00:30'];
      var datasets = [{
        label: "Series-1",
        data: [1, 2, 3, 4],
        borderWidth: 4,
        borderColor: 'lime'
      }]
      this.$refs.gchart.Update(timeList, datasets)
      this.$refs.gchart2.Update(timeList, datasets)
    }
  },
}
</script>
<style>
</style>