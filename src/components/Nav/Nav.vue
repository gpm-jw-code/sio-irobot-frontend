<template >
  <div class="fixed-top" sticky>
    <b-navbar toggleable="lg" ref="nav" :variant="nav_style" :type="nav_style">
      <b-navbar-brand v-b-toggle.sidebar>
        <b-icon-menu-button></b-icon-menu-button>
        {{ $configs.navTitle }}
      </b-navbar-brand>
      <b-sidebar id="sidebar" aria-labelledby="sidebar-title" no-header backdrop>
        <div id="sidebar-title">
          <h4>{{$configs.navTitle}}</h4>
        </div>
        <div id="sibar-container">
          <b-row v-for="route in sibarItems" :key="route.path">
            <b-button variant="light" block :to="route.path">{{route.name}}</b-button>
          </b-row>
        </div>
      </b-sidebar>
      <b-navbar-nav class="text-right">
        <b-button :variant="nav_style">{{userInfo.userName}}</b-button>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <b-avatar v-if="!userInfo.login" button @click="UserAvatarClickHandle" variant="light"></b-avatar>
        <div v-else>
          <el-popover placement="top-start" :title="userInfo.userName" width="200" trigger="hover">
            <div class="mt-5">
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      nav_style: "dark",
      sibarItems: [],
      userInfo: {
        userName: 'visitor',
        level: 0
      }

    };
  },
  methods: {

    CreateSideBar() {
      console.log(this.$router.options.routes.length);
      for (let index = 0; index < this.$router.options.routes.length; index++) {
        const route = this.$router.options.routes[index];
        if (route.showInSideBar)
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
      })
    },
    async ShowLogoutConfirmMsgBox() {
      return await this.$bvModal.msgBoxConfirm('確定要登出?', {
        title: 'Please Confirm',
        // size: 'sm',
        // buttonSize: 'sm',
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
    }
  },
  mounted() {
    this.CreateSideBar();
    //this.nav_style = this.$configs.navStyle;
    window.addEventListener("scroll", () => {
      this.nav_style = window.scrollY != 0 ? "light" : "dark";
    });
  },
  watch: {
    $userInfo: {
      handler: function (userInfo) {
        this.userInfo = userInfo;
        if (this.userInfo.login) {
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
  background-color: black;
  color: white;
  padding: 5px;
}
#sibar-container {
  background-color: blue;
}
</style>
