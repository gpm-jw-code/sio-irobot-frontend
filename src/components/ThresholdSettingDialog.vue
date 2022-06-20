<template >
  <b-modal
    size="sm"
    v-model="showDialog"
    @ok="SettingThres"
    @hide="DialogHideHandle"
    :title="`${options.settingFor.thresType} 閥值設定`"
    cancel-title="取消"
  >
    {{options.settingFor.thresType}} 閥值 :
    <el-input-number :step="0.01" size="small" v-model="thresHoldValSetting"></el-input-number>
  </b-modal>
</template>
<script>
import { ThresHoldSetting } from "../web-api/Distribution_Host"

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    options: {
      type: Object,
      default: () => {
        return {
          settingFor: {
            thresType: "OOS",
            originVal: -1
          },
          sensor: {
            eqid: "",
            field: ""
          },

        }
      }
    },
  },
  watch: {
    show: {
      handler: function (val) {
        this.showDialog = val;
      },
      immediate: true
    },
    options: {
      handler: function (opt) {
        if (opt)
          this.thresHoldValSetting = opt.settingFor.originVal
      },
      deep: true,
    }
  },
  data() {
    return {
      thresHoldValSetting: -1,
      showDialog: false,
    }
  },
  methods: {
    async SettingThres() {
      var result;
      if (this.options.settingFor.thresType == "OOS") {
        result = await ThresHoldSetting.SetOOS(this.options.sensor.eqid, this.options.sensor.field, this.thresHoldValSetting);
      } else {
        result = await ThresHoldSetting.SetOOC(this.options.sensor.eqid, this.options.sensor.field, this.thresHoldValSetting);
      }
      console.log(result);
      if (result == 'ok')
        this.$emit("onSuccess", this.thresHoldValSetting);
      this.showDialog = false;
      return result;
    },
    DialogHideHandle() {
      console.log('hide');
      this.$emit("hide", "");
    }
  },
}
</script>
<style >
</style>