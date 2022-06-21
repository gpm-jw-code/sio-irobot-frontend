<template >
  <div class="fixed-top" sticky>
    <b-navbar toggleable="lg" ref="nav" :variant="nav_style" :type="nav_style">
      <b-navbar-brand v-b-toggle.sidebar>
        <b-icon-menu-button></b-icon-menu-button>
        {{ $configs.navTitle }}
      </b-navbar-brand>
      <b-sidebar id="sidebar" aria-labelledby="sidebar-title" no-header backdrop bg-variant="dark">
        <div id="sidebar-title">
          <b-row>
            <b-col cols="1">
              <button
                v-b-toggle.sidebar
                style="background-color:transparent;color:white;border:none;font-size:25px"
              >X</button>
            </b-col>
            <b-col class="pt-1">
              <h4>{{$configs.navTitle}}</h4>
            </b-col>
          </b-row>
        </div>
        <div id="sibar-container">
          <b-row v-for="route in sibarItems" :key="route.path">
            <b-button class="p-4" variant="dark" block :to="route.path">{{route.name}}</b-button>
          </b-row>
        </div>
      </b-sidebar>
      <b-navbar-nav class="text-right">
        <b-button :variant="nav_style" size="lg">{{$route.name}}</b-button>
      </b-navbar-nav>
      <b-navbar-nav class="text-right">
        <b-button :variant="nav_style" size="sm">{{userInfo.userName}}</b-button>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <b-avatar
          v-if="!userInfo.login"
          button
          @click="UserAvatarClickHandle"
          variant="light"
          v-b-tooltip.hover
          title="點擊登入"
        ></b-avatar>
        <div v-else>
          <el-popover placement="top-start" :title="userInfo.userName" width="200" trigger="hover">
            <div>LEVEL : {{userInfo.level + (userInfo.level==3? " (Admin)":"")}}</div>
            <div class="mt-5">
              <b-button block variant="light" @click="ChangePasswordHandle">變更密碼</b-button>
              <b-button block variant="danger" @click="LoginOutHandle">登出</b-button>
            </div>
            <b-avatar
              slot="reference"
              id="logined-avastar"
              button
              variant="primary"
              :text="userInfo.userName[0]"
            ></b-avatar>
          </el-popover>
        </div>
      </b-navbar-nav>
    </b-navbar>
    <ChangePasswordDialog
      :show="showChangePasswordDialog"
      :userName="userInfo.userName"
      @hide="ChangePWDialogHideHandle"
    ></ChangePasswordDialog>
  </div>
</template>

<script>
import ChangePasswordDialog from '../User/ChangePasswordDialog.vue'
export default {
  components: {
    ChangePasswordDialog,
  },
  data() {
    return {
      nav_style: "dark",
      sibarItems: [],
      userInfo: {
        userName: 'visitor',
        level: 0
      },
      adminLogined: false,
      showChangePasswordDialog: false
    };
  },
  methods: {

    CreateSideBar() {
      this.sibarItems = [];
      console.log(this.$router.options.routes.length);
      for (let index = 0; index < this.$router.options.routes.length; index++) {
        const route = this.$router.options.routes[index];

        if (route.name == 'Admin' && this.adminLogined)
          this.sibarItems.push(route);
        else if (route.showInSideBar)
          this.sibarItems.push(route);
      }

    },
    UserAvatarClickHandle() {
      // alert('login form');
      this.$router.push(`/login/${this.$route.name}`);
    },
    async LoginOutHandle() {
      var isOk = await this.ShowLogoutConfirmMsgBox();
      if (!isOk) return;
      this.$userInfo.logout();
      this.$bvToast.toast("Logout", {
        title: '登出',
        variant: "info",
        autoHideDelay: 3000,
        appendToast: false
      });

      console.info(this.$router);
      this.HideAdminItemOfSideBar(); //無論如何都隱藏Side bar 的 admin 項目
      if (this.$router.history.current.path.includes("/admin")) { //如果在Admin頁面則跳轉到主頁
        this.$router.push("/");
      }
    },
    async ShowLogoutConfirmMsgBox() {
      return await this.$bvModal.msgBoxConfirm('確定要登出?', {
        title: 'Please Confirm',
        okVariant: 'primary',
        okTitle: 'YES',
        cancelTitle: 'NO',
        footerClass: 'p-2',
        hideHeaderClose: false,
        centered: true
      })
        .then(value => {
          return value;
        })
        .catch(() => {
          // An error occurred
        })
    },
    ShowLoginTaost() {
      this.$bvToast.toast("", {
        title: "USER LOGIN",
        variant: "info",
        autoHideDelay: 3000,
        appendToast: false
      })
    },
    ShowAdminItemOfSideBar() {
      this.adminLogined = true;
      this.CreateSideBar();
    },
    HideAdminItemOfSideBar() {
      this.adminLogined = false;
      this.CreateSideBar();
    },
    ChangePasswordHandle() {
      this.showChangePasswordDialog = true;
    },
    ChangePWDialogHideHandle() {
      this.showChangePasswordDialog = false;
    }
  },
  mounted() {
    this.CreateSideBar();
    //this.nav_style = this.$configs.navStyle;
    window.addEventListener("scroll", () => {
      this.nav_style = window.scrollY != 0 ? "light" : "dark";
    });
    this.$bus.$on("admin-login", () => this.ShowAdminItemOfSideBar())
  },
  watch: {
    $userInfo: {
      handler: function (userInfo) {
        this.userInfo = userInfo;
        if (this.userInfo.login) {
          console.log(this.$router);
          this.ShowLoginTaost();
        }
      },
      deep: true,
      immediate: true
    }
  }
};
</script>

<style>
.nav-right {
  width: 100%;
}
#sidebar-title {
  background-color: rgb(35, 37, 39);
  color: white;
  padding: 15px;
}
#sibar-container {
  background-color: blue;
}
</style>
