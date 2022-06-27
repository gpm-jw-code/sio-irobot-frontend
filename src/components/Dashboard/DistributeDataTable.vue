<template >
  <div class="p-1">
      <b class="mr-3 ml-1">顯示項目</b>
      <b-form-checkbox-group
        :options="columnsOptions"
      ></b-form-checkbox-group>

    <b-button size="lg" class="m-2" 
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
    >
      <template slot="table-row" slot-scope="props">
        <div v-b-tooltip.hover title class="inner-val">
          {{ props.formattedRow[props.column.field] }}
        </div>
      </template>
    </vue-good-table>
  </div>
</template>
<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/1.0.18/vue.min.js"></script>
<script>
import "vue-good-table/dist/vue-good-table.css";
import { VueGoodTable } from "vue-good-table";
import {
  GroupSettingWSConnect,
  SensorRawDataWsConnect,
} from "../../web-api/Distribution_Host";

export default {
  components: {
    VueGoodTable,
  },
  prop: {
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
    };
  },
  computed: {
    //   groupNames(){
    //       var NamesList = [];
    //       groupInfo.forEach(element => {
    //           console.log(element);
    //           NamesList.push(element.GroupName)
    //       });
    //       return NamesList;
    //   }
  },
  methods: {
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
      var data = JSON.parse(e.data);
      this.Dict_GroupSetting = data;
      this.List_GroupName = Object.keys(data);
      this.Dict_GroupDataRows = new Object();
      this.List_GroupName.forEach(eachGroupName=>{
        this.Dict_GroupDataRows[eachGroupName] = [];
        var AllColumnNames = this.Dict_GroupSetting[eachGroupName].List_AllColumnName;
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
    },
    changeButtonColor(groupName){
        if(this.nowGroupName===groupName)
            return "danger";
        return "success";
    },
    changeGroup(groupName) {
      if(this.nowGroupName === groupName)
        return;
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
            label: NewDataName,
            text: NewDataName,
            field: NewDataName,
            value: NewDataName,
            index: I,
          };
          this.columns.push(NewColumnInfo);
        }
      );
      this.dataRows = this.Dict_GroupDataRows[groupName];
      // var rowNames = Object.keys(
      //   this.Dict_GroupSetting[groupName].Dict_RowListSensor
      // );
      // rowNames.forEach((element) => {
      //   var NewRowObject = new Object();
      //   this.columns.forEach((columnitem) => {
      //     NewRowObject[columnitem.field] = "";
      //   });
      //   NewRowObject["RowName"] = element;
      //   this.dataRows.push(NewRowObject);
      // });
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

      this.List_GroupName.forEach(EachGroupName => {
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
    //this.ShowAllColums();
    console.log("distributeTableMounted");
    this.WebSocketConnect();
    this.RawDataWSConnect();
  },
};
</script>
