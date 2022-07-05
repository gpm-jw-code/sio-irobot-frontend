<template>
  <div class="dashboard" v-show="showOut">
    <transition name="el-zoom-in-bottom">
      <div class="robot-idms-switch-container text-center pt-4 pl-1">
        <b-button
          squared
          size="lg"
          class="mr-2 type-switch-btn"
          :variant="!idms_dt_show? 'info':'secondary'"
          @click="idms_dt_show=false"
        >分散式系統</b-button>
        <b-button
          class="type-switch-btn"
          squared
          size="lg"
          :variant="idms_dt_show? 'info':'secondary'"
          @click="idms_dt_show=true"
        >振動訊號</b-button>
      </div>
    </transition>
    <el-divider></el-divider>
    <IDMSDataTable v-show="idms_dt_show" :renderPause="!idms_dt_show"></IDMSDataTable>
    <transition name="el-fade-in">
      <DistributeTable v-show="!idms_dt_show"></DistributeTable>
    </transition>
  </div>
</template>

<script>
// import the styles
import 'vue-good-table/dist/vue-good-table.css'
import ThresholdSettingDialogVue from '../components/ThresholdSettingDialog.vue';
import { VueGoodTable } from 'vue-good-table';
import IDMSDataTable from '../components/Dashboard/IDMSDataTable.vue';
import DistributeTable from '../components/Dashboard/DistributeDataTable.vue'

export default {
  components: {
    VueGoodTable, ThresholdSettingDialogVue, IDMSDataTable, DistributeTable
  },
  data() {
    return {
      showOut: false,
      controlCenterWSErr: true,
      idms_dt_show: false,
      userInfo: {
        userName: 'visitor',
        level: 0
      },

    }
  },
  async mounted() {
    this.showOut = true;
  },
  watch: {
    $userInfo: {
      handler: function (userInfo) {
        this.userInfo = userInfo;

      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style >
.foot-panel {
  width: 100%;
  bottom: 0;
  height: 58px;
  border: 1px solid rgb(101, 102, 102);
  padding-top: 8px;
  box-shadow: 12px 12px 32px 12px black;
  /* border-top-left-radius: 10px; */
}
.threshold-info-panel,
.foot-panel {
  position: fixed;
  background-color: rgb(52, 58, 64);
}
.threshold-info-panel {
  right: 0;
  top: 120px;
  width: 300px;
  z-index: 200000;
  opacity: 0.8;
  color: white;
}
</style>