<template>
  <div>
    <b-form-select
      v-model="selectGroups"
      :options="groupNames"
      @change="GroupChange"
      size="lg"
      style="text-align: center"
    ></b-form-select>
    <b-dropdown text="Row Name" block variant="light">
      <b-dropdown-form form-class="dropdown-form">
        <b-form-checkbox-group
          size="lg"
          id="checkbox-group-2"
          v-model="selectRows"
          name="flavour-2"
          stacked
          @change="RowChange"
        >
          <b-form-checkbox
            v-for="robot in rowNames"
            :key="robot"
            :value="robot"
            >{{ robot }}</b-form-checkbox
          >
        </b-form-checkbox-group>
      </b-dropdown-form>
    </b-dropdown>

    <b-dropdown text="感測器類型" block variant="light">
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
            >{{ sensorType }}</b-form-checkbox
          >
        </b-form-checkbox-group>
      </b-dropdown-form>
    </b-dropdown>

    <b-dropdown text="狀態" block variant="light">
      <b-dropdown-form>
        <b-form-checkbox-group
          id="checkbox-group-2"
          v-model="selectedStatusList"
          name="flavour-2"
          stacked
          @change="StatusChange"
        >
          <b-form-checkbox
            v-for="status in statusList"
            :key="status"
            :value="status"
            >{{ status }}</b-form-checkbox
          >
        </b-form-checkbox-group>
      </b-dropdown-form>
    </b-dropdown>
  </div>
</template>
<script>
export default {
  props: {},
  data() {
    return {
      formStyle: {},
      statusList: ["OOC", "OOS"],
      selectGroups: "",
      selectRows: [],
      selectedSensorTypes: [],
      selectedStatusList: [],
      allSelectedItem: [],
    };
  },
  methods: {
    GroupChange() {
      this.selectRows = [];
      this.$emit("groupsSelectedOnChange", this.selectGroups);
    },
    RowChange() {
      this.$emit("rowSelectedOnchange", this.selectRows);
    },
    SensorTypesChange() {
      this.$emit("sensorTypeSelectedOnchange", this.selectedSensorTypes);
    },
    StatusChange() {
      this.$emit("statusSelectedOnchange", this.selectedStatusList);
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
        Object.keys(this.$dataInfo.Dict_GroupSetting).forEach((element) => {
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
        if (this.selectGroups == "") return null;
        return Object.keys(
          this.$dataInfo.Dict_GroupSetting[this.selectGroups].Dict_RowListSensor
        );
      },
    },
    sensorTypes: {
      get() {
        var Types = [];
        if (this.selectGroups == "") return null;
        this.$dataInfo.AllSensorInfo.forEach((element) => {
          if (this.$dataInfo.Dict_GroupSetting[this.selectGroups].List_SensorName.includes(element.SensorName)) 
          {
            if (!Types.includes(element.SensorType)) 
            {
              Types.push(element.SensorType);
            }
          }
        });
        return Types;
      },
    },
    eqidls: {
      get() {
        return this.$dataInfo.eqidls;
      },
    },
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
</style>



