<template>
  <div class="dashboard">
    <div v-if="false" class="text-left pt-3 pb-2" @click="CloseFootPanel">
      <b-button @click="GenFakeData">更新一次</b-button>
      <b-button @click="Test">測試</b-button>
    </div>
    <vue-good-table
      :columns="columns"
      :rows="RobotDatas"
      @on-cell-click="onCellClick"
      :max-height="ViewPortHeight"
      :fixed-header="true"
      :sort-options="{enabled:false}"
    >
      <template slot="table-row" slot-scope="props">
        <div
          v-b-tooltip.hover
          title
          @dblclick="onRowDoubleClick"
          :key="renderKey"
          class="inner-val"
          v-bind:style="StatusMap[props.formattedRow['eqid']+props.column.field]"
        >{{props.formattedRow[props.column.field]}}</div>
      </template>
    </vue-good-table>

    <transition name="el-zoom-in-bottom">
      <div v-show="showFootPanel" class="foot-panel">
        <b-row>
          <b-col sm="4" class="text-left pl-2">
            <b-button-group>
              <b-button variant="dark" pill>{{selectedCell.eqid}}</b-button>
              <b-button variant="light" pill>{{selectedCell.column.label}}</b-button>
            </b-button-group>
          </b-col>
          <b-col sm="4">
            <b-button
              variant="light"
              block
              :disabled="(!Resetable||userInfo.level==0)"
              @click="ResetAlarmHandle"
            >
              <span v-if="userInfo.level!=0">RESET ALARM</span>
              <span v-else>(LEVEL 0 禁止 RESET ALARM)</span>
            </b-button>
          </b-col>
          <b-col class="text-right" sm="4">
            (ESC)
            <b-button variant="danger" @click="CloseFootPanel">X</b-button>
          </b-col>
        </b-row>
      </div>
    </transition>
  </div>
</template>

