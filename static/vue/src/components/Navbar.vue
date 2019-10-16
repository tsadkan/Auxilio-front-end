<template>
  <nav class="navbar site-header" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <router-link class="navbar-item" tag="a" :to="{name:'agendas'}">
      <img
        src="@/assets/logo.png"
        class="site-logo"
        width="112" height="28"
      >
    </router-link>


    <a role="button" class="navbar-burger burger has-text-white" :class="{'is-active': isNavbarOpen}" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample" @click="isNavbarOpen = !isNavbarOpen">
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </a>
  </div>

  <div id="navbarBasicExample" class="navbar-menu site-header" :class="{'is-active': isNavbarOpen}">
    <div class="navbar-start">
      <a class="navbar-item search-item">
        <Search style="width: 100%"/>
      </a>

      <a class="navbar-item"  v-if="$acl.hasModeratorPermission()">
        <a class="button is-primary" @click="openNewTopic()" style="margin-right: 15px">
          <b-icon icon="plus" type="is-white" size="is-small"></b-icon>
          <span>New Agenda</span>
        </a>
      </a>
    </div>

    <div class="navbar-end">
      <div class="navbar-item lower-zindex">
        <div class="buttons">
          <b-dropdown aria-role="list" style="position:relative; margin-right:20px;">
            <p slot="trigger" role="button">
              <a class="navbar-link has-text-white lower-zindex">
                More
              </a>
            </p>

            <b-dropdown-item
              aria-role="listitem"
            >
              <span
                class="button is-primary is-outlined"
                @click="openGenericDocuments()"
              >
                <b-icon icon="folder" size="is-small"></b-icon>
                <span>Resources</span>
              </span>
            </b-dropdown-item>
            <b-dropdown-item
              aria-role="listitem"
            >
                <span
                  class="button is-primary is-outlined"
                  @click="openAnnouncement()"
                >
                  <b-icon icon="message" size="is-small"></b-icon>
                  <span>Announcements</span>
                </span>
            </b-dropdown-item>
          </b-dropdown>
        </div>
      </div>
      <div class="navbar-item lower-zindex">
        <div class="buttons">
          <div class="mb-3 user-pic" size="40px" @click="navigateToMyProfile">
            <span>
              <user-avatar :bucket="bucket" :size="30" :file-name="userProfile.profilePicture"/>
            </span>
          </div>
          <span class="has-text-white is-size-7 user-name" @click="navigateToMyProfile">
            <div class="tags has-addons" style="position:relative;margin-right:20px">
              <span
                class="tag is-dark"
                style="border-top-left-radius: 10px"
              >{{ `${userProfile.givenName} ${userProfile.familyName}` }}</span>
              <span
                v-if="$acl.hasModeratorPermission()"
                class="tag is-success"
                style="border-bottom-right-radius:10px"
              >Moderator</span>
            </div>
          </span>
        </div>
      </div>
      <div class="navbar-item lower-zindex">
        <div class="buttons">
          <b-dropdown aria-role="list" style="position:relative; margin-right:20px;">
            <p slot="trigger" role="button">
              <b-icon type="is-white" class="fa fa-globe is-medium" style="cursor: pointer"></b-icon>
            </p>

            <b-dropdown-item
              aria-role="listitem"
              v-for="lang in languages"
              @click="changeLanguage(lang.key)"
              :key="lang.key"
            >{{ lang.name }}</b-dropdown-item>
          </b-dropdown>
          <a class="button is-primary" href="#" @click="logout">
            <span>{{$t('logout')}}</span>
          </a>
        </div>
      </div>
    </div>
  </div>
  <a
      class="primary powered-by"
      href="https://github.com/auxilio-team"
      style="color: white"
      target="_blank"
    >powered by Auxilio</a>
</nav>
</template>
<script>
import { mapMutations } from 'vuex';
import { AuthService } from '@/services';
import { API_ROOT } from '@/api';
import UserAvatar from './UserAvatar.vue';
import Search from './Search.vue';
import GenericDocument from './GenericDocument.vue';
import Announcement from './Announcement.vue';

export default {
  name: 'Navbar',
  components: {
    UserAvatar,
    Search
  },
  data() {
    return {
      isNavbarOpen: false,
      profilePopupVisible: false,
      appName: 'Auxilio',
      bucket: 'users',
      userProfile: AuthService.getProfile(),
      languages: [
        { key: 'en', name: 'English' },
        { key: 'fr', name: 'French' },
        { key: 'ar', name: 'Arabic' }
      ]
    };
  },
  methods: {
    ...mapMutations('layout', ['toggleNavBar']),
    logout() {
      AuthService.logout();
    },
    openNewTopic() {
      this.$router.push({ name: 'create-agenda' });
    },
    navigateToMyProfile() {
      this.$router.push({ name: 'profile' });
    },
    openGenericDocuments() {
      this.$modal.open({
        scroll: 'keep',
        parent: this,
        props: {},
        component: GenericDocument,
        hasModalCard: true
      });
    },
    openAnnouncement() {
      this.$modal.open({
        scroll: 'keep',
        parent: this,
        props: {},
        component: Announcement,
        hasModalCard: true
      });
    },
    changeLanguage(langKey) {
      this.$store.commit('core/changeLanguage', langKey);
    }
  },
  computed: {
    imgUrl() {
      if (!this.userProfile.profilePicture) {
        return false;
      }
      const img = this.userProfile.profilePicture;
      return `${API_ROOT}/Containers/users/download/${img}`;
    }
  }
};
</script>
<style>
.site-header {
  background-color: transparent !important;
  box-shadow: 0 6px 9px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);
}

.search-input {
  background-color: #fff;
  border-color: #edf1f2;
  border: 1px solid #ddd;
  box-shadow: 0 6px 9px rgba(10, 10, 10, 0.1), 0 0 0 1px rgba(10, 10, 10, 0.1);
  border-radius: 3px;
  height: 34px;
  font-size: 13px;
  font-weight: 400;
  line-height: 20px;
  border: 1px solid #d5dce0;
  border-radius: 4px;
  outline: none;
  width: 100%;
  padding: 5px 10px;
  position: relative;
}
.user-avatar {
  border-radius: 30px;
  margin-right: 10px;
  margin-top: 10px;
}
.user-name,
.user-pic {
  cursor: pointer;
}
.powered-by {
  position: fixed;
  right: 30px;
  bottom: 10px;
}
.issue {
  position: fixed;
  right: 30px;
  bottom: 50px;
}
.container.is-fluid {
  margin-left: 0px;
  margin-right: 0px;
}
.lower-zindex {
}

.navbar-item:hover {
  background-color: rgba(1,1,1,0) !important;
}
.navbar-link:hover {
  background-color: rgba(1,1,1,0) !important;
}
@media (min-width: 950px) {
    .search-item {
      width: 500px;
    }
}

</style>
