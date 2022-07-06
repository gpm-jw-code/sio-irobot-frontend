<template >
  <div
    class="text-white"
    id="distribute-datatable"
    v-loading="groupInfoWS == null"
    element-loading-text="連線中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <h3 class="font-weight-bold mt-2">-GROUPS-</h3>
    <transition name="el-fade-in">
      <div class="group-button-container" v-show="groupsShow">
        <b-button
          class="m-1"
          size="lg"
          pill
          v-for="item in List_GroupName"
          :key="item"
          @click="changeGroup(item)"
          :variant="GetGroupButtonStyle(item)"
        >{{ item }}</b-button>
      </div>
    </transition>

    <transition name="el-zoom-in-top">
      <div id="group-name-display" sticky v-if="groupNameDisplay">
        <!-- GROUP :
        <button class="font-weight-bold">{{nowGroupName}}</button>-->
        <b-form-select
          v-model="selectedGroupName"
          :options="List_GroupName"
          size="lg"
          style="text-align: center"
          @change="()=>changeGroup(selectedGroupName)"
        ></b-form-select>
      </div>
    </transition>

    <el-divider></el-divider>
    <h3 class="font-weight-bold mt-5">-DATA TABLE-</h3>

    <div class="text-left pt-2 pl-3 pr-2">
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

    <transition name="el-fade-in">
      <div class="table-container pl-3 pr-3">
        <vue-good-table
          v-show="tableShow"
          :key="selectedKey"
          :columns="columns"
          :fixed-header="true"
          :sort-options="{ enabled: false }"
          :rows="dataRows"
          @on-cell-click="onCellClick"
        >
          <template slot="table-row" slot-scope="props">
            <div
              :key="props.formattedRow[props.column.field]"
              v-b-tooltip.hover
              title
              v-bind:style="StatusMap[nowGroupName + props.formattedRow['RowName'] + props.column.field]"
              class="inner-val"
            >{{ props.formattedRow[props.column.field] }}</div>
          </template>
        </vue-good-table>
        <div style="height:80px"></div>
      </div>
    </transition>

    <DashboardFooter
      :showFootPanel="showFootPanel"
      :nowGroupName="nowGroupName"
      :selectedCell="selectedCell"
      @AlarmResetDone="AlarmResetDoneHandle"
      @onClose="FootCloseHandle"
      @ShowRealTimeDataButnOnClick="()=>showRealTimePanel = true"
    ></DashboardFooter>

    <threshold-setting-dialog-vue
      :show="thresSettingDialogShow"
      :options="thresHoldSettingOptions"
      @onSuccess="ThresHoldSetSuccessHandle"
      @hide="thresSettingDialogShow = false"
    ></threshold-setting-dialog-vue>

    <transition name="el-fade-in">
      <RealTimeDataShowPanel
        v-show="showRealTimePanel"
        :groupName="nowGroupName"
        :selectedCell="selectedCell"
        @Close="showRealTimePanel=false"
      ></RealTimeDataShowPanel>
    </transition>
  </div>
</template>
<script>
import "vue-good-table/dist/vue-good-table.css";
import ThresholdSettingDialogVue from "../ThresholdSettingDialog.vue";
import { VueGoodTable } from "vue-good-table";
import DashboardFooter from './DashboardFooter.vue'
import RealTimeDataShowPanel from './RealTimeDataShowPanel.vue'
import {
  GroupSettingWSConnect,
  SensorRawDataWsConnect,
  ResetAlarm,
} from "../../web-api/Distribution_Host";