<script>
// import the styles
import 'vue-good-table/dist/vue-good-table.css'
import { VueGoodTable } from 'vue-good-table';
import { ResetAlarm } from '../web-api/backend'
export default {
  data() {
    return {
      userInfo: {
        userName: 'visitor',
        level: 0
      },
      Resetable: false,
      showFootPanel: false,
      renderKey: 0,
      selectedKey: "",
      selectedCell: {
        eqid: 0,
        column: {
          field: "",
          label: ""
        }
      },
      columns: [

      ],
      RobotDatas: [{},],
      StatusMap: {},
      statusStyle: {
        normal: {
          // backgroundColor: 'rgb(71, 124, 71)',
          backgroundColor: 'rgb(71, 124, 91)',
          color: 'rgb(71, 124, 71)'
        },
        out_of_spec: {
          backgroundColor: '#6262f9',
          color: 'white'
        },
        out_of_control: {
          backgroundColor: '#d51919',
          color: 'white'
        }
      },
      selectStyle: {
        selected: {
          border: "2px solid gold",
          padding: "8px"
        },
        unselected: {
          border: ""
        }
      }
    }
  },
  components: {
    VueGoodTable,
  },
  methods: {
    GenRobotDatas() {
      this.RobotDatas = [];
      this.$dataInfo.eqidls.forEach(eqid => {
        var dataMap = {};
        dataMap['eqid'] = eqid;
        this.$dataInfo.fields.forEach(field => {
          var rnd = Math.random();
          dataMap[field.field] = rnd;
        })
        this.RobotDatas.push(dataMap);
      })
    },
    GenStatusMap() {
      this.RobotDatas.forEach(rb => {
        this.$dataInfo.fields.forEach(field => {
          this.StatusMap[rb.eqid + field.field] = [this.selectStyle.unselected, this.statusStyle.normal];
        })
      })
    },
    onRowDoubleClick() {
      var eqid = this.selectedCell.eqid;
      var field = this.selectedCell.column.field;
      this.$router.push({ path: '/trend-charts', query: { eqid: eqid, field: field, realtime: true } });
    },
    onCellClick(params) {
      // console.log(params);
      if (params.column.field == 'eqid')
        return;
      if (this.selectedKey != "")
        this.StatusMap[this.selectedKey][0] = this.selectStyle.unselected;
      this.selectedCell.column = params.column;

      this.selectedCell.eqid = this.RobotDatas[params.rowIndex].eqid;
      this.selectedKey = this.selectedCell.eqid + this.selectedCell.column.field;
      this.StatusMap[this.selectedKey][0] = this.selectStyle.selected;
      this.renderKey = Date.now();
      this.showFootPanel = true;

      this.Resetable = this.StatusMap[this.selectedKey][1].backgroundColor != this.statusStyle.normal.backgroundColor;
    },
    CloseFootPanel() {
      this.StatusMap[this.selectedKey][0] = this.selectStyle.unselected;
      this.showFootPanel = false;
    },
    Test() {
      var obj = {
        eqid: 'Robot-5',
        field: 'vac_upper_arm'
      }
      this.StatusMap[`${obj.eqid}${obj.field}`][1] = this.statusStyle.out_of_spec;
      this.renderKey = Date.now();
    },
    BGclick() {
      console.log("GBC");
    },
    async ResetAlarmHandle() {
      var ok = await this.ShowConfirmMsgBox();
      if (!ok) return;
      //TODO backend reset alarm
      await ResetAlarm({
        eqid: this.selectedCell.eqid,
        field: this.selectedCell.column.field
      });
    },
    async ShowConfirmMsgBox() {
      return await this.$bvModal.msgBoxConfirm(`確定要清除 ${this.selectedCell.eqid}-${this.selectedCell.column.label} 異常?`, {
        title: '異常清除',
        // size: 'sm',
        // buttonSize: 'sm',
        okVariant: 'primary',
        okTitle: 'YES',
        cancelTitle: 'NO',
        footerClass: 'p-2',
        hideHeaderClose: false,
        centered: true
      })
        .then(value => {
          return value;
        })
        .catch(() => {
          // An error occurred
        })
    },
  },
  computed: {
    ViewPortHeight() {
      return (window.innerHeight - 150) + "px";
    }
  },
  mounted() {
    //TODO GET columns from backend

    this.columns = [{
      label: 'EQ ID',
      field: 'eqid',
    }]
    this.$dataInfo.fields.forEach(element => {
      this.columns.push(element);
    });

    this.GenRobotDatas();
    this.GenStatusMap();

    window.addEventListener('keydown', (e) => {
      if (e.key == 'Escape') {
        this.CloseFootPanel();
      }
    })
    //模擬
    setInterval(() => {
      this.RobotDatas.forEach(d => {
        d.vac_upper_arm = Math.random().toFixed(3);
        d.vac_lower_arm = Math.random().toFixed(3);
        d.x_axis_motor_temp = Math.random().toFixed(3);
        d.x_axis_torge = Math.random().toFixed(3);
      })
    }, 1000);
  },
  watch: {
    $userInfo: {
      handler: function (userInfo) {
        this.userInfo = userInfo;
        console.log('user info change', userInfo);
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style>
.dashboard {
  background-color: white;
  color: black;
}

.foot-panel {
  background-color: rgb(52, 58, 64);
  position: fixed;
  width: 100%;
  bottom: 0;
  height: 40px;
  border: 1px solid rgb(52, 58, 64);
  /* border-top-left-radius: 10px; */
}

.inner-val {
  padding: 10px;
  cursor: pointer;
}
.inner-val:hover {
  padding: 8px;
  border: 2px solid rgb(17, 17, 17);
}

table.vgt-table td {
  padding: 0;
  vertical-align: top;
  border-bottom: 1px solid #dcdfe6;
  color: #606266;
}
.my-modal {
  height: max-content;
}
</style>