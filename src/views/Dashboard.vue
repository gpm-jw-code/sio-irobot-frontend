<template>
  <div class="dashboard">
    <div class="robot-idms-switch-container text-center pt-4 pl-1">
      <b-button
        pill
        class="mr-2 type-switch-btn"
        :variant="!idms_dt_show? 'primary':'secondary'"
        @click="idms_dt_show=false"
      >ROBOT數據</b-button>
      <b-button
        class="type-switch-btn"
        pill
        :variant="idms_dt_show? 'primary':'secondary'"
        @click="idms_dt_show=true"
      >振動訊號</b-button>
    </div>
    <el-divider></el-divider>
    <IDMSDataTable v-show="idms_dt_show" :renderPause="!idms_dt_show"></IDMSDataTable>
    <div
      v-show="!idms_dt_show"
      id="robot-data-table"
      v-loading="controlCenterWSErr"
      element-loading-text="網路異常"
    >
      <div class="text-left pt-2 pl-2" @click="CloseFootPanel">
        <b-row>
          <b-col>
            <b-button class="legend-btn" squared size="sm" variant="light">正常</b-button>
            <b-button class="legend-btn" squared size="sm" variant="primary">OOC</b-button>
            <b-button class="legend-btn" squared size="sm" variant="danger">OOS</b-button>
          </b-col>
          <b-col class="text-right">
            <b-button class="mr-2" variant="danger" size="sm" @click="ResetAllAlarmHandle">清除所有警報</b-button>
          </b-col>
        </b-row>
      </div>
      <vue-good-table
        class="p-2"
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

      <!-- <transition name="el-fade-in-linear">
      <div v-show="showFootPanel" class="threshold-info-panel">fff</div>
      </transition>-->
      <transition name="el-zoom-in-bottom">
        <div v-show="showFootPanel" class="foot-panel">
          <b-row>
            <b-col cols="2" class="text-left pl-3">
              <b-button-group>
                <b-button variant="dark" squared>{{selectedCell.eqid}}</b-button>
                <b-button variant="light" squared>{{selectedCell.column.label}}</b-button>
              </b-button-group>
            </b-col>
            <b-col cols="3" class="text-left threshold-region-foot">
              <b-row cols="2" no-gutters>
                <b-col class="text-right pr-4">OOC閥值</b-col>
                <b-col class="ooc-style">
                  <span
                    class="threval"
                    @click="ShowTresSettingDialog('OOC',selectOOCThresval)"
                    v-b-tooltip.hover
                    title="點一下進行設定"
                  >{{selectOOCThresval}}</span>
                </b-col>
              </b-row>
              <b-row cols="2" no-gutters>
                <b-col class="text-right pr-4">OOS閥值</b-col>
                <b-col class="oos-style">
                  <span
                    class="threval"
                    @click="ShowTresSettingDialog('OOS',selectOOSThresval)"
                    v-b-tooltip.hover
                    title="點一下進行設定"
                  >{{selectOOSThresval}}</span>
                </b-col>
              </b-row>
            </b-col>
            <b-col>
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
            <b-col class="text-right">
              <b-button variant="danger" v-b-tooltip.hover title="關閉(ESC)" @click="CloseFootPanel">X</b-button>
            </b-col>
          </b-row>
        </div>
      </transition>

      <threshold-setting-dialog-vue
        :show="thresSettingDialogShow"
        :options="thresHoldSettingOptions"
        @onSuccess="ThresHoldSetSuccessHandle"
        @hide="thresSettingDialogShow=false"
      ></threshold-setting-dialog-vue>
    </div>
  </div>
</template>

