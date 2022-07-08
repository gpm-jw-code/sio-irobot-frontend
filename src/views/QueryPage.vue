<template>
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
              <b-col lg="4" class="pl-2">
                <b-button-group>
                  <b-button
                    class="query-button"
                    variant="primary"
                    size="sm"
                    @click="QueryBtnClickHandle"
                  >查詢</b-button>
                  <b-button
                    class="query-button"
                    variant="info"
                    size="sm"
                    @click="ShowRealTimeHandle"
                  >即時數據</b-button>
                </b-button-group>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-col>
      <b-col lg="3" class="text-right pr-4">
        <b-icon-filter scale="2" v-b-toggle.filter-sidebar variant="info" v-b-tooltip.hover></b-icon-filter>
      </b-col>
    </b-row>

    <b-row no-gutters>
      <b-col lg="2">
        <b-input size="sm" placeholder="關鍵字查詢" v-model="keywordsInput"></b-input>
      </b-col>
      <b-col cols="3" class="text-left">
        <b-button
          squared
          class="query-button"
          size="sm"
          variant="primary"
          @click="KeyWordQueryHandle"
        >查詢</b-button>
      </b-col>
    </b-row>
    <el-divider></el-divider>
    <div
      id="charts-container"
      v-loading="Querying"
      element-loading-text="數據查詢中"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <h3 class="text-left ml-1" @click="filterSideBarShow=true">
        GROUP:
        <u class="font-weight-bold;">{{filter.GroupName}}</u>
      </h3>

      <div v-show="filter.selectedRows.length==0" class="not-selected-div text-center">
        <p class="pt-3">
          <u class="pt-3" style="color:gold;cursor:pointer" @click="filterSideBarShow=true">未選擇感測器</u>
        </p>
      </div>

      <div
        class="text-left mb-2"
        v-for="eqid in AllRowsList"
        :key="eqid"
        v-show="filter.selectedRows.includes(eqid)"
      >
        <b-button pill block size="lg" class="text-left" variant="dark">
          感測器:
          <span style="color:#0069d9">{{eqid}}</span>
        </b-button>
        <div v-show="filter.selectedTypes.length==0" class="not-selected-div text-center">
          <p class="pt-3">
            <u
              class="pt-3"
              style="color:gold;cursor:pointer"
              @click="filterSideBarShow=true"
            >未選擇感測數據類別</u>
          </p>
        </div>
        <div>
          <b-row :ref="eqid+'chart-row'" :cols-lg="IsOnlyOneChartDisplay?1:2">
            <b-col
              v-for="field in AllTypesList"
              :key="field"
              class="ma-0 pa-1 text-center"
              :md="filter.selectedTypes.length==1? 12: 3"
              v-show="filter.selectedTypes.includes(field)"
            >
              <GPMChartVue
                :ref="`chart-${eqid}-${field}`"
                class="ma-0"
                v-bind:style="{height: filter.selectedTypes.length==1 && filter.selectedRows.length==1? '550px': '350px'}"
                :id="eqid+field"
                :title="field"
              ></GPMChartVue>
              <!-- <sio-chart-vue
              :ref="`sio-chart-${eqid}${field}`"
              :id="`scv-${eqid}${field}`"
              :eqid="eqid"
              :field="field"
              :oocThresHold="OOCThresHoldValue(eqid,field)"
              :oosThresHold="OOSThresHoldValue(eqid,field)"
              :showQueryData="!isShowRealTimeData"
              ></sio-chart-vue>-->
            </b-col>
          </b-row>
        </div>
      </div>
      <!-- 
        <div class="text-left" v-for="eqid in filter.selectedRows" :key="eqid">
          <b-button squared class="ml-1">{{eqid}}</b-button>
          <b-row :cols-lg="IsOnlyOneChartDisplay?1:2">
            <b-col v-for="field in filter.selectedTypes" :key="field" class="mb-1 text-center" lg>
              <sio-chart-vue
                :ref="`sio-chart-${eqid}${field}`"
                :id="`scv-${eqid}${field}`"
                :eqid="eqid"
                :field="field"
                :oocThresHold="OOCThresHoldValue(eqid,field)"
                :oosThresHold="OOSThresHoldValue(eqid,field)"
                :showQueryData="!isShowRealTimeData"
              ></sio-chart-vue>
            </b-col>
          </b-row>
          <el-divider></el-divider>
      </div>-->
    </div>
    <b-sidebar
      id="filter-sidebar"
      z-index="2022"
      right
      backdrop
      width="500px"
      :visible="filterSideBarShow"
      @change="(v)=> filterSideBarShow=v"
    >
      <filter-vue
        ref="filter"
        :GroupModel="GroupModel"
        :SensorInfosModel="SensorInfosModel"
        @groupsSelectedOnChange="ChangeSelectedGroupName"
        @rowSelectedOnchange="RobotLsOnchange"
        @sensorTypeSelectedOnchange="TypeLsOnchange"
        @statusSelectedOnchange="RobotLsOnchange"
      ></filter-vue>
    </b-sidebar>
  </div>
</template>

