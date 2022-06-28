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

    <vue-good-table
      :key="-1"
      :columns="columns"
      :fixed-header="true"
      :sort-options="{ enabled: false }"
      :rows="dataRows"
      @on-cell-click="onCellClick"
    >
      <template slot="table-row" slot-scope="props">
        <div v-b-tooltip.hover title class="inner-val">
          {{ props.formattedRow[props.column.field] }}
        </div>
      </template>
    </vue-good-table>

    <div class="footer" v-if="showFootPanel">
      <div class="footer-content">
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
    </div>
      <threshold-setting-dialog-vue
        :show="thresSettingDialogShow"
        :options="thresHoldSettingOptions"
        @onSuccess="ThresHoldSetSuccessHandle"
        @hide="thresSettingDialogShow=false"
      ></threshold-setting-dialog-vue>
  </div>
</template>
<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/1.0.18/vue.min.js"></script>
<script>
import "vue-good-table/dist/vue-good-table.css";
import ThresholdSettingDialogVue from '../ThresholdSettingDialog.vue';
import { VueGoodTable } from "vue-good-table";
import {
  GroupSettingWSConnect,
  SensorRawDataWsConnect,
} from "../../web-api/Distribution_Host";

export default {
  components: {
    VueGoodTable,ThresholdSettingDialogVue
  },
  props: {
    groupInfo: Object,
    renderPause: {
      type: Boolean,
      default: false,
    },
    userInfo: {
      type: Object,
      default: () => {
        return {
          userName: 'visitor',
          level: 0
        }
      }
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

      showFootPanel:false,
      selectedCell: {
        rowName: "",
        column: "",
      },
      selectedKey:'',
      thresSettingDialogShow:false,
      selectOOCThresval: -1,
      selectOOSThresval: -1,
      Resetable:false,
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
    };
  },
  computed: {
  },
  methods: {
    onCellClick(params) {
      // console.log(params);
      console.log(params);
      if (params.column.field == 'RowName')
        return;
      //if (this.selectedKey != "")
        //this.StatusMap[this.selectedKey][0] = this.selectStyle.unselected;
      this.selectedCell.column = params.column.field;
      this.selectedCell.rowName = params.row.RowName;

      this.selectedKey = this.selectedCell.rowName + this.selectedCell.rowName;
      //this.StatusMap[this.selectedKey][0] = this.selectStyle.selected;
      this.UpdateSelectedThresDisplay();
      //this.renderKey = Date.now();
      this.showFootPanel = true;
     // this.Resetable = this.StatusMap[this.selectedKey][1].backgroundColor != this.statusStyle.normal.backgroundColor;
    },
    ShowTresSettingDialog(type, oriVal) {
      //console.log()
      this.thresHoldSettingOptions.settingFor.thresType = type;
      this.thresHoldSettingOptions.settingFor.originVal = oriVal;
      this.thresHoldSettingOptions.sensor = { groupName: this.nowGroupName,rowName: this.selectedCell.rowName, field: this.selectedCell.column }
      this.thresSettingDialogShow = true;

    },
     UpdateSelectedThresDisplay() {
      // this.selectOOCThresval = thresMap[this.selectedCell.column + '_OOC'];
      // this.selectOOSThresval = thresMap[this.selectedCell.column + '_OOS'];
    },
    CloseFootPanel(){
      this.showFootPanel = false;
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
    ThresHoldSetSuccessHandle(val) {
      if (this.thresHoldSettingOptions.settingFor.thresType == "OOC")
        this.selectOOCThresval = val;
      else
        this.selectOOSThresval = val;
    },
    async WebSocketConnect() {
      this.groupInfoWS = 'network_error';
      while (this.groupInfoWS == 'network_error') {
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
      if(this.nowGroupName === "") {
        if(this.List_GroupName.length !=0)
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
:root{
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
  background: #42b983;
  color: #fff;
}
</style>