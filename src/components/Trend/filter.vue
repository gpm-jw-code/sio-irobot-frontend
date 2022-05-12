<template>
  <div>
    <b-dropdown text="設備" block variant="light">
      <b-dropdown-form form-class="dropdown-form">
        <b-form-checkbox-group
          size="lg"
          id="checkbox-group-2"
          v-model="selectedRobots"
          :aria-describedby="ariaDescribedby"
          name="flavour-2"
          stacked
        >
          <b-form-checkbox v-for="robot in eqList" :key="robot" :value="robot">{{robot}}</b-form-checkbox>
        </b-form-checkbox-group>
      </b-dropdown-form>
    </b-dropdown>

    <b-dropdown text="感測器類型" block variant="light">
      <b-dropdown-form>
        <b-form-checkbox-group
          id="checkbox-group-2"
          v-model="selectedSensorTypes"
          :aria-describedby="ariaDescribedby"
          name="flavour-2"
          stacked
        >
          <b-form-checkbox
            v-for="sensorType in sensorTypes"
            :key="sensorType"
            :value="sensorType"
          >{{sensorType}}</b-form-checkbox>
        </b-form-checkbox-group>
      </b-dropdown-form>
    </b-dropdown>

    <b-dropdown text="狀態" block variant="light">
      <b-dropdown-form>
        <b-form-checkbox-group
          id="checkbox-group-2"
          v-model="selectedStatusList"
          :aria-describedby="ariaDescribedby"
          name="flavour-2"
          stacked
        >
          <b-form-checkbox v-for="status in statusList" :key="status" :value="status">{{status}}</b-form-checkbox>
        </b-form-checkbox-group>
      </b-dropdown-form>
    </b-dropdown>

    <div>{{selectedRobots}}</div>
    <div>{{selectedSensorTypes}}</div>
    <div>{{selectedStatusList}}</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      formStyle: {},
      eqList: ["Robot1", "Robot2", "Robot3", "Robot4", "Robot5"],
      sensorTypes: ["VAC", "溫度", "電流", "振動"],
      statusList: ["OOC", "OOS"],
      selectedRobots: [],
      selectedSensorTypes: [],
      selectedStatusList: []
    }
  },
}
</script>
<style>
.dropdown-form {
}
</style>



