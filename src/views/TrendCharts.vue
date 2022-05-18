<template>
  <transition name="el-fade-in-linear">
    <div class="trend-charts">
      <!-- {{$route.params.eqid}} - {{$route.params.field}} -->
      <b-row class="mt-2">
        <b-col lg="9">
          <b-row no-gutters>
            <b-col md="4" class="stard-time-regin mb-3 text-left">
              <b>START</b>
              <b-row no-gutters>
                <b-col lg="6">
                  <b-input v-model="condition.QuStart" size="sm" class="mb-2" type="date"></b-input>
                  <!-- <b-form-datepicker id="start-datepicker" v-model="condition.QuStart" class="mb-2"></b-form-datepicker> -->
                </b-col>
                <b-col lg="6">
                  <b-input v-model="condition.QuStart_Time" size="sm" locale="en" type="time"></b-input>
                  <!-- <b-form-timepicker v-model="condition.QuStart_Time" locale="en"></b-form-timepicker> -->
                </b-col>
              </b-row>
            </b-col>
            <b-col md="6" class="end-time-regin mb-3 text-left">
              <b>END</b>
              <b-row no-gutters>
                <b-col lg="4">
                  <b-input v-model="condition.QuEnd" size="sm" class="mb-2" type="date"></b-input>
                  <!-- <b-form-datepicker id="end-datepicker" v-model="condition.QuEnd" class="mb-2"></b-form-datepicker> -->
                </b-col>
                <b-col lg="4">
                  <b-input v-model="condition.QuEnd_Time" size="sm" locale="en" type="time"></b-input>
                  <!-- <b-form-timepicker v-model="condition.QuEnd_Time" locale="en"></b-form-timepicker> -->
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </b-col>
        <b-col lg="3" class="text-right pr-4">
          <b-icon-filter
            scale="2"
            v-b-toggle.filter-sidebar
            variant="info"
            v-b-tooltip.hover
            title="過濾器"
          ></b-icon-filter>
        </b-col>
      </b-row>

      <b-row no-gutters>
        <b-col lg="2">
          <b-input size="sm" placeholder="關鍵字查詢"></b-input>
        </b-col>
        <b-col cols="3" class="text-left">
          <b-button squared id="query-button" size="sm" variant="primary">查詢</b-button>
        </b-col>
      </b-row>
      <el-divider></el-divider>
      <!--圖表區-->
      <div id="charts-container">
        <div class="text-left" v-for="eqid in filter.robotLs" :key="eqid">
          <b-button squared class="ml-1">{{eqid}}</b-button>
          <b-row cols-lg="2">
            <b-col v-for="field in filter.typeLs" :key="field" class="mb-1 text-center" lg>
              <sio-chart-vue
                :id="`scv-${eqid}${field}`"
                :eqid="eqid"
                :field="field"
                :oocThresHold="OOCThresHoldValue(eqid,field)"
                :oosThresHold="OOSThresHoldValue(eqid,field)"
              ></sio-chart-vue>
            </b-col>
          </b-row>
          <el-divider></el-divider>
        </div>
      </div>
      <b-sidebar id="filter-sidebar" right backdrop>
        <filter-vue
          @robotSelectedOnchange="RobotLsOnchange"
          @sensorTypeSelectedOnchange="TypeLsOnchange"
          @statusSelectedOnchange="RobotLsOnchange"
        ></filter-vue>
      </b-sidebar>
    </div>
  </transition>
</template>

<script>
import filterVue from '../components/Trend/filter.vue';
import SioChartVue from '../components/Chart/SioChart.vue';
export default {
  components: {
    filterVue, SioChartVue
  },
  data() {
    return {
      realtime_ws: undefined,
      parameters: {
        eqid: 0,
        column: {
          field: "",
          label: ""
        }
      },
      condition: {
        IP: null,
        QuStart: "2022-03-03",
        QuEnd: "2022-03-04",
        QuStart_Time: "00:00:00",
        QuEnd_Time: "00:00:00",
      },
      currentQuery: {
        eqid: "",
        field: "",
        realtime: true
      },
      filter: {
        robotLs: [],
        typeLs: [],
        statusLs: []
      },
    }
  },
  mounted() {
    console.log('mounted');
    this.DisplayModeHandle();
  },
  beforeDestroy() {
    console.log('beforeDestroy');
    this.realtime_ws.close();
  },

  methods: {
    DisplayModeHandle() {
      console.log('DisplayModeHandle');
      if (this.$route.query.eqid) {
        this.currentQuery = this.$route.query;
        console.log(this.currentQuery);
        this.filter.robotLs = [this.currentQuery.eqid];
        this.filter.typeLs = [this.currentQuery.field];
      } else {
        // this.$router.push({ path: this.$route.path, query: this.currentQuery });
      }
    },
    RobotLsOnchange(list) {
      this.filter.robotLs = list;
    }, TypeLsOnchange(list) {
      this.filter.typeLs = list;
    },
    GetOOS(eqid, field) {
      console.log(eqid, field);
      return 1;
    },
    GetOOC(eqid, field) {
      console.log(eqid, field);
      return 2;
    },
    OOCThresHoldValue(eqid, field) {
      if (!field || !field)
        return 999;
      return this.$caches.thresholdsDataCaches[`${eqid}${field}`][`${field}_OOC`];
    },
    OOSThresHoldValue(eqid, field) {
      if (!field || !field)
        return 999;
      return this.$caches.thresholdsDataCaches[`${eqid}${field}`][`${field}_OOS`];
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        if (route.path !== '/trend-charts')
          return;
        if (route.query) {
          this.DisplayModeHandle();
        }
      }
    }
  },
  computed: {
    realTimeDataCaches(redkey) {
      console.log(this.$caches.realTimeDataCaches);
      console.log(redkey);
      return this.$caches.realTimeDataCaches[redkey];
    },
  }
}
</script>

<style>
.trend-charts {
  padding: 10px;
  background-color: white;
  color: rgb(36, 36, 36);
}

#query-button {
  width: 120px;
}
#charts-container {
}
</style>