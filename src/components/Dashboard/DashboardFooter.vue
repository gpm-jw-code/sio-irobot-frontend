<template >
  <transition name="el-zoom-in-bottom">
    <div class="footer-content" v-if="showing" id="dashboard-footer">
      <b-row>
        <b-col cols="2" class="text-left pl-3">
          <b-button-group class="font-weight-bold">
            <b-button class="font-weight-bold" variant="info" squared>{{ selectedCell.rowName }}</b-button>
            <b-button class="font-weight-bold" variant="dark" squared>{{ selectedCell.column }}</b-button>
          </b-button-group>
        </b-col>
        <b-col cols="1"></b-col>
        <b-col cols="2" class="threshold-reg text-left" v-loading="tresholdValueLoading">
          <b-row cols="2" no-gutters>
            <b-col class="text-right pr-4 thres-title">OOC閥值</b-col>
            <b-col class="oo-style ooc-style">
              <span
                class="threval"
                @click="ShowTresSettingDialog('OOC', selectOOCThresval)"
                v-b-tooltip.hover
                title="點一下進行設定"
              >{{ selectOOCThresval }}</span>
            </b-col>
            <b-col class="text-right pr-4 thres-title">OOS閥值</b-col>
            <b-col class="oo-style oos-style">
              <span
                class="threval"
                @click="ShowTresSettingDialog('OOS', selectOOSThresval)"
                v-b-tooltip.hover
                title="點一下進行設定"
              >{{ selectOOSThresval }}</span>
            </b-col>
          </b-row>
        </b-col>
        <b-col>
          <b-button
            id="reset-alarm-button"
            variant="danger"
            block
            :disabled=" this.$userInfo.level == 0"
            @click="ResetAlarmHandle"
          >
            <span v-if="this.$userInfo.level != 0">RESET ALARM</span>
            <span v-else>(LEVEL 0 禁止 RESET ALARM)</span>
          </b-button>
        </b-col>
        <b-col class="text-right">
          <b-button variant="danger" v-b-tooltip.hover title="關閉(ESC)" @click="CloseFootPanel">X</b-button>
        </b-col>
      </b-row>

      <threshold-setting-dialog-vue
        :show="thresSettingDialogShow"
        :options="thresHoldSettingOptions"
        @onSuccess="ThresHoldSetSuccessHandle"
        @hide="thresSettingDialogShow = false"
      ></threshold-setting-dialog-vue>
    </div>
  </transition>
</template>
<script>
import {
  getThresholdSetting,
  ResetAlarm,
} from "../../web-api/Distribution_Host";
import ThresholdSettingDialogVue from "../ThresholdSettingDialog.vue";

export default {
  components: {
    ThresholdSettingDialogVue,
  },
  props: {
    nowGroupName: {
      type: String,
      default: ""
    },
    selectedCell: {
      type: Object,
      default: () => {
        return {
          'rowName': "rowName",
          'column': "colrname"
        }
      }
    },
    showFootPanel: {
      type: Boolean,
      default: true
    },
    Resetable: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    showFootPanel(newValue, oldValue) {
      if (newValue != oldValue && newValue) {
        console.log(this.selectedCell.rowName, this.selectedCell.column);
        this.UpdateSelectedThresDisplay();
        this.$bus.$emit('footPanelShow', this.height);
      } else {
        this.$emit('onClose');
        this.$bus.$emit('footPanelOnClose');
      }
      this.showing = newValue;

    }
  },
  data() {
    return {
      showing: false,
      thresSettingDialogShow: false,
      tresholdValueLoading: true,
      selectOOCThresval: -1,
      selectOOSThresval: -1,
      height: 62,
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
    }
  },
  methods: {
    GetHeight() {
      //   console.log(dom.clientHeight);
      return 40;
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

      this.tresholdValueLoading = true;
      var returnData = await getThresholdSetting(
        this.nowGroupName,
        this.selectedCell.rowName,
        this.selectedCell.column
      );
      if (returnData == null) {
        this.$message.error(`${this.selectedCell.rowName}  ${this.selectedCell.column} 閥值資訊下載失敗`);
        this.selectOOCThresval = 'known';
        this.selectOOSThresval = 'known';
      } else {

        var ThresholdSetting = JSON.parse(returnData);
        this.selectOOCThresval = ThresholdSetting["OOC"].toFixed(3);
        this.selectOOSThresval = ThresholdSetting["OOS"].toFixed(3);
      }
      this.tresholdValueLoading = false;
    },
    CloseFootPanel() {
      this.showing = false;
      this.$emit('onClose');
      this.$bus.$emit('footPanelOnClose');

    },
    async ResetAlarmHandle() {
      var ok = await this.ShowConfirmMsgBox();
      if (!ok) return;

      var result = await ResetAlarm(
        this.nowGroupName,
        this.selectedCell.rowName,
        this.selectedCell.column
      );
      console.info(`Reset alarm : ${this.selectedCell}`, result);
      // this.showFootPanel = false;
      if (result.toUpperCase() == 'OK') {
        this.$emit("AlarmResetDone");
      }
    },

    async ShowConfirmMsgBox() {
      return await this.$bvModal
        .msgBoxConfirm(
          `確定要清除 ${this.selectedCell.rowName}-${this.selectedCell.column} 異常?`,
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
  },

  updated() {
    var dom = document.getElementById('dashboard-footer');
    this.height = dom.clientHeight;
  },
}
</script>
<style>
.footer-content {
  position: fixed;
  bottom: 0;
  width: 100%;
  background: #343a40;
  box-shadow: 10px 10px 22px 10px black;
  color: rgb(255, 255, 255);
  z-index: 13;
}

#reset-alarm-button {
  height: 100%;
}

.threshold-reg {
  color: black;
  background-color: #2c3e50;
  border: 1px solid rgb(185, 185, 185);
  margin: 2px;
  border-radius: 5px;
}

.thres-title {
  color: rgb(255, 255, 255);
}

.oo-style {
  text-decoration: underline;
}
</style>