<script>
import filterVue from '../components/Trend/filter.vue';
import SioChartVue from '../components/Chart/SioChart.vue';
import { QueryAll } from '../web-api/Query';
import { GetSensorInfo, GetGroupModel, } from '../web-api/Distribution_Host'
import moment from 'moment';
import GPMChartVue from '../components/Chart/GPMChart.vue';
export default {
  components: {
    filterVue, SioChartVue, GPMChartVue
  },
  data() {
    return {
      nowGroupName: '',
      realtime_ws: undefined,
      isShowRealTimeData: true,
      filterSideBarShow: false,
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
        GroupName: "",
        selectedRows: [],
        selectedTypes: [],
        statusLs: []
      },
      GroupModel: {},
      SensorInfosModel: [],
      keywordsInput: "",
      QueryResult: [],
      Querying: false
    }
  },
  async mounted() {
    console.log('mounted');
    this.DisplayModeHandle();
    this.ReloadQueryParamFromLocalStorage();
    this.$dataInfo.AllSensorInfo = await GetSensorInfo();
    this.GroupModel = await GetGroupModel();
    this.SensorInfosModel = await GetSensorInfo();

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
        this.filter.selectedRow = [this.currentQuery.eqid];
        this.filter.selectedTypes = [this.currentQuery.field];
        this.$refs.filter.SettingSelectedOption(this.currentQuery.eqid, this.currentQuery.field);
      } else {
        // this.$router.push({ path: this.$route.path, query: this.currentQuery });
      }
    },
    ChangeSelectedGroupName(groupName) {
      this.filter.GroupName = groupName;
    },
    RobotLsOnchange(list) {
      list.sort();
      this.filter.selectedRows = list;
      this.RenderQueryData();
    },
    TypeLsOnchange(list) {
      this.filter.selectedTypes = list;
      this.RenderQueryData();
    },

    async RenderQueryData() {
      for (let index = 0; index < this.filter.selectedRows.length; index++) {
        var eqid = this.filter.selectedRows[index];
        for (let index = 0; index < this.filter.selectedTypes.length; index++) {
          var field = this.filter.selectedTypes[index];
          var sioChart = this.$refs[`sio-chart-${eqid}${field}`][0];
          var ret = this.$caches.queryResultCaches.TryGetLastQueryDataFromCache(eqid, field);
          var timekey = this.$caches.queryResultCaches.lastTimeKey
          sioChart.UpdateSeries(ret.List_TimeLog, ret.Dict_DataList[field], timekey);
        }
      }

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

      if (this.filter.GroupName == '' | this.filter.selectedRows.length == 0 | this.filter.selectedTypes.length == 0)
        return;

      this.Querying = true;
      this.QueryResult = await QueryAll(this.quStartTime, this.quEndTime, this.filter.GroupName, this.filter.selectedRows, this.filter.selectedTypes);
      this.QueryResult.forEach(sensorData => {

        var chartKey = `chart-${sensorData.RowName}-${sensorData.SensorType}`;
        var gpmChart = this.$refs[chartKey][0];
        var dataSets = [];
        var dictData = sensorData.QueryData.Dict_DataList;

        var colors = ['blue', 'green', 'red', 'orange', 'pink', 'grey', 'black', 'seagreen']

        var i = 0;

        Object.keys(dictData).forEach(key => {
          if (key !== 'timelog') {
            var dataList = dictData[key];
            dataSets.push({
              label: key,
              data: dataList,
              borderWidth: 2,
              borderColor: colors[i]
            });
            i += 1
          }
        });

        gpmChart.Update(sensorData.QueryData.List_TimeLog, dataSets, true);
      }

      )
      this.Querying = false;
    },
    ShowRealTimeHandle() {
      this.isShowRealTimeData = true;
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
        this.filter.selectedTypes = fieldShow.concat();
      else
        this.filter.selectedTypes = this.AllTypesList;

      if (fieldShow.length != 0 && eqidShow == 0) {
        this.filter.selectedTypes = fieldShow.concat();
        this.filter.selectedRows = this.AllRowsList;
      } else
        this.filter.selectedRows = eqidShow.concat();
    },

    EqBtnClick(eqid) {
      var ele = this.$refs[eqid + "chart-row"][0];
      ele.style.visibility = "hidden";
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
      return this.filter.selectedTypes.length == 1;
    },
    keywordsInputSplit() {
      return this.keywordsInput.split(',')
    },
    AllTypesList() {
      if (this.filter.GroupName == '')
        return [];
      var Types = [];
      this.SensorInfosModel.forEach((element) => {
        if (this.GroupModel[this.filter.GroupName].List_SensorName.includes(element.SensorName)) {
          if (!Types.includes(element.SensorType)) {
            Types.push(element.SensorType);
          }
        }
      });
      return Types;
    },
    AllRowsList() {
      if (this.filter.GroupName == '')
        return [];

      return Object.keys(this.GroupModel[this.filter.GroupName].Dict_RowListSensor);
    }
  },
}
</script>

<style>
.trend-charts {
  padding: 10px;
  height: 100%;
  /* background-color: white;
  color: rgb(36, 36, 36); */
}

.query-button {
  width: 90px;
}

.not-selected-div {
  border: 1px dashed white;
  border-radius: 10px;
  font-size: 23px;
}

#charts-container {
}

#charts-container h3 {
  cursor: pointer;
}
</style>