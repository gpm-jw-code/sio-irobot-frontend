<template >
  <div class="p-1" id="idms-datatable" :key="renderKey" v-loading="ws_connecting">
    <b-row class="p-2 display-item-selector text-white">
      <b class="mr-3 ml-1">顯示項目 :</b>
      <b-form-checkbox-group
        :options="columnsOptions"
        v-model="selectedColumns"
        @change="ColumnsSelectedHandle"
      ></b-form-checkbox-group>
    </b-row>

    <vue-good-table
      :key="renderKey"
      :columns="columns"
      :fixed-header="true"
      :sort-options="{enabled:false}"
      :rows="dataRows"
    >
      <template slot="table-row" slot-scope="props">
        <div v-b-tooltip.hover title class="inner-val">{{props.formattedRow[props.column.field]}}</div>
      </template>
    </vue-good-table>
  </div>
</template>
<script>
import 'vue-good-table/dist/vue-good-table.css'
import { VueGoodTable } from 'vue-good-table'
import { IDMSSensorRawDataWsConnect } from '../../web-api/Distribution_Host'
export default {
  components: {
    VueGoodTable,
  },
  props: {
    renderPause: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      idms_ws: null,
      ws_connecting: true,
      renderKey: -1,
      columns: [
      ],
      fixed_columns: [
        { label: "EQ ID", field: "eqid" },
        { label: "Unit", field: "unit" },
      ],
      columnsOptions: [
        { label: "振動能量", text: "振動能量", field: "vb_energy_total", value: 'vb_energy_total', index: 0 },
        { label: "Alert Index", text: "Alert Index", field: "alert_index", value: 'alert_index', index: 1 },
        { label: "Health Score", text: "Health Score", field: "health_score", value: 'health_score', index: 2 },
        { label: "Velocity-X", text: "Velocity-X", field: "velocity_x", value: 'velocity_x', index: 3 },
        { label: "Velocity-Y", text: "Velocity-Y", field: "velocity_y", value: 'velocity_y', index: 4 },
        { label: "Velocity-Z", text: "Velocity-Z", field: "velocity_z", value: 'velocity_z', index: 5 },
      ],
      dataRows: [],
      selectedColumns: []
    }
  },
  methods: {
    ShowAllColums() {
      this.columns = this.columns.concat(this.fixed_columns).concat(this.columnsOptions)
      for (let index = 0; index < this.columnsOptions.length; index++) {
        const element = this.columnsOptions[index];
        this.selectedColumns.push(element.value);
      }
    },
    ColumnsSelectedHandle() {
      console.log('change');
      this.columns = [];
      var selectedColumns = [];
      this.columns = this.columns.concat(this.fixed_columns);
      for (let index = 0; index < this.selectedColumns.length; index++) {
        var field = this.selectedColumns[index];
        selectedColumns.push(this.columnsOptions.find(i => i.field == field));
      }
      //sort by index
      selectedColumns.sort((a, b) => a.index - b.index);
      this.columns = this.columns.concat(selectedColumns);
      localStorage.setItem('userSelectedShowColumns', JSON.stringify(selectedColumns));
    },
    WsDataHandle(e) {
      if (this.renderPause) return;
      //   console.log(e.data);
      var data = JSON.parse(e.data);
      var key = data.ip;
      var index = -1;
      if ((index = this.dataRows.findIndex(rd => rd.ip == key)) != -1) {
        this.dataRows[index] = data;
      } else {
        this.dataRows.push(data);
      }
      this.dataRows.sort((a, b) => a.eqid.localeCompare(b.eqid));
      //   this.dataRows = this.dataRows.sort((a, b) => a.unit < b.unit);
      // this.renderKey = Date.now();
    },
    nameCompare(a, b) {
      if (a.eqid.toLowerCase() < b.eqid.toLowerCase())
        return -1;
      if (a.eqid.toLowerCase() > b.eqid.toLowerCase())
        return 1;
      return 0;
    },
    async WebSocketConnect() {
      this.ws_connecting = true;
      this.renderKey = Date.now()
      this.idms_ws = await IDMSSensorRawDataWsConnect();
      if (this.idms_ws == null) {
        console.info('idms ws connect fail');
        this.WebSocketConnect();
        return;
      }

      this.idms_ws.onmessage = (e) => {
        this.ws_connecting = false;
        this.WsDataHandle(e);
      }
      this.idms_ws.onclose = () => {
        this.WebSocketConnect();
      }
    }
  },
  async mounted() {
    this.renderKey = Date.now()
    this.ShowAllColums();
    this.WebSocketConnect();

  }
}
</script >
<style >
#idms-datatable {
  height: 100%;
}
.display-item-selector {
  background-color: rgb(0, 0, 0);
  margin: 0 1px;
}
</style>