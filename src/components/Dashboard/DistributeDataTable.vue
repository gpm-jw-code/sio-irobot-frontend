<template >
  <div class="p-1">
    <b class="mr-3 ml-1">顯示項目</b>
    <b-form-checkbox-group :options="columnsOptions"></b-form-checkbox-group>
 <b-button
      size="lg"
      class="m-2"
      @click="changeGroup(item)"
      v-for="item in List_GroupName"
      :key="item"
      >{{ item }}</b-button
    >
    <div class="text-left pt-2 pl-2" @click="CloseFootPanel">
      <b-row>
        <b-col>
          <b-button class="legend-btn" squared size="sm" variant="light"
            >正常</b-button
          >
          <b-button class="legend-btn" squared size="sm" variant="primary"
            >OOC</b-button
          >
          <b-button class="legend-btn" squared size="sm" variant="danger"
            >OOS</b-button
          >
        </b-col>
        
        <b-col class="text-right">
          <b-button
            class="mr-2"
            variant="danger"
            size="sm"
            @click="ResetAllAlarmHandle"
            >清除所有警報</b-button
          >
        </b-col>
      </b-row>
    </div>
   

    <vue-good-table
      :key="-1"
      :columns="columns"
      :fixed-header="true"
      :sort-options="{ enabled: false }"
      :rows="dataRows"
      @on-cell-click="onCellClick"
    >
      <template slot="table-row" slot-scope="props">
        <div
          v-b-tooltip.hover
          title
          v-bind:style="
            StatusMap[
              nowGroupName + props.formattedRow['RowName'] + props.column.field
            ]
          "
          class="inner-val"
        >
          {{ props.formattedRow[props.column.field] }}
        </div>
      </template>
    </vue-good-table>

    <div class="footer" v-if="showFootPanel">
      <div class="footer-content">
        <b-row>
          <b-col cols="2" class="text-left pl-3">
            <b-button-group>
              <b-button variant="dark" squared>{{
                selectedCell.column
              }}</b-button>
              <b-button variant="light" squared>{{
                selectedCell.rowName
              }}</b-button>
            </b-button-group>
          </b-col>
          <b-col cols="1"></b-col>
          <b-col cols="2" class="text-left threshold-region-foot">
            <b-row cols="2" no-gutters>
              <b-col class="text-right pr-4">OOC閥值</b-col>
              <b-col class="ooc-style">
                <span
                  class="threval"
                  @click="ShowTresSettingDialog('OOC', selectOOCThresval)"
                  v-b-tooltip.hover
                  title="點一下進行設定"
                  >{{ selectOOCThresval }}</span
                >
              </b-col>
            </b-row>
          </b-col>
          <b-col cols="2" class="text-left threshold-region-foot">
            <b-row cols="2" no-gutters>
              <b-col class="text-right pr-4">OOS閥值</b-col>
              <b-col class="oos-style">
                <span
                  class="threval"
                  @click="ShowTresSettingDialog('OOS', selectOOSThresval)"
                  v-b-tooltip.hover
                  title="點一下進行設定"
                  >{{ selectOOSThresval }}</span
                >
              </b-col>
            </b-row>
          </b-col>
          <b-col>
            <b-button
              variant="light"
              block
              :disabled="!Resetable || this.$userInfo.level == 0"
              @click="ResetAlarmHandle"
            >
              <span v-if="this.$userInfo.level != 0">RESET ALARM</span>
              <span v-else>(LEVEL 0 禁止 RESET ALARM)</span>
            </b-button>
          </b-col>
          <b-col class="text-right">
            <b-button
              variant="danger"
              v-b-tooltip.hover
              title="關閉(ESC)"
              @click="CloseFootPanel"
              >X</b-button
            >
          </b-col>
        </b-row>
      </div>
    </div>
    <threshold-setting-dialog-vue
      :show="thresSettingDialogShow"
      :options="thresHoldSettingOptions"
      @onSuccess="ThresHoldSetSuccessHandle"
      @hide="thresSettingDialogShow = false"
    ></threshold-setting-dialog-vue>
  </div>
