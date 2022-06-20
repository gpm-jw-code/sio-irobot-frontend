<template>
  <transition name="el-fade-in-linear">
    <div class="loginPage">
      <div class="login-form pt-3">
        <h1 class="mb-3 pb-3">LOGIN</h1>
        <b-form>
          <b-form-input
            v-model="form.userName"
            class="text-center"
            placeholder="USER NAME"
            title="?"
          ></b-form-input>
          <b-form-input
            v-model="form.password"
            class="text-center"
            placeholder="PASSWORD"
            type="password"
          ></b-form-input>
          <p class="login-fail" v-show="!loginResult.success">{{loginResult.message}}</p>
          <b-button class="mt-1" block squared @click="LoginHandle(false)" variant="primary">登入</b-button>
          <b-button class block squared @click="LoginHandle(true)">取消</b-button>
          <b-row>
            <b-col>
              <b-form-checkbox>儲存登入資訊</b-form-checkbox>
            </b-col>
            <b-col class="text-right mr-1">
              <span class="regist" size="small">註冊</span>
            </b-col>
          </b-row>
        </b-form>
      </div>
    </div>
  </transition>
</template>

<script>
import { Login } from '../web-api/backend'
export default {
  components: {},
  data() {
    return {
      form: {
        userName: '',
        password: ''
      },
      loginResult: {}

    };
  },
  computed: {},
  watch: {

  },
  methods: {
    async LoginHandle(cancel = false) {
      // await Login(this.form);
      if (cancel) {
        this.$router.push({ name: this.$route.params.from });
        return;
      }

      this.loginResult = await Login(this.form.userName, this.form.password);
      if (this.loginResult.success) {
        var userInfo = {
          login: true,
          level: this.loginResult.level,
          userName: this.form.userName
        }
        this.$userInfo.login = true;
        this.$userInfo.level = userInfo.level;
        this.$userInfo.userName = this.form.userName;
        this.$router.push({ name: this.$route.params.from, params: userInfo });

        if (userInfo.level == 3) //Admin login
          this.$bus.$emit("admin-login", "^_^");
      }

    }

  },
  created() {
  },
  mounted() {
  },
  beforeCreate() { }, //生命周期 - 创建之前
  beforeMount() { }, //生命周期 - 挂载之前
  beforeUpdate() { }, //生命周期 - 更新之前
  updated() { }, //生命周期 - 更新之后
  beforeDestroy() { }, //生命周期 - 销毁之前
  destroyed() { }, //生命周期 - 销毁完成
  activated() { }, //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style >
.loginPage {
  top: 0;
  position: absolute;
  height: 100vh;
  width: 100vw;
  background-color: rgb(199, 199, 199);
  z-index: 21312321321;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  background-image: url("../assets/login_bg.jpg");
  background-repeat: no-repeat;
  background-size: cover;
}
.login-form {
  position: relative;
  top: 230px;
  background-color: rgb(255, 255, 255);
  color: black;
  opacity: 0.8;
  width: 400px;
  margin: 0 auto;
  border-radius: 8px;
}

.login-fail {
  color: red;
}

.regist {
  cursor: pointer;
  color: grey;
}
</style>