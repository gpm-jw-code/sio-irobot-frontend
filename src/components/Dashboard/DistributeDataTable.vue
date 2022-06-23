<template >
  <div class="p-1">
    <b-row class="p-2 pl-4 display-item-selector">
      <b-icon-check-circle-fill
        scale="1"
        class="mt-1"
      ></b-icon-check-circle-fill>
      <b class="mr-3 ml-1">顯示項目</b>
    </b-row>

    <b-button
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
import { GroupSettingWSConnect,SensorRawDataWsConnect } from "../../web-api/Distribution_Host";

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
      list_GroupObjects: [],
      List_GroupName: [],
      dataRows: [],
      columns: [
        {
          label: "振動能量",
          text: "振動能量",
          field: "vb_energy_total",
          value: "vb_energy_total",
          index: 0,
        },
        {
          label: "Alert Index",
          text: "Alert Index",
          field: "alert_index",
          value: "alert_index",
          index: 1,
        },
      ],
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
      this.groupInfoWS = await GroupSettingWSConnect();
      this.groupInfoWS.onmessage = (e) => this.GroupWsDataHandle(e);
      this.groupInfoWS.onclose = () => {
        this.WebSocketConnect();
      };
    },
    GroupWsDataHandle(e) {
      if (this.renderPause) return;
      var data = JSON.parse(e.data);
      this.list_GroupObjects = data;
      this.List_GroupName = Object.keys(data);
    },
    changeGroup(groupName) {
      this.columns = [];
      this.nowGroupName = groupName;
      var I = 0;
      this.columns.push({label: "RowName",
            text: "RowName",
            field: "RowName",
            value: "RowName",
            index: I,});
      this.list_GroupObjects[groupName].List_AllColumnName.forEach(
        (columname) => {
            var NewDataName = columname.replace(' ', '_').replace('.','_');
            I+=1;
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
      this.dataRows = [];
      var rowNames = Object.keys( this.list_GroupObjects[groupName].Dict_RowListSensor);
      rowNames.forEach(element => {
          var NewRowObject =new Object();
          this.columns.forEach(columnitem => {
              NewRowObject[columnitem.field] = "";
                    console.log(NewRowObject);
          });
          NewRowObject["RowName"] =element;
          this.dataRows.push(NewRowObject);
      });
    },
    async RawDataWSConnect() {
      this.rawDataWS = await SensorRawDataWsConnect();
      this.rawDataWS.onmessage = (e) => this.RawDataHandle(e);
      this.rawDataWS.onclose = () => {
        this.WebSocketConnect();
      };
    },
    RawDataHandle(e){
        var SensorData =JSON.parse(e.data);
        var sensorName = SensorData.SensorName;
        if(this.nowGroupName==="")
            return;

        var NowGroup = this.list_GroupObjects[this.nowGroupName];
        if(!NowGroup.List_SensorName.includes(sensorName))
            return;    
        
        var TargetRowName = "";
        var RowsName =Object.keys(NowGroup.Dict_RowListSensor);
        RowsName.forEach(EachRowName => {
            if(NowGroup.Dict_RowListSensor[EachRowName].includes(sensorName))
            {
                TargetRowName = EachRowName;
            }
        });
        if(TargetRowName === "")
            return;
        
        var Dict_RawData = SensorData.Dict_RawData_WithState;
        var DataNames = Object.keys(Dict_RawData);
        this.dataRows.forEach(eachRow=>{
            if(eachRow.RowName === TargetRowName)
            {
                DataNames.forEach(TargetDataName => {
                   var NewDataName = TargetDataName.replace(' ', '_').replace('.','_');
                    eachRow[NewDataName] = Dict_RawData[TargetDataName].value;
                });
            }
        })
    }
  },
  async mounted() {
    //this.ShowAllColums();
    console.log("distributeTableMounted");
    this.WebSocketConnect();
    this.RawDataWSConnect();
  },
};
</script>
