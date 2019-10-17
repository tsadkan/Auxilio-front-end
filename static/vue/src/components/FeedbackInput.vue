<template>
  <article class="media">
    <b-notification :closable="false" v-if="isDocumentUploading">
            <b-loading :is-full-page="true" :active.sync="isDocumentUploading" :can-cancel="false">
                <b-icon
                    icon="attachment"
                    size="is-large"
                    custom-class="fa-spin">
                </b-icon>
            </b-loading>
        </b-notification>
    <figure class="media-left">
      <user-avatar
        :bucket="'users'"
        :size="64"
        :file-name="userProfile.profilePicture"
        :show-me="true"
      />
    </figure>
    <div class="media-content">
      <b-field :type="{'is-danger': errors.has('feedback')}" :message="errors.first('feedback')">
        <b-input
          v-model="item.body"
          v-validate="'required'"
          type="textarea"
          minlength="1"
          name="feedback"
          placeholder="Add a comment..."
        />
      </b-field>

      <template v-for="(file,index) in item.files">
        <FilePreview :bucket="'feedback'" :key="index" :fileData="file" :hasDownload='false' :index="index" @onDelete="removeFile($event)"/>
      </template>

      <div class="columns">
        <div class="column">
          <div class="field">
            <p class="control attachment-btn">
              <button class="button" @click="openAttachFile">
                <b-icon icon="attachment"></b-icon>
              </button>
            </p>
            <p class="control attachment-btn">
              <button class="button is-primary" @click="postFeedback()">Post comment</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>
<script>
import { AuthService } from '@/services';
import { FeedbackAPI } from '@/api';
import FileUpload from '@/components/FileUpload.vue';
import FilePreview from '@/components/FilePreview.vue';
import UserAvatar from './UserAvatar.vue';
import { mapState } from 'vuex';

export default {
  name: 'FeedbackInput',
  components: {
    FilePreview,
    UserAvatar
  },
  props: {
    postId: {
      type: [String],
      default: () => ''
    }
  },
  data() {
    return {
      item: {
        body: '',
        files: []
      },
      userProfile: {},
      body: ''
    };
  },
  created() {
    this.userProfile = AuthService.getProfile();
  },
  computed: {
    ...mapState('DocumentStore', ['documentUploadProgress', 'isDocumentUploading']),
  },
  methods: {
    resetData() {
      this.item = {
        body: '',
        files: []
      };
    },
    openAttachFile() {
      this.$modal.open({
        scroll: 'keep',
        parent: this,
        events: {
          close: (data) => {
            this.onFileAttach(data);
          }
        },
        component: FileUpload,
        hasModalCard: true
      });
    },
    onFileAttach(data) {
      const { files, meta } = data;
      if (files !== null) {
        for (let i = 0; i < files.length; i += 1) {
          // this.item.files.push({ files[i] , meta });
          const file = files[i];
          this.item.files.push({ file, meta });
        }
      }
    },
    async postFeedback() {
      const valid = await this.$validator.validateAll();
      if (!valid) {
        return;
      }
      this.item.postId = this.postId;

      const formData = new FormData();
      Object.keys(this.item).forEach((key) => {
        const value = typeof this.item[key] === 'object'
          ? JSON.stringify(this.item[key])
          : this.item[key];
        formData.append(key, value);
      });
      // add files
      for (let i = 0; i < this.item.files.length; i += 1) {
        const { file } = this.item.files[i];
        if (file && file.name) {
          formData.append(`file-${i}`, file, file.name);
        }
      }

      this.$store.commit('DocumentStore/setDocumentUploading', true);
      const response = await FeedbackAPI.create(formData);
      this.$store.commit('DocumentStore/setDocumentUploading', false);
      this.$store.commit('DocumentStore/setDocumentUploadProgress', 0);
      this.$toast.open({
        message: 'Comment posted successfully.',
        type: 'is-success',
        position: 'is-top'
      });
      this.resetData();
      this.$nextTick(() => this.$validator.reset());
      this.$emit('success', response);
    },
    removeFile(index) {
      this.item.files.splice(index, 1);
    }
  }
};
</script>

<style scoped>
.attachment-btn {
  display: inline;
  margin-right: 6px;
}

.card-title-small {
  color: #000;
  font-size: 14px !important;
  margin-bottom: 5px !important;
}
</style>
