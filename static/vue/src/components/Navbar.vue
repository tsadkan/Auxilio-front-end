<template>
  <nav class="navbar site-header">
    <div class="container is-fluid">
      <div class="navbar-brand">
        <router-link tag="a" :to="{name:'agendas'}">
          <div class="navbar-item">
            <img src="@/assets/logo.png" class="site-logo" style="max-height:2.5em !important; margin-left: 10px">
          </div>

        </router-link>
      </div>

      <div class="navbar-menu">
        <div class="columns" style="width:100%">
          <div class="column is-one-fifths"></div>
          <div class="column is-two-fifths">
            <div class="columns">
              <div class="column is-full">
                <Search/>
              </div>
            </div>
          </div>

          <div class="column is-narrow" v-if="$acl.hasModeratorPermission()">
            <div class="navbar-item">
              <a class="button is-primary" @click="openNewTopic()" style="margin-right: 15px">
                <b-icon icon="plus" type="is-white" size="is-small"></b-icon>
                <span>New Agenda</span>
              </a>
              <a
            class="button is-primary is-outlined"
            href="#"

            @click="openGenericDocuments()"
            style="margin-right:5px"
          ><b-icon icon="folder" size="is-small"></b-icon><span>Resources</span></a>
            </div>
          </div>
          <div class="column is-narrow">
            <div class="navbar-item">
              <div class="mb-3 user-pic" size="40px" @click="navigateToMyProfile">
                <span >
                <user-avatar :bucket="bucket" :size="30" :file-name="userProfile.profilePicture"/>
                </span>
              </div>
              <span class="has-text-white is-size-7 user-name" @click="navigateToMyProfile">
                <div class="tags has-addons" style="position:relative;margin-right:20px">
                  <span class="tag is-dark" style="border-top-left-radius: 10px">{{ `${userProfile.givenName} ${userProfile.familyName}` }}</span>
                  <span v-if="$acl.hasModeratorPermission()" class="tag is-success" style="border-bottom-right-radius:10px">Moderator</span>
                </div>
              </span>
              <b-dropdown aria-role="list" style="position:relative; margin-right:20px;">
                    <p                                          
                        slot="trigger"
                        role="button">
                        <b-icon type="is-white" class="fa fa-globe is-medium" style="cursor: pointer"></b-icon>
                    </p>

                    <b-dropdown-item aria-role="listitem"  v-for="lang in languages" @click="changeLanguage(lang.key)" :key="lang.key">{{ lang.name }}</b-dropdown-item>
                </b-dropdown>
              <a class="button is-primary" href="#" @click="logout">
                <span>{{$t('logout')}}</span>
              </a>
            </div>
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

export default {
  name: 'Navbar',
  components: {
    UserAvatar,
    Search
  },
  data() {
    return {
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
</style>
