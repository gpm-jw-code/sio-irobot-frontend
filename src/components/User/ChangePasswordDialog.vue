<template >
  <b-modal
    size="sm"
    v-model="showDialog"
    @ok="ChangePWHandle"
    @hide="DialogHideHandle"
    :ok-only="true"
    title="變更密碼"
    cancel-title="取消"
  >
    <p>User Name : {{userName}}</p>
    <p>
      請輸入您的舊密碼
      <el-input type="password" v-model="formData.oldPassword" @change="PWInputCHange"></el-input>
    </p>
    <p>
      請輸入您的新密碼
      <el-input type="password" v-model="formData.newPassword" @change="PWInputCHange"></el-input>
    </p>
    <p class="err-message" v-show="!changeResult.success">{{changeResult.message}}</p>
    <b-button block variant="danger" @click="ChangePWHandle">變更</b-button>
  </b-modal>
</template>

<script>
import { ChangePassword } from '../../web-api/Backend/UserAPI'
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    userName: {
      type: String,
      default: ""
    },
  },
  watch: {
    show: {
      handler: function (val) {
        this.showDialog = val;
        this.changeResult.success = true;
      },
      immediate: true
    },
    userName: {
      handler: function (name) {
        if (name)
          this.formData.userName = name
      },
      deep: true,
    }
  },
  data() {
    return {
      showDialog: false,
      formData: {
        userName: "",
        oldPassword: "",
        newPassowrd: ""
      },
      changeResult: {
        success: true,
        message: ""
      }
    }
  },
  methods: {
    async ChangePWHandle() {
      if (!this.Validation()) {
        return;
      }
      this.showDialog = true;
      this.formData.userName = this.userName;
      this.changeResult = await ChangePassword(this.formData);
      console.info(this.changeResult);
      if (this.changeResult.success) {
        this.$message.success("密碼已經變更");
      }

    },
    Validation() {
      if (this.formData.oldPassword == "" || this.formData.newPassword == "") {
        this.changeResult.success = false;
        this.changeResult.message = "密碼不得為空"
        return false;
      }
      return true;
    },
    PWInputCHange() {
      this.changeResult.success = true;
    },
    DialogHideHandle() {
      console.log('hide');
      this.$emit("hide", "");
    }
  },
}
</script>
<style scoped>
.err-message {
  color: red;
}
</style>