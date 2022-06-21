<template>
  <div>
    <h2>用戶列表</h2>
    <div class="text-left mb-1">
      <el-button @click="EditBtnClickHandle">{{EditBtnText}}</el-button>
      <el-button v-show="editMode" @click="CancelBtnClickHandle" type="danger">Cancel</el-button>
      <el-button @click="AddBtnClickHandle">新增</el-button>
    </div>
    <el-table empty-text="No Data" :data="UserList">
      <el-table-column prop="accountName" label="用戶名">
        <template slot-scope="scope">
          <div v-if="editMode">
            <el-input v-model="scope.row.accountName"></el-input>
          </div>
          <div v-else>{{scope.row.accountName}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="userName" label="帳號"></el-table-column>
      <el-table-column prop="level" label="等級">
        <template slot-scope="scope">
          <div v-if="editMode">
            <el-select v-model="scope.row.level">
              <el-option v-for="i in [0,1,2,3]" :key="i" :label="i==3? i+'(Admin)' :i" :value="i"></el-option>
            </el-select>
          </div>
          <div v-else>{{scope.row.level}}</div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { GetAllUserList, UpdateUsersInfo } from '../../web-api/Backend/UserAPI'
export default {
  data() {
    return {
      editMode: false,
      UserList: [],
      OriUserList: []
    }
  },
  methods: {
    async EditBtnClickHandle() {
      if (this.editMode) {
        this.SaveData();

      }
      else {
        //儲存原有資料
        this.OriUserList = JSON.parse(JSON.stringify(this.UserList));
      }
      this.editMode = !this.editMode;
    },
    CancelBtnClickHandle() {
      this.UserList = this.OriUserList;
      this.editMode = false;
      this.$message.info("取消變更");

    },
    AddBtnClickHandle() {

    },
    async SaveData() {
      var ret = await UpdateUsersInfo(this.UserList);
      console.info(ret);
      if (ret.success) {
        this.$message.success("完成變更");
      } else
        this.$message.error(ret.message);
    }
  },
  computed: {
    EditBtnText() {
      return this.editMode ? "儲存" : "編輯";
    }
  },
  async mounted() {
    this.UserList = await GetAllUserList();
  }
}
</script>
<style scoped>
</style>