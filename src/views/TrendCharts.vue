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
                <b-col lg="2" class="pl-2">
                  <b-button variant="primary" size="sm" @click="QueryBtnClickHandle">查詢</b-button>
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
          <b-input size="sm" placeholder="關鍵字查詢" v-model="keywordsInput"></b-input>
        </b-col>
        <b-col cols="3" class="text-left">
          <b-button
            squared
            id="query-button"
            size="sm"
            variant="primary"
            @click="KeyWordQueryHandle"
          >查詢</b-button>
        </b-col>
      </b-row>
      <el-divider></el-divider>
      <!--圖表區-->
      <div id="charts-container">
        <div class="text-left" v-for="eqid in filter.robotLs" :key="eqid">
          <b-button squared class="ml-1">{{eqid}}</b-button>
          <b-row :cols-lg="IsOnlyOneChartDisplay?1:2">
            <b-col v-for="field in filter.typeLs" :key="field" class="mb-1 text-center" lg>
              <sio-chart-vue
                :ref="`sio-chart-${eqid}${field}`"
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
import { Query } from '../web-api/backend';
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
      keywordsInput: ""
    }
  },
  mounted() {
    console.log('mounted');
    this.DisplayModeHandle();
    this.ReloadQueryParamFromLocalStorage();
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
    },
    async QueryBtnClickHandle() {
      this.SaveQueryParmToLocalStorage();
      this.filter.robotLs.forEach(robotId => {
        this.filter.typeLs.forEach(field => {
          var startTime = this.quStartTime;
          var endTime = this.quEndTime;
          var sioChart = this.$refs[`sio-chart-${robotId}${field}`][0];
          setTimeout(() => {
            new Promise(
              function () {
                Query.QuerySensorRawData(startTime, endTime, "SIOIROBOT", robotId, field).then(ret => {
                  sioChart.ChangeToDisplayQueryDataMode();
                  sioChart.UpdateSeries(ret.List_TimeLog, ret.Dict_DataList[field]);
                });
              }
            )
          }, 100);
        });
      })
    },
    SaveQueryParmToLocalStorage() {
      localStorage.setItem('query-condition', JSON.stringify(this.condition));
    },
    ReloadQueryParamFromLocalStorage() {
      var json = localStorage.getItem('query-condition');
      if (json)
        this.condition = JSON.parse(json);
    },
    KeyWordQueryHandle() {
      var eqidShow = [];
      var fieldShow = [];
      for (let index = 0; index < this.keywordsInputSplit.length; index++) {
        const keyword_UpperCase = this.keywordsInputSplit[index].toUpperCase().replaceAll(" ", "");
        this.$dataInfo.eqidls.forEach(eqid => {
          if (eqid.toUpperCase().includes(keyword_UpperCase)) {
            eqidShow.push(eqid);
          }
        })

        this.$dataInfo.fields.forEach(fields => {
          if (fields.field.toUpperCase().includes(keyword_UpperCase)) {
            fieldShow.push(fields.field);
          }
        })
      }

      if (eqidShow.length != 0 && fieldShow.length != 0)
        this.filter.typeLs = fieldShow.concat();
      else
        this.filter.typeLs = this.AllFieldList;

      if (fieldShow.length != 0 && eqidShow == 0) {
        this.filter.typeLs = fieldShow.concat();
        this.filter.robotLs = this.AllEqidList;
      } else
        this.filter.robotLs = eqidShow.concat();
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
    quStartTime() {
      return this.condition.QuStart + " " + this.condition.QuStart_Time;
    },
    quEndTime() {
      return this.condition.QuEnd + " " + this.condition.QuEnd_Time;
    },
    IsOnlyOneChartDisplay() {
      return this.filter.typeLs.length == 1;
    },
    keywordsInputSplit() {
      return this.keywordsInput.split(',')
    },
    AllFieldList() {
      var ls = [];
      this.$dataInfo.fields.forEach(fi => {
        ls.push(fi.field);
      })
      return ls;
    },
    AllEqidList() {
      var ls = [];
      this.$dataInfo.eqidls.forEach(eqid => {
        ls.push(eqid);
      })
      return ls;
    }
  },
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