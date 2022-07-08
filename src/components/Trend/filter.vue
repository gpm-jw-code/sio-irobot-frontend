<template>
  <div class="pt-4" id="group-filter">
    <b-form-select
      v-model="selectedGroup"
      :options="groupNames"
      size="lg"
      style="text-align: center"
      @change="GroupChange"
    ></b-form-select>
    <div class="pt-0">
      <div class="selected-description">
        已選擇
        <el-tag
          type="success"
          size="small"
          closable
          @close="()=>{selectRows=[] ,$emit('rowSelectedOnchange', selectRows)}"
        >{{selectRows.length}}</el-tag>
      </div>
      <b-dropdown text="選擇查詢項目(ROW)" block variant="light">
        <b-dropdown-form form-class="dropdown-form">
          <b-form-checkbox-group
            size="md"
            id="checkbox-group-2"
            v-model="selectRows"
            name="flavour-2"
            stacked
            @change="RowChange"
          >
            <b-form-checkbox v-for="robot in rowNames" :key="robot" :value="robot">{{ robot }}</b-form-checkbox>
          </b-form-checkbox-group>
        </b-dropdown-form>
      </b-dropdown>
    </div>

    <div>
      <div class="selected-description">
        已選擇
        <el-tag
          type="success"
          size="small"
          closable
          @close="selectedSensorTypes=[],$emit('sensorTypeSelectedOnchange', selectedSensorTypes)"
        >{{selectedSensorTypes.length}}</el-tag>
      </div>
      <b-dropdown text="選擇數據類型" block variant="light">
        <b-dropdown-form>
          <b-form-checkbox-group
            id="checkbox-group-2"
            v-model="selectedSensorTypes"
            name="flavour-2"
            stacked
            @change="SensorTypesChange"
          >
            <b-form-checkbox
              v-for="sensorType in sensorTypes"
              :key="sensorType"
              :value="sensorType"
            >{{ sensorType }}</b-form-checkbox>
          </b-form-checkbox-group>
        </b-dropdown-form>
      </b-dropdown>
    </div>
    <!-- 
    <b-dropdown text="狀態" block variant="light">
      <b-dropdown-form>
        <b-form-checkbox-group
          id="checkbox-group-2"
          v-model="selectedStatusList"
          name="flavour-2"
          stacked
          @change="StatusChange"
        >
          <b-form-checkbox v-for="status in statusList" :key="status" :value="status">{{ status }}</b-form-checkbox>
        </b-form-checkbox-group>
      </b-dropdown-form>
    </b-dropdown>-->
  </div>
</template>
<script>

class clsSelectedItem {
  selectRows = [];
  selectedSensorTypes = [];
  allSelectedItem = [];
}

export default {
  props: {
    GroupModel: {
      type: Object,
      default() {
        return {

        }
      }
    },
    SensorInfosModel: {
      type: Array,
      default() { return [] }
    },
  },
  data() {
    return {
      formStyle: {},
      statusList: ["OOC", "OOS"],
      selectedGroup: "",
      selectRows: [],
      selectedSensorTypes: [],
      selectedStatusList: [],
      allSelectedItem: [],
      SelectedItems: {}
    };
  },
  methods: {
    GroupChange() {
      if (!Object.keys(this.SelectedItems).includes(this.selectedGroup)) {
        this.SelectedItems[this.selectedGroup] = new clsSelectedItem();
      }
      this.selectRows = this.SelectedItems[this.selectedGroup].selectRows;
      this.selectedSensorTypes = this.SelectedItems[this.selectedGroup].selectedSensorTypes;

      this.$emit("groupsSelectedOnChange", this.selectedGroup);
      this.$emit("rowSelectedOnchange", this.selectRows);
      this.$emit("sensorTypeSelectedOnchange", this.selectedSensorTypes);
    },
    RowChange() {
      this.$emit("rowSelectedOnchange", this.selectRows);
      this.SelectedItems[this.selectedGroup].selectRows = this.selectRows;
    },
    SensorTypesChange() {
      this.SelectedItems[this.selectedGroup].selectedSensorTypes = this.selectedSensorTypes;
      this.$emit("sensorTypeSelectedOnchange", this.selectedSensorTypes);
    },
    StatusChange() {
      //this.$emit("statusSelectedOnchange", this.selectedStatusList);
    },
    SettingSelectedOption(eqid, field) {
      this.selectRows = [eqid];
      this.selectedSensorTypes = [field];
    },
  },
  computed: {
    AllSelectedItem: {
      get() {
        var ls = [];
        for (let index = 0; index < this.selectRows.length; index++) {
          ls.push(this.selectRows[index]);
        }
        for (let index = 0; index < this.selectedSensorTypes.length; index++) {
          ls.push(this.selectedSensorTypes[index]);
        }
        for (let index = 0; index < this.selectedStatusList.length; index++) {
          ls.push(this.selectedStatusList[index]);
        }
        return ls;
      },
      set(val) {
        this.allSelectedItem = val;
      },
    },
    groupNames: {
      get() {
        var groupItems = [];
        var NewGroupItem = {};
        NewGroupItem.value = "";
        NewGroupItem.text = "--Select Group--";
        groupItems.push(NewGroupItem);
        Object.keys(this.GroupModel).forEach((element) => {
          var NewGroupItem = {};
          NewGroupItem.value = element;
          NewGroupItem.text = element;
          groupItems.push(NewGroupItem);
        });
        return groupItems;
      },
    },
    rowNames: {
      get() {
        if (this.selectedGroup == "")
          return [];
        return Object.keys(this.GroupModel[this.selectedGroup].Dict_RowListSensor);
      },
    },
    sensorTypes: {
      get() {
        if (this.selectedGroup == "")
          return [];
        var Types = [];
        this.SensorInfosModel.forEach((element) => {
          if (this.GroupModel[this.selectedGroup].List_SensorName.includes(element.SensorName)) {
            if (!Types.includes(element.SensorType)) {
              Types.push(element.SensorType);
            }
          }
        });
        return Types;
      },
    }
  },
  mounted() {
    console.log("filter mounted");
  },
  destroyed() {
    console.log("filter destoryed");
  },
};
</script>
<style>
.dropdown-form {
  max-height: 500px;
  overflow-y: auto;
  overflow-x: auto;
}
.my-class .dropdown-menu {
  max-height: 100%;
  overflow-y: auto;
}

.group-filter {
  z-index: 2001;
}

.selected-description {
  position: relative;
  top: 33px;
  text-align: left;
  z-index: 33;
  padding-left: 9px;
  width: 150px;
}
</style>



