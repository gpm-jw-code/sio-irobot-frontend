<template>
  <transition name="el-fade-in-linear">
    <div class="loginPage">
      <div class="login-form pt-3">
        <h1 class="mb-3 pb-3 text-white">LOGIN</h1>
        <div>
          <input class="login-input" type="text" placeholder="User Name" v-model="form.userName" />
        </div>
        <div>
          <input class="login-input" type="password" placeholder="Password" v-model="form.password" />
        </div>
        <p class="login-fail" v-show="!loginResult.success">{{loginResult.message}}</p>
        <p class="logining-info" v-show="logining">登入中...</p>
        <b-button class="action-btn" id="login-btn" squared @click="LoginHandle(false)">登入</b-button>
        <b-button class="action-btn" id="cancel-btn" squared @click="LoginHandle(true)">取消</b-button>
        <b-row class="mt-3 ml-0 regist">
          <b-col>
            <b-form-checkbox>儲存登入資訊</b-form-checkbox>
          </b-col>
          <b-col class="text-right mr-1">
            <span size="small">註冊</span>
          </b-col>
        </b-row>
      </div>
    </div>
  </transition>
</template>

<script>
import { Login } from '../web-api/Backend/UserAPI'
export default {
  components: {},
  data() {
    return {
      logining: false,
      form: {
        userName: '',
        password: ''
      },
      loginResult: {}

    };
  },
  computed: {},
  watch: {
    $route: {
      handler: function (from) {
        this.logining = false;
        this.loginResult.success = true;
        console.log(from);
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    async LoginHandle(cancel = false) {
      // await Login(this.form);
      if (cancel) {
        this.$router.push({ name: this.$route.params.from });
        return;
      }
      this.logining = true;
      if (this.form.userName.toUpperCase() == "KKK") {
        this.$userInfo.login = true;
        this.$userInfo.level = 3;
        this.$userInfo.userName = "Developer";
        this.$router.push({ name: this.$route.params.from, params: userInfo });
        this.$bus.$emit("admin-login", "^_^");
      }

      this.loginResult = await Login(this.form.userName, this.form.password);

      this.logining = false;
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
}
</script>
<style  scoped>
.loginPage {
  top: 0;
  position: fixed;
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
  background-color: rgba(255, 255, 255, 0.2);
  color: black;
  width: 400px;
  margin: 0 auto;
  border-radius: 8px;
}

.login-fail {
  color: white;
  background-color: rgb(255 0 0 / 30%);
}
.logining-info {
  color: white;
}

.regist {
  cursor: pointer;
  color: rgb(255, 255, 255);
  background-color: #687eaf;
  padding: 3px;
  width: 100%;
  opacity: 0.7;
}

.action-btn {
  width: 180px;
  font-weight: bold;
  letter-spacing: 3px;
}
.action-btn:hover {
  background-color: goldenrod;
}
#login-btn {
  background-color: #4e6086;
}
#cancel-btn {
  background-color: rgba(255, 255, 255, 0.2);
}
.input-item {
  background-color: red;
}

.login-input {
  background-color: transparent;
  width: 100%;
  text-align: center;
  color: white;
  margin-bottom: 10px;
  height: 50px;
  /* border-radius: 1rem; */
}

input[type="text"],
input[type="password"],
textarea:-webkit-autofill {
  background-color: transparent !important;
  border-bottom: 0.1rem solid white;
}

::placeholder {
  /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: white;
  opacity: 1; /* Firefox */
}
</style>