<script>
// import the styles
import 'vue-good-table/dist/vue-good-table.css'
import ThresholdSettingDialogVue from '../components/ThresholdSettingDialog.vue';
import { VueGoodTable } from 'vue-good-table';
import { ResetAlarm, GetEQIDList, GetFieldList, SensorRawDataWsConnect } from '../web-api/Distribution_Host'
import IDMSDataTable from '../components/Dashboard/IDMSDataTable.vue';
export default {
  components: {
    VueGoodTable, ThresholdSettingDialogVue, IDMSDataTable
  },
  data() {
    return {
      controlCenterWSErr: true,
      idms_dt_show: false,
      websocket_sensorData: WebSocket,
      newestRawDataObject: {},
      RawDataStorage: {},
      userInfo: {
        userName: 'visitor',
        level: 0
      },
      Resetable: false,
      showFootPanel: false,
      thresSettingDialogShow: false,
      renderKey: 0,
      selectedKey: "",
      selectedCell: {
        eqid: 0,
        column: {
          field: "",
          label: ""
        }
      },
      selectOOCThresval: -1,
      selectOOSThresval: -1,
      columns: [

      ],
      RobotDatas: [{},],
      StatusMap: {},
      statusStyle: {
        normal: {
          // backgroundColor: 'rgb(71, 124, 71)',
          backgroundColor: 'black',
          color: 'white'
        },
        out_of_spec: {
          backgroundColor: '#d51919', //藍色
          color: 'white'
        },
        out_of_control: {
          backgroundColor: '#6262f9', //紅色
          color: 'white'
        }
      },
      selectStyle: {
        selected: {
          border: "4px solid gold",
          padding: "6px"
        },
        unselected: {
          border: ""
        }
      },
      thresHoldSettingOptions: {
        settingFor: {
          thresType: "OOS",
          originVal: -1
        },
        sensor: {
          eqid: "",
          field: ""
        },

      }
    }
  },
  methods: {
    CreateColumns() {
      this.columns = [{
        label: 'EQ ID',
        field: 'eqid',
      }];
      this.$dataInfo.fields.forEach(element => {
        element.label = element.label == null ? element.field + "" : element.label;
        this.columns.push(element);
      });
    },
    async GenRobotDatas() {
      this.RobotDatas = [];
      console.log(this.$dataInfo.fields);
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
      this.UpdateSelectedThresDisplay();
      this.renderKey = Date.now();
      this.showFootPanel = true;
      this.Resetable = this.StatusMap[this.selectedKey][1].backgroundColor != this.statusStyle.normal.backgroundColor;
    },
    ShowTresSettingDialog(type, oriVal) {
      this.thresHoldSettingOptions.settingFor.thresType = type;
      this.thresHoldSettingOptions.settingFor.originVal = oriVal;
      this.thresHoldSettingOptions.sensor = { eqid: this.selectedCell.eqid, field: this.selectedCell.column.field }
      this.thresSettingDialogShow = true;

    },
    ThresHoldSetSuccessHandle(val) {
      if (this.thresHoldSettingOptions.settingFor.thresType == "OOC")
        this.selectOOCThresval = val;
      else
        this.selectOOSThresval = val;
    },
    UpdateSelectedThresDisplay() {
      console.info(this.$caches.thresholdsDataCaches);
      let thresMap = this.$caches.thresholdsDataCaches[this.selectedKey]
      this.selectOOCThresval = thresMap[this.selectedCell.column.field + '_OOC'];
      this.selectOOSThresval = thresMap[this.selectedCell.column.field + '_OOS'];
    },
    CloseFootPanel() {
      var state = this.StatusMap[this.selectedKey];
      if (!state)
        return;
      state[0] = this.selectStyle.unselected;
      this.showFootPanel = false;
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
    StoreDataInQueue(key, data) {
      var queueList = this.RawDataStorage[key];
      if (!queueList) this.RawDataStorage[key] = [];
      this.RawDataStorage[key].push(data);
      if (this.RawDataStorage[key].length > 30) {
        this.RawDataStorage[key].splice(0, 1);
      }
    },
    StoreDataInCache(sensorkey, timeList, valueList) {

      if (!this.$caches.realTimeDataCaches[sensorkey])
        this.$caches.realTimeDataCaches[sensorkey] = { time: [], data: [] };

      var obj = this.$caches.realTimeDataCaches[sensorkey];
      var dataLen = valueList.length;
      if (obj.time.length > 0) {
        var lastTime = obj.time[obj.time.length - dataLen];//0 1 2 3 , 0 1 2 3
        if (timeList[0] == lastTime)
          return;
      }
      for (let index = 0; index < valueList.length; index++) {
        obj.time.push(timeList[index]);
        obj.data.push(valueList[index]);
      }

      if (obj.time.length > 50) {
        obj.time.splice(0, dataLen);
        obj.data.splice(0, dataLen);
      }
      this.$bus.$emit(sensorkey, obj);
    },


    async HandleWSdata(e) {

      var data = JSON.parse(e.data);
      this.newestRawDataObject = data;
      var roboName = data.SensorName.split('_')[0];
      var robot = this.RobotDatas.find(rd => rd.eqid == roboName);
      if (robot) {
        for (const [key, value] of Object.entries(data.Dict_RawData_WithState)) {
          robot[key] = value.value.toFixed(3);
          var keyOfSensorData = `${robot.eqid}${key}`
          this.$caches.thresholdsDataCaches[keyOfSensorData] = data.Dict_DataThreshold;
          this.StatusMap[keyOfSensorData][1] = value.isOutofSpec ? this.statusStyle.out_of_spec : value.isOutofControl ? this.statusStyle.out_of_control : this.statusStyle.normal;
        }

        for (const [key, value] of Object.entries(data.Dict_ListRawData)) {
          robot[key] = value[value.length - 1].toFixed(3);
          var keyOfSensorData2 = `${robot.eqid}${key}`
          this.StoreDataInCache(keyOfSensorData2, data.List_TimeLog, value);
        }

      }
      else {
        this.$dataInfo.eqidls = await GetEQIDList();
        this.$dataInfo.fields = await GetFieldList();
        this.CreateColumns();
        this.GenRobotDatas();
        this.GenStatusMap();
      }
    },
    async ReconnecWeSocket() {
      console.log('ws closed');
      this.controlCenterWSErr = true;
      this.websocket_sensorData = "network_error";
      while (this.websocket_sensorData == 'network_error') {
        this.websocket_sensorData = await SensorRawDataWsConnect();
      }

      this.controlCenterWSErr = false;
      console.log("ws instance rebuild", this.websocket_sensorData);
      this.websocket_sensorData.onmessage = this.HandleWSdata;
      this.websocket_sensorData.onclose = () => {
        this.ReconnecWeSocket()
      };


    },
    async ResetAllAlarmHandle() {
      if (this.userInfo.level == 0) {
        this.$bvModal.msgBoxOk("權限不足!\r\n若要進行此操作，請先進行登入。", {
          title: "NO PERMISSION"
        }).then(() => {
          this.$router.push(`/login/${this.$route.name}`);
        })
        return;
      }

      var result = await this.$bvModal.msgBoxConfirm("確定要清除所有警報?", {
        title: "CONFIRM"
      }).then((val) => {
        return val
      })
      console.log(result);

      if (result) {
        //TODO backend
        await ResetAlarm({ eqid: 'all', field: 'all' });
      }
    }
  },
  computed: {
    ViewPortHeight() {
      return (window.innerHeight - 150) + "px";
    }
  },
  async mounted() {
    //TODO GET columns from backend
    var EQIDList = "network_error";

    while (EQIDList == "network_error") {
      this.controlCenterWSErr = true;
      EQIDList = await GetEQIDList();
    }

    this.controlCenterWSErr = false;
    if (EQIDList == 'network_error') {
      console.log('network_error');
      return;
    }


    this.$dataInfo.eqidls = EQIDList;
    this.$dataInfo.fields = await GetFieldList();


    this.CreateColumns();
    this.GenRobotDatas();
    this.GenStatusMap();

    this.websocket_sensorData = await SensorRawDataWsConnect();
    this.websocket_sensorData.onmessage = this.HandleWSdata;
    this.websocket_sensorData.onclose = () => {
      this.ReconnecWeSocket()
    };
    this.websocket_sensorData.onerror = (err) => console.log('wserr', err);
    window.addEventListener('keydown', (e) => {
      if (e.key == 'Escape') {
        this.CloseFootPanel();
      }
    })
    // //模擬
    // setInterval(() => {
    //   this.RobotDatas.forEach(d => {
    //     d.vac_upper_arm = Math.random().toFixed(3);
    //     d.vac_lower_arm = Math.random().toFixed(3);
    //     d.x_axis_motor_temp = Math.random().toFixed(3);
    //     d.x_axis_torge = Math.random().toFixed(3);
    //   })
    // }, 1000);
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

<style >
.dashboard {
}

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
.inner-val {
  padding: 10px;
  cursor: pointer;
}
.inner-val:hover {
  padding: 8px;
  border: 2px solid rgb(17, 17, 17);
}

.vgt-table thead th {
  color: white;
  vertical-align: bottom;
  border-bottom: 1px solid #004cff;
  padding-right: 1.5em;
  background: grey;
}

table.vgt-table td {
  padding: 0;
  vertical-align: top;
  background-color: black;
  border-bottom: 1px solid #dcdfe6;
  color: #ffffff;
}
.my-modal {
  height: max-content;
}

.legend-btn {
  width: 60px;
  border: 1px solid black;
}

.ooc-style {
  color: rgb(0, 136, 248);
}
.oos-style {
  color: red;
}
.threshold-region-foot {
  color: white;
}
.threval {
  cursor: pointer;
}
.threval:hover {
  text-decoration: underline;
  font-weight: bold;
}

.type-switch-btn {
  width: 150px;
}
</style>