export default {
  components: {
    VueGoodTable, ThresholdSettingDialogVue, DashboardFooter, RealTimeDataShowPanel
  },
  props: {
    groupInfo: Object,
    renderPause: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      style_str: "color:red",
      tableShow: false,
      groupsShow: false,
      tresholdValueLoading: true,
      showRealTimePanel: false,
      List_GroupName: [],
      Dict_GroupButtonStyles: {},
      Dict_GroupDataRows: Object,
      dataRows: [],
      columns: [],
      columnsOptions: [],
      nowGroupName: "",
      selectedGroupName: "known",
      groupInfoWS: null,
      rawDataWS: null,
      StatusMap: {},

      showFootPanel: false,
      selectedCell: {
        rowName: "",
        column: "",
        newestData: {
          time: undefined,
          value: undefined
        }
      },
      selectedKey: "",
      thresSettingDialogShow: false,
      selectOOCThresval: -1,
      selectOOSThresval: -1,
      Resetable: true,
      thresHoldSettingOptions: {
        settingFor: {
          thresType: "OOS",
          originVal: -1,
        },
        sensor: {
          eqid: "",
          field: "",
        },
      },
      statusStyle: {
        normal: {
          // backgroundColor: 'rgb(71, 124, 71)',
          backgroundColor: "#171717",
          color: "white",
          border: "",
          padding: "",
        },
        out_of_spec: {
          backgroundColor: "#d51919", //紅色
          color: "white",
          border: "",
          padding: "",
        },
        out_of_control: {
          backgroundColor: "rgb(0,105,217)", //屎黃色
          color: "white",
          border: "",
          padding: "",
        },
      },
      selectStyle: {
        selected: {
          border: "4px solid gold",
          padding: "6px",
        },
        unselected: {
          border: "",
        },
      },
      userInfo: {},
      groupNameDisplay: false,

    };
  },
  computed: {
    FixDataRows() {
      return [this.dataRows[0]]
    }
  },
  methods: {
    GetGroupButtonStyle(group) {
      var style = this.Dict_GroupButtonStyles[group];
      return style == undefined ? 'dark' : style;
    },
    async onCellClick(params) {
      if (params.column.field == "RowName") return;

      Object.keys(this.StatusMap).forEach(key => {
        this.StatusMap[key].border = "";
        this.StatusMap[key].padding = "";
      });

      this.showFootPanel = false;
      setTimeout(async () => {
        this.selectedCell.column = params.column.field;
        this.selectedCell.rowName = params.row.RowName;
        this.selectedKey = this.nowGroupName + this.selectedCell.rowName + this.selectedCell.column;
        var statusObj = this.StatusMap[this.selectedKey];
        if (statusObj !== undefined) {
          statusObj.border = this.selectStyle.selected.border;
          statusObj.padding = this.selectStyle.selected.padding;
        }
        this.showFootPanel = true;
      }, 100);
    },
    CloseFootPanel() {
      this.showFootPanel = false;
    },
    AlarmResetDoneHandle() {
      this.$message.info(`已清除 ${this.selectedCell.rowName}  ${this.selectedCell.column} 的Alarm`);
      var key = this.selectedKey + "";
      this.StatusMap[this.selectedKey].backgroundColor = this.statusStyle.normal.backgroundColor;
      this.selectedKey = -1;
      setTimeout(() => {
        this.selectedKey = key;
      }, 300);
    },
    FootCloseHandle() {
      if (this.selectedKey != "") {
        var statusObj = this.StatusMap[this.selectedKey];
        if (statusObj !== undefined) {
          statusObj.border = this.selectStyle.unselected.border;
          statusObj.padding = this.selectStyle.unselected.padding;
        }
        this.selectedKey = "";
        this.selectedCell.rowName = undefined;
        this.selectedCell.column = undefined;
      }
    },
    async ResetAllAlarmHandle() {
      if (this.$userInfo.level == 0) {
        this.$bvModal.msgBoxOk("權限不足!\r\n若要進行此操作，請先進行登入。", {
          title: "NO PERMISSION"
        }).then(() => {
          this.$router.push(`/login/${this.$route.name}`);
        })
        return;
      }

      var result = await this.$bvModal.msgBoxConfirm(`確定要清除${this.nowGroupName}所有警報?`, {
        title: "CONFIRM"
      }).then((val) => {
        return val
      })
      console.log(result);

      if (result) {
        await ResetAlarm(this.nowGroupName, 'All', 'All');
      }
    },
    async ShowConfirmMsgBox() {
      return await this.$bvModal
        .msgBoxConfirm(
          `確定要清除 ${this.selectedCell.rowName}-${this.selectedCell.column} 異常?`,
          {
            title: "異常清除",
            // size: 'sm',
            // buttonSize: 'sm',
            okVariant: "primary",
            okTitle: "YES",
            cancelTitle: "NO",
            footerClass: "p-2",
            hideHeaderClose: false,
            centered: true,
          }
        )
        .then((value) => {
          return value;
        })
        .catch(() => {
          // An error occurred
        });
    },
    ThresHoldSetSuccessHandle(val) {
      if (this.thresHoldSettingOptions.settingFor.thresType == "OOC")
        this.selectOOCThresval = val;
      else this.selectOOSThresval = val;
    },
    async WebSocketConnect() {
      this.groupInfoWS = null;
      while (this.groupInfoWS == null) {
        this.groupInfoWS = await GroupSettingWSConnect();
      }
      this.groupInfoWS.onmessage = (e) => this.GroupWsDataHandle(e);
      this.groupInfoWS.onclose = () => {
        this.WebSocketConnect();
      };
    },
    GroupWsDataHandle(e) {
      console.log("receiveGroupData");
      var data = JSON.parse(e.data);
      this.$dataInfo.Dict_GroupSetting = data;
      this.List_GroupName = Object.keys(data);
      this.Dict_GroupDataRows = new Object();
      this.List_GroupName.forEach((eachGroupName) => {
        this.Dict_GroupDataRows[eachGroupName] = [];
        var AllColumnNames =
          this.$dataInfo.Dict_GroupSetting[eachGroupName].List_AllColumnName;
        var rowNames = Object.keys(
          this.$dataInfo.Dict_GroupSetting[eachGroupName].Dict_RowListSensor
        );
        rowNames.forEach((eachRowName) => {
          var NewRowObject = new Object();
          AllColumnNames.forEach((columnName) => {
            var NewDataName = columnName.replace(" ", "_").replace(".", "_");
            NewRowObject[NewDataName] = "";
          });
          NewRowObject["RowName"] = eachRowName;
          this.Dict_GroupDataRows[eachGroupName].push(NewRowObject);
        });
      });
      if (this.nowGroupName === "") {
        if (this.List_GroupName.length != 0)
          this.changeGroup(this.List_GroupName[0]);
      }
    },
    changeButtonColor(groupName) {
      if (this.nowGroupName === groupName) return "danger";
      return "success";
    },
    changeGroup(groupName) {
      if (this.nowGroupName === groupName) return;
      this.RenderGroupButtonsStyle(groupName);

      this.tableShow = false;
      setTimeout(() => {
        this.tableShow = true;
        this.columns = [];
        this.nowGroupName = this.selectedGroupName = groupName;
        var I = 0;
        this.columns.push({
          label: "RowName",
          text: "RowName",
          field: "RowName",
          value: "RowName",
          index: I,
        });
        this.$dataInfo.Dict_GroupSetting[groupName].List_AllColumnName.forEach(
          (columname) => {
            var NewDataName = columname.replace(" ", "_").replace(".", "_");
            I += 1;
            var NewColumnInfo = {
              label: columname,
              text: NewDataName,
              field: NewDataName,
              value: NewDataName,
              index: I,
            };
            this.columns.push(NewColumnInfo);
          }
        );
        this.dataRows = this.Dict_GroupDataRows[groupName];
        this.CloseFootPanel();

      }, 200);

    },
    RenderGroupButtonsStyle(activeGroup) {
      var I = 0;
      this.Dict_GroupButtonStyles = {};
      this.List_GroupName.forEach(group => {
        this.Dict_GroupButtonStyles[group] = group == activeGroup ? 'info' : 'light'
      });
      this.$dataInfo.Dict_GroupSetting[activeGroup].List_AllColumnName.forEach(
        (columname) => {
          var NewDataName = columname.replace(" ", "_").replace(".", "_");
          I += 1;
          var NewColumnInfo = {
            label: columname,
            text: NewDataName,
            field: NewDataName,
            value: NewDataName,
            index: I,
          };
          this.columns.push(NewColumnInfo);
        }
      );
    },
    async RawDataWSConnect() {
      this.rawDataWS = "network_error";
      while (this.rawDataWS == "network_error") {
        this.rawDataWS = await SensorRawDataWsConnect();
      }
      console.info('CT Raw Data WS Connected');
      this.rawDataWS.onmessage = (e) => this.RawDataHandle(e);
      this.rawDataWS.onclose = () => {
        this.RawDataWSConnect();
      };
    },
    RawDataHandle(e) {
      var SensorData = JSON.parse(e.data);
      var sensorName = SensorData.SensorName;
      this.List_GroupName.forEach((EachGroupName) => {
        var NowGroup = this.$dataInfo.Dict_GroupSetting[EachGroupName];
        if (!NowGroup.List_SensorName.includes(sensorName)) return;

        var RowsName = Object.keys(NowGroup.Dict_RowListSensor);
        RowsName.forEach((EachRowName) => {
          if (NowGroup.Dict_RowListSensor[EachRowName].includes(sensorName)) {
            TargetRowName = EachRowName;
          }
          if (TargetRowName === "") return;

          var Dict_RawData = SensorData.Dict_RawData_WithState;
          var DataNames = Object.keys(Dict_RawData);
          this.Dict_GroupDataRows[EachGroupName].forEach((eachRow) => {
            if (eachRow.RowName === TargetRowName) {
              DataNames.forEach((TargetDataName) => {
                var NewDataName = TargetDataName.replace(" ", "_").replace(
                  ".",
                  "_"
                );

                eachRow[NewDataName] = Dict_RawData[TargetDataName].value.toFixed(3);

                //更新被選取cell的最新數值
                if (this.selectedCell.rowName == eachRow.RowName) {
                  console.info(SensorData);
                  this.selectedCell.newestData.time = SensorData.TimeLog;
                  this.selectedCell.newestData.value = Dict_RawData[TargetDataName].value;
                }

                var _style = this.GetAlarmStatesStyle(Dict_RawData, TargetDataName);

                var statusMapkey = EachGroupName + TargetRowName + NewDataName;
                if (this.StatusMap[statusMapkey] == undefined) {
                  this.StatusMap[statusMapkey] = {
                    backgroundColor: 'black',
                    color: 'white',
                    border: "",
                    padding: "",
                    key: -1
                  };
                }

                this.StatusMap[statusMapkey].backgroundColor = _style.backgroundColor;


              });
            }
          });
        });
      });

      if (this.nowGroupName === "") return;
      var NowGroup = this.$dataInfo.Dict_GroupSetting[this.nowGroupName];
      if (!NowGroup.List_SensorName.includes(sensorName)) return;

      var TargetRowName = "";
      var RowsName = Object.keys(NowGroup.Dict_RowListSensor);
      RowsName.forEach((EachRowName) => {
        if (NowGroup.Dict_RowListSensor[EachRowName].includes(sensorName)) {
          TargetRowName = EachRowName;
        }
      });
      if (TargetRowName === "") return;

      var Dict_RawData = SensorData.Dict_RawData_WithState;
      var DataNames = Object.keys(Dict_RawData);
      this.dataRows.forEach((eachRow) => {
        if (eachRow.RowName === TargetRowName) {
          DataNames.forEach((TargetDataName) => {
            var NewDataName = TargetDataName.replace(" ", "_").replace(
              ".",
              "_"
            );
            eachRow[NewDataName] = Dict_RawData[TargetDataName].value.toFixed(3);
          });
        }
      });
    },
    GetAlarmStatesStyle(Dict_RawData, TargetDataName) {

      if (Dict_RawData[TargetDataName].isOutofControl)
        return this.statusStyle.out_of_control;
      if (Dict_RawData[TargetDataName].isOutofSpec)
        return this.statusStyle.out_of_spec;

      return this.statusStyle.normal;
    },
    ShowRealTimeDataHandle(arg) {
      console.info('show realtime data view', arg);
      this.showRealTimePanel = true;
    }

  },
  async mounted() {
    //從後端下載網路配置後再開始websocket連線作業
    this.$bus.$on("network_configs_download_done", () => {
      this.WebSocketConnect();
      this.RawDataWSConnect();
      setTimeout(() => {
        this.groupsShow = true;
      }, 500);
    });

    window.addEventListener("scroll", (event) => {
      this.groupNameDisplay = event.target.scrollTop > 230;
    }, true);

  },
  watch: {
    $userInfo: {
      handler: function (userInfo) {
        console.log('user info change!!!!', userInfo);
        this.userInfo = userInfo;
      },
      deep: true,
      immediate: true
    }
  }
};
</script>
<style >
:root {
  --footer-height: 30px;
}

#distribute-datatable {
  height: 100%;
}

h3 {
  letter-spacing: 0.2em;
}

.group-button-container {
  background-color: rgb(12, 12, 23, 0.3);
  border: 1px dashed rgb(199, 199, 199);
  padding: 20px;
  margin: auto 15px;
}

.group-btn-badge {
}

.table-container {
  overflow-y: auto;
}

.inner-val:hover {
  padding: 8px;
  border: 2px solid rgb(17, 17, 17);
}

.vgt-table thead th {
  color: black;
  vertical-align: bottom;
  border-bottom: 1px solid #004cff;
  padding-right: 1.5em;
  background: rgb(255, 255, 255);
}

table.vgt-table td {
  padding: 0;
  vertical-align: top;
  background-color: #171717;
  border-bottom: 1px solid #dcdfe6;
  color: #ffffff;
}

.inner-val {
  padding: 10px;
  cursor: pointer;
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
  font-size: 20px;
}
#group-name-display {
  font-size: 30px;
  background-color: white;
  color: black;
  position: absolute;
  width: 100%;
  z-index: 40;
  top: 60px;
  padding: 10px;
}
</style>