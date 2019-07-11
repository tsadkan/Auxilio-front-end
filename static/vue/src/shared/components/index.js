import Tag from './Tag.vue';
import ProfilePictureUpload from './ProfilePictureUpload.vue';
import ConfirmationDialog from './ConfirmationDialog.vue';
import LinkPreview from './LinkPreview.vue';

export default {
  install(Vue) {
    Vue.component('tag', Tag);
    Vue.component('ProfilePictureUpload', ProfilePictureUpload);
    Vue.component('ConfirmationDialog', ConfirmationDialog);
    Vue.component('LinkPreview', LinkPreview);
  }
};