</template>
<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/1.0.18/vue.min.js"></script>
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
      Dict_GroupSetting: Object,
      List_GroupName: [],
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
        },
        out_of_spec: {
          backgroundColor: "#d51919", //紅色
          color: "white",
        },
        out_of_control: {
          backgroundColor: "#a5b600", //屎黃色
          color: "white",
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
    };
  },
  computed: {},
  methods: {
    async onCellClick(params) {
      if (params.column.field == "RowName") return;
      this.selectedCell.column = params.column.field;
      this.selectedCell.rowName = params.row.RowName;

      this.selectedKey = this.selectedCell.rowName + this.selectedCell.column;
      await this.UpdateSelectedThresDisplay();
      this.showFootPanel = true;
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
      var returnData = await getThresholdSetting(
        this.nowGroupName,
        this.selectedCell.rowName,
        this.selectedCell.column
      );
      var ThresholdSetting = JSON.parse(returnData);
      if (ThresholdSetting == null) {
        return;
      }

      this.selectOOCThresval = ThresholdSetting["OOC"];
      this.selectOOSThresval = ThresholdSetting["OOS"];
    },
    CloseFootPanel() {
      this.showFootPanel = false;
    },
    async ResetAlarmHandle() {
      var ok = await this.ShowConfirmMsgBox();
      if (!ok) return;
      //TODO backend reset alarm
      await ResetAlarm(
        this.nowGroupName,
        this.selectedCell.rowName,
        this.selectedCell.column
      );
      this.showFootPanel = false;
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
        //TODO backend
        await ResetAlarm(this.nowGroupName, 'All','All' );
      }
    },
    async ShowConfirmMsgBox() {
      return await this.$bvModal
        .msgBoxConfirm(
          `確定要清除 ${this.selectedCell.eqid}-${this.selectedCell.column.label} 異常?`,
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
      this.Dict_GroupSetting = data;
      this.List_GroupName = Object.keys(data);
      this.Dict_GroupDataRows = new Object();
      this.List_GroupName.forEach((eachGroupName) => {
        this.Dict_GroupDataRows[eachGroupName] = [];
        var AllColumnNames =
          this.Dict_GroupSetting[eachGroupName].List_AllColumnName;
        var rowNames = Object.keys(
          this.Dict_GroupSetting[eachGroupName].Dict_RowListSensor
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
      this.Dict_GroupSetting[groupName].List_AllColumnName.forEach(
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
      this.showFootPanel = false;
    },
    async RawDataWSConnect() {
      this.rawDataWS = "network_error";
      while (this.rawDataWS == "network_error") {
        this.rawDataWS = await SensorRawDataWsConnect();
      }
      this.rawDataWS.onmessage = (e) => this.RawDataHandle(e);
      this.rawDataWS.onclose = () => {
        this.RawDataWSConnect();
      };
    },
    RawDataHandle(e) {
      var SensorData = JSON.parse(e.data);
      var sensorName = SensorData.SensorName;

      this.List_GroupName.forEach((EachGroupName) => {
        var NowGroup = this.Dict_GroupSetting[EachGroupName];
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
                eachRow[NewDataName] = Dict_RawData[TargetDataName].value;
                this.StatusMap[EachGroupName + TargetRowName + NewDataName] =
                  Dict_RawData[TargetDataName].isOutofControl
                    ? this.statusStyle.out_of_control
                    : this.statusStyle.normal;
                if (Dict_RawData[TargetDataName].isOutofSpec) {
                  this.StatusMap[EachGroupName + TargetRowName + NewDataName] =
                    this.statusStyle.out_of_spec;
                }
              });
            }
          });
        });
      });

      if (this.nowGroupName === "") return;

      var NowGroup = this.Dict_GroupSetting[this.nowGroupName];
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
            eachRow[NewDataName] = Dict_RawData[TargetDataName].value;
          });
        }
      });
    },
  },
  async mounted() {
    this.WebSocketConnect();
    this.RawDataWSConnect();
  },
};
</script>
<style>
:root {
  --footer-height: 30px;
}
body {
  padding: 0;
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.main {
  overflow-y: auto;
}
.footer {
  height: var(--footer-height);
}
.footer-content {
  position: fixed;
  bottom: 0;
  width: 100%;
  line-height: var(--footer-height);
  background: #343a40;
  color: #fff;
}
</style>