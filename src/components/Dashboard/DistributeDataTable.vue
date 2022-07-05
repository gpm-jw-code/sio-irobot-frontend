<template >
  <div class="p-1 text-white">
    <h3 class="font-weight-bold mt-2">-GROUPS-</h3>
    <transition name="el-fade-in">
      <div class="group-button-container" v-show="groupsShow">
        <b-button
          class="m-1"
          size="lg"
          squared
          @click="changeGroup(item)"
          v-for="item in List_GroupName"
          :key="item"
          :variant="GetGroupButtonStyle(item)"
        >{{ item }}</b-button>
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
      </div>
    </transition>
    <transition name="el-zoom-in-bottom">
      <div class="footer-content" v-if="showFootPanel">
        <b-row>
          <b-col cols="2" class="text-left pl-3">
            <b-button-group class="font-weight-bold">
              <b-button class="font-weight-bold" variant="info" squared>{{ selectedCell.rowName }}</b-button>
              <b-button class="font-weight-bold" variant="dark" squared>{{ selectedCell.column }}</b-button>
            </b-button-group>
          </b-col>
          <b-col cols="1"></b-col>
          <b-col cols="2" class="threshold-reg text-left" v-loading="tresholdValueLoading">
            <b-row cols="2" no-gutters>
              <b-col class="text-right pr-4 thres-title">OOC閥值</b-col>
              <b-col class="oo-style ooc-style">
                <span
                  class="threval"
                  @click="ShowTresSettingDialog('OOC', selectOOCThresval)"
                  v-b-tooltip.hover
                  title="點一下進行設定"
                >{{ selectOOCThresval }}</span>
              </b-col>
              <b-col class="text-right pr-4 thres-title">OOS閥值</b-col>
              <b-col class="oo-style oos-style">
                <span
                  class="threval"
                  @click="ShowTresSettingDialog('OOS', selectOOSThresval)"
                  v-b-tooltip.hover
                  title="點一下進行設定"
                >{{ selectOOSThresval }}</span>
              </b-col>
            </b-row>
          </b-col>
          <b-col>
            <b-button
              id="reset-alarm-button"
              variant="danger"
              block
              :disabled="!Resetable || this.$userInfo.level == 0"
              @click="ResetAlarmHandle"
            >
              <span v-if="this.$userInfo.level != 0">RESET ALARM</span>
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
      @hide="thresSettingDialogShow = false"
    ></threshold-setting-dialog-vue>
  </div>
</template>
<script>
import "vue-good-table/dist/vue-good-table.css";
import ThresholdSettingDialogVue from "../ThresholdSettingDialog.vue";
import { VueGoodTable } from "vue-good-table";
import {
  GroupSettingWSConnect,
  SensorRawDataWsConnect,
  getThresholdSetting,
  ResetAlarm,
} from "../../web-api/Distribution_Host";

export default {
  components: {
    VueGoodTable,
    ThresholdSettingDialogVue,
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
      List_GroupName: [],
      Dict_GroupButtonStyles: {},
      Dict_GroupDataRows: Object,
      dataRows: [],
      columns: [],
      columnsOptions: [],
      nowGroupName: "",
      groupInfoWS: WebSocket,
      rawDataWS: WebSocket,
      StatusMap: {},

      showFootPanel: false,
      selectedCell: {
        rowName: "",
        column: "",
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
          backgroundColor: "black",
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
      userInfo: {}
    };
  },
  computed: {},
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
        this.UpdateSelectedThresDisplay();
        this.selectedKey = this.nowGroupName + this.selectedCell.rowName + this.selectedCell.column;

        var statusObj = this.StatusMap[this.selectedKey];
        if (statusObj !== undefined) {
          statusObj.border = this.selectStyle.selected.border;
          statusObj.padding = this.selectStyle.selected.padding;
        }
        this.showFootPanel = true;
      }, 100);
    },
    ShowTresSettingDialog(type, oriVal) {
      this.thresHoldSettingOptions.settingFor.thresType = type;
      this.thresHoldSettingOptions.settingFor.originVal = oriVal;
      this.thresHoldSettingOptions.sensor = {
        groupName: this.nowGroupName,
        rowName: this.selectedCell.rowName,
        field: this.selectedCell.column,
      };
      this.thresSettingDialogShow = true;
    },
    async UpdateSelectedThresDisplay() {
      this.tresholdValueLoading = true;
      var returnData = await getThresholdSetting(
        this.nowGroupName,
        this.selectedCell.rowName,
        this.selectedCell.column
      );
      if (returnData == null) {
        this.$message.error(`${this.selectedCell.rowName}  ${this.selectedCell.column} 閥值資訊下載失敗`);
        this.selectOOCThresval = 'known';
        this.selectOOSThresval = 'known';
      } else {

        var ThresholdSetting = JSON.parse(returnData);
        this.selectOOCThresval = ThresholdSetting["OOC"].toFixed(3);
        this.selectOOSThresval = ThresholdSetting["OOS"].toFixed(3);
      }
      this.tresholdValueLoading = false;
    },
    CloseFootPanel() {
      this.showFootPanel = false;
      if (this.selectedKey != "") {
        var statusObj = this.StatusMap[this.selectedKey];
        if (statusObj !== undefined) {
          statusObj.border = this.selectStyle.unselected.border;
          statusObj.padding = this.selectStyle.unselected.padding;
        }
        this.selectedKey = "";
      }
    },
    async ResetAlarmHandle() {
      var ok = await this.ShowConfirmMsgBox();
      if (!ok) return;

      var result = await ResetAlarm(
        this.nowGroupName,
        this.selectedCell.rowName,
        this.selectedCell.column
      );
      console.info(`Reset alarm : ${this.selectedCell}`, result);
      // this.showFootPanel = false;
      if (result.toUpperCase() == 'OK') {
        this.$message.info(`已清除 ${this.selectedCell.rowName}  ${this.selectedCell.column} 的Alarm`);
        var key = this.selectedKey + "";
        this.StatusMap[this.selectedKey].backgroundColor = this.statusStyle.normal.backgroundColor;
        this.selectedKey = -1;
        setTimeout(() => {
          this.selectedKey = key;
        }, 300);
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
      this.groupInfoWS = "network_error";
      while (this.groupInfoWS == "network_error") {
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
        this.nowGroupName = groupName;
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
        this.Dict_GroupButtonStyles[group] = group == activeGroup ? 'warning' : 'light'
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
    }
  },
  async mounted() {
    this.WebSocketConnect();
    this.RawDataWSConnect();
    setTimeout(() => {
      this.groupsShow = true;
    }, 500);
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
<style scoped>
:root {
  --footer-height: 30px;
}
body {
  padding: 0;
  margin: 0;
}
h3 {
  letter-spacing: 0.2em;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.footer-content {
  position: fixed;
  bottom: 0;
  width: 100%;
  line-height: var(--footer-height);
  background: #343a40;
  box-shadow: 10px 10px 22px 10px black;
  color: rgb(255, 255, 255);
}

.group-button-container {
  background-color: rgb(12, 12, 23, 0.3);
  border: 1px dashed rgb(199, 199, 199);
  padding: 20px;
  margin: auto 15px;
}

#reset-alarm-button {
  height: 100%;
}

.threshold-reg {
  color: black;
  background-color: #2c3e50;
  border: 1px solid rgb(185, 185, 185);
  margin: 2px;
  border-radius: 5px;
}

.thres-title {
  color: rgb(255, 255, 255);
}

.oo-style {
  text-decoration: underline;
}

.table-container {
  overflow-y: auto;
}
</style>