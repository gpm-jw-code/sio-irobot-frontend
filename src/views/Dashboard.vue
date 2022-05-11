<template>
  <div class="dashboard">
    <div class="text-left pt-3 pb-2">
      <b-button @click="GenFakeData">更新一次</b-button>
      <b-button @click="Test">測試</b-button>
    </div>
    <vue-good-table
      :columns="columns"
      :rows="RobotDatas"
      @on-row-dblclick="onRowDoubleClick"
      @on-cell-click="onCellClick"
    >
      <template slot="table-row" slot-scope="props">
        <div
          class="inner-val"
          v-bind:style="StatusMap[props.formattedRow['eqid']+props.column.field]"
          style="height: 100%; margin: 0;  cursor: pointer;"
        >{{props.formattedRow[props.column.field]}}</div>
      </template>
    </vue-good-table>
  </div>
</template>

<script>
// import the styles
import 'vue-good-table/dist/vue-good-table.css'
import { VueGoodTable } from 'vue-good-table';

export default {
  data() {
    return {
      doubleClickedParameter: {
        eqid: 0,
        column: {
          field: "",
          label: ""
        }
      },
      columns: [

      ],
      RobotDatas: [
        { eqid: 1, name: "John", age: 20, createdAt: '', score: 0.03343 },
      ],
      StatusMap: {

      },
      statusStyle: {
        normal: {
          backgroundColor: 'white',
          color: 'black'
        }, out_of_spec: {
          backgroundColor: 'blue',
          color: 'white'
        }, out_of_control: {
          backgroundColor: 'red',
          color: 'white'
        }
      }
    }
  },
  components: {
    VueGoodTable,
  },
  methods: {
    GenFakeData() {
      this.RobotDatas = [];
      for (var i = 0; i < 10; i++) {
        var rnd = Math.random();
        this.RobotDatas.push({
          eqid: 'Robot-' + i,
          vac_upper_arm: rnd * 1.2,
          vac_lower_arm: rnd * 0.23,
          x_axis_torge: rnd,
          x_axis_motor_temp: 1 + rnd

        });
      }
    },
    GenStatusMap() {
      this.RobotDatas.forEach(rb => {
        this.StatusMap[rb.eqid + "vac_upper_arm"] = this.statusStyle.normal;
        this.StatusMap[rb.eqid + "vac_lower_arm"] = this.statusStyle.normal;
        this.StatusMap[rb.eqid + "x_axis_torge"] = this.statusStyle.normal;
        this.StatusMap[rb.eqid + "x_axis_motor_temp"] = this.statusStyle.normal;
      })
    },
    onRowDoubleClick() {
      var eqid = this.doubleClickedParameter.eqid;
      var field = this.doubleClickedParameter.column.field;
      this.$router.push(`/trend-charts/${eqid}/${field}`);
    },
    onCellClick(params) {
      console.log(params);
      this.doubleClickedParameter.column = params.column;
      this.doubleClickedParameter.eqid = this.RobotDatas[params.rowIndex].eqid;
    },
    Test() {
      var obj = {
        eqid: 'Robot-5',
        field: 'vac_upper_arm'
      }
      this.StatusMap[`${obj.eqid}${obj.field}`] = this.statusStyle.out_of_spec;
    },
    AlarmState(p1) {
      console.log(p1);
    },
  },
  mounted() {
    //TODO GET columns from backend
    this.columns = [{
      label: 'EQ ID',
      field: 'eqid',
    }, {
      label: '上手臂VAC',
      field: 'vac_upper_arm',
    }, {
      label: '下手臂VAC',
      field: 'vac_lower_arm',
    }, {
      label: 'X軸扭力',
      field: 'x_axis_torge',
    }, {
      label: 'X軸馬達溫度',
      field: 'x_axis_motor_temp',
    }];

    this.GenFakeData();
    this.GenStatusMap();

    setInterval(() => {
      for (let index = 0; index < 10; index++) {
        this.RobotDatas[index].vac_upper_arm = Math.random().toFixed(3);
        this.RobotDatas[index].vac_lower_arm = Math.random().toFixed(3);
        this.RobotDatas[index].x_axis_motor_temp = Math.random().toFixed(3);
        this.RobotDatas[index].x_axis_torge = Math.random().toFixed(3);

        this.StatusMap[`${this.RobotDatas[index].eqid}vac_upper_arm`] = this.statusStyle.out_of_spec;
        this.StatusMap[`${this.RobotDatas[index].eqid}x_axis_torge`] = this.statusStyle.out_of_control;
      }
    }, 200);
  }
}
</script>

<style>
.dashboard {
  background-color: white;
}

.normal {
  background: white;
  color: black;
}

.out-of-control {
  background: red;
}

.out-of-spec {
  background: blue;
}

.out-of-control,
.out-of-spec {
  color: white;
}

.inner-val {
  padding: 10px;
}

table.vgt-table td {
  padding: 0;
  vertical-align: top;
  border-bottom: 1px solid #dcdfe6;
  color: #606266;
}
</style>