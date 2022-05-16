<template>
  <div>
    {{eqidls}}
    <b-dropdown text="設備" block variant="light">
      <b-dropdown-form form-class="dropdown-form">
        <b-form-checkbox-group
          size="lg"
          id="checkbox-group-2"
          v-model="selectedRobots"
          name="flavour-2"
          stacked
          @change="RoboChange"
        >
          <b-form-checkbox v-for="robot in eqidls" :key="robot" :value="robot">{{robot}}</b-form-checkbox>
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
            :key="sensorType.field"
            :value="sensorType.field"
          >{{sensorType.label}}</b-form-checkbox>
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
          <b-form-checkbox v-for="status in statusList" :key="status" :value="status">{{status}}</b-form-checkbox>
        </b-form-checkbox-group>
      </b-dropdown-form>
    </b-dropdown>

    <b-form-tags add-button-text input-id="tags-basic" placeholder v-model="AllSelectedItem"></b-form-tags>

    <!-- 
    <div>{{selectedRobots}}</div>
    <div>{{selectedSensorTypes}}</div>
    <div>{{selectedStatusList}}</div>-->
  </div>
</template>
<script>
export default {
  data() {
    return {
      formStyle: {},
      statusList: ["OOC", "OOS"],
      selectedRobots: [],
      selectedSensorTypes: [],
      selectedStatusList: [],
      allSelectedItem: []
    }
  },
  methods: {
    RoboChange() {
      this.$emit("robotSelectedOnchange", this.selectedRobots);
    },
    SensorTypesChange() {
      this.$emit("sensorTypeSelectedOnchange", this.selectedSensorTypes);
    },
    StatusChange() {
      this.$emit("statusSelectedOnchange", this.selectedStatusList);
    }
  },
  computed: {
    AllSelectedItem: {
      get() {
        var ls = [];
        for (let index = 0; index < this.selectedRobots.length; index++) {
          ls.push(this.selectedRobots[index]);
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
      }
    },
    eqidls: {
      get() { return this.$dataInfo.eqidls; }
    },
    sensorTypes() {
      return this.$dataInfo.fields;
    }
  }
}
</script>
<style>
.dropdown-form {
}
</style>



