/* eslint no-param-reassign: 0 */
import Vue from 'vue';
import Vuex from 'vuex';
import DocumentStore from './document.store';
import i18n from './i18n';

Vue.use(Vuex);

const core = {
  namespaced: true,
  state: {
    newAgenda: null,
    pendingNetworkRequest: 0,
    currentLanguage: 'en',
    dragSourceIndex: -1,
    dragElement: { removedIndex: -1, columnId: '' },
    dropElement: { addedIndex: -1, dropColumnId: '' }
  },
  mutations: {
    initializeStore(state) {
      // check if 'currentLanguage' exists
      if (localStorage.getItem('currentLanguage')) {
        let localStorageCurrentLanguage;
        try {
          localStorageCurrentLanguage = JSON.parse(
            localStorage.getItem('currentLanguage')
          );
          const supportedLanguages = ['en', 'ar', 'fr'];
          if (supportedLanguages.indexOf(localStorageCurrentLanguage) === -1) {
            throw new Error('Unsupported current language on local storage');
          }
        } catch (error) {
          localStorageCurrentLanguage = 'en';
        }
        state.currentLanguage = localStorageCurrentLanguage;

        i18n.locale = state.currentLanguage;
      }
    },
    addPendingRequest(state) {
      state.pendingNetworkRequest += 1;
    },
    removePendingRequest(state) {
      state.pendingNetworkRequest -= 1;
    },
    changeLanguage(state, langKey) {
      state.currentLanguage = langKey;
      i18n.locale = state.currentLanguage;
    },
    changeDragSourceIndex(state, index) {
      state.dragSourceIndex = index;
    },
    changeDragElement(state, dragElement) {
      state.dragElement = dragElement;
    },
    changeDropElement(state, dropElement) {
      state.dropElement = dropElement;
    }
  },
  getters: {
    showNetworkProgressBar: state => state.pendingNetworkRequest > 0,
    dragSourceIndex: state => state.dragSourceIndex,
    dragElement: state => state.dragElement,
    dropElement: state => state.dropElement,
  }
};

const layout = {
  namespaced: true,
  state: {
    navDrawerToggle: true
  },
  getters: {},
  mutations: {
    toggleNavBar(state) {
      // eslint-disable-next-line
      state.navDrawerToggle = !state.navDrawerToggle;
    }
  }
};

export default new Vuex.Store({
  modules: {
    layout,
    core,
    DocumentStore
  }
});
