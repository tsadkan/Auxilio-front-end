import Vue from 'vue';

// Third party
import '@/plugins/buefy';
import '@/plugins/vue-img-fallback';
import '@/plugins/vue-wysiwyg';
import '@/plugins/vee-validate';
import '@/plugins/ckeditor';
import '@/plugins/vue-escape';
import '@/plugins/vue-tel-input';
import '@/plugins/vue-popover';
import '@/plugins/vue-country-select';

// Internal
import '@/shared';
import router from './router';
import store from './store';
import App from './App.vue';
import './registerServiceWorker';
import i18n from './i18n';

Vue.config.productionTip = false;

export default new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app');
