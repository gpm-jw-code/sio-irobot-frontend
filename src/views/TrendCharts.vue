<template>
  <div class="trend-charts">
    {{$route.params.eqid}} - {{$route.params.field}}
    <b-row>
      <b-col lg="9">
        <b-row>
          <b-col lg="6" class="stard-time-regin mb-3 text-left">
            <b-row>
              <b-col lg="6">
                <b-form-datepicker id="start-datepicker" v-model="condition.QuStart" class="mb-2"></b-form-datepicker>
              </b-col>
              <b-col lg="6">
                <b-form-timepicker v-model="condition.QuStart_Time" locale="en"></b-form-timepicker>
              </b-col>
            </b-row>
          </b-col>
          <b-col cols="1" class="mb-3 text-center">To</b-col>
          <b-col lg="5" class="end-time-regin mb-3 text-left">
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

    <b-sidebar id="filter-sidebar" right backdrop>
      <filter-vue></filter-vue>
    </b-sidebar>
  </div>
</template>

<script>
import filterVue from '../components/Trend/filter.vue';
export default {
  components: {
    filterVue,
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
    }
  },
  mounted() {
    console.log('mounted');
  },
  beforeDestroy() {
    console.log('beforeDestroy');
  }
}
</script>

<style>
.trend-charts {
  padding: 10px;
}
#query-button {
  width: 100px;
}
</style>