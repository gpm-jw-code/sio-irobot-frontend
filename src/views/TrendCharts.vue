<template>
  <transition name="el-fade-in-linear">
    <div class="trend-charts">
      {{$route.params.eqid}} - {{$route.params.field}}
      <b-row>
        <b-col lg="9">
          <b-row>
            <b-col lg="6" class="stard-time-regin mb-3 text-left">
              START
              <b-row>
                <b-col lg="6">
                  <b-form-datepicker id="start-datepicker" v-model="condition.QuStart" class="mb-2"></b-form-datepicker>
                </b-col>
                <b-col lg="6">
                  <b-form-timepicker v-model="condition.QuStart_Time" locale="en"></b-form-timepicker>
                </b-col>
              </b-row>
            </b-col>
            <b-col lg="6" class="end-time-regin mb-3 text-left">
              END
              <b-row>
                <b-col lg="6">
                  <b-form-datepicker id="end-datepicker" v-model="condition.QuEnd" class="mb-2"></b-form-datepicker>
                </b-col>
                <b-col lg="6">
                  <b-form-timepicker v-model="condition.QuEnd_Time" locale="en"></b-form-timepicker>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </b-col>
        <b-col lg="3" class="text-right pr-4">
          <b-icon-filter scale="3" v-b-toggle.filter-sidebar></b-icon-filter>
        </b-col>
      </b-row>

      <b-row no-gutters>
        <b-col lg="2">
          <b-input placeholder="關鍵字查詢"></b-input>
        </b-col>
        <b-col cols="3" class="text-left">
          <b-button squared id="query-button" variant="primary">查詢</b-button>
        </b-col>
      </b-row>
      <el-divider></el-divider>
      <!--圖表區-->
      <div>
        <div class="text-left" v-for="eqid in filter.robotLs" :key="eqid">
          <b-button squared class="ml-1">{{eqid}}</b-button>
          <b-row cols-lg="2">
            <b-col v-for="field in filter.typeLs" :key="field" class="mb-1 text-center" lg>
              <sio-chart-vue :eqid="eqid" :field="field" :oocThresHold="122" :oosThresHold="30"></sio-chart-vue>
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
      parameters: {
        eqid: 0,
        column: {
          field: "",
          label: ""
        }
      },
      condition: {
        IP: null,
        QuStart: null,
        QuEnd: null,
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
      }
    }
  },
  mounted() {
    console.log('mounted');
    this.DisplayModeHandle();
  },
  beforeDestroy() {
    console.log('beforeDestroy');
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
.chart-container {
  background-color: red;
  margin: auto 0;
}
</style>