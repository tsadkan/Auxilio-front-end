<template>
  <div>
    <form @submit.prevent="save" novalidate>
      <b-notification :closable="false" v-if="isDocumentUploading">
        <h4>Uploading...</h4>
        <b-loading :is-full-page="true" :active.sync="isDocumentUploading" :can-cancel="false">
          <b-icon icon="attachment" size="is-large" custom-class="fa-spin"></b-icon>
        </b-loading>
      </b-notification>
      <div class="modal-card">
        <header
          class="modal-card-head has-background-info has-text-centered"
          style="justify-content: center;"
        >
          <p class="modal-card-title has-text-white">Create new Topic</p>
        </header>
        <section class="modal-card-body">
          <div class="columns">
            <div class="column is-6">
              <b-field
                label="Title"
                :type="{'is-danger': errors.has('title')}"
                :message="errors.first('title')"
              >
                <b-input
                  type="text"
                  v-model="item.title"
                  placeholder="Topic title*"
                  name="title"
                  v-validate="'required'"
                ></b-input>
              </b-field>
            </div>
            <!-- <div class="column is-4">
                <b-field
                  label="Due Date"
                  :type="{'is-danger': errors.has('due date')}"
                  :message="errors.first('due date')"
                >
                  <b-datepicker
                    v-model="item.endDate"
                    :min-date="new Date()"
                    placeholder="Due date"
                    name="due date"
                    icon="calendar-today"
                  ></b-datepicker>
                </b-field>
            </div>-->
            <div class="column is-6">
              <b-field
                label="Category"
                :type="{'is-danger': errors.has('category')}"
                :message="errors.first('category')"
              >
                <b-select
                  v-model="item.categoryId"
                  placeholder="Select a category"
                  expanded
                  name="category"
                >
                  <option
                    v-for="option in categoryList"
                    :value="option.id"
                    :key="option.id"
                  >{{ option.name }}</option>
                </b-select>
              </b-field>
            </div>
          </div>
          <div class="columns"></div>
          <b-field label="Description">
            <ckeditor :editor="editor" v-model="item.description" :config="editorConfig"></ckeditor>
          </b-field>
          <p class="control attachment-btn">
            <button type="button" class="button" @click="openAttachFile">
              <b-icon icon="attachment"></b-icon>
              <span style="margin-left:4px">Add Files</span>
            </button>
          </p>
          <template v-for="(file,index) in item.files">
            <FilePreview
              :bucket="'feedback'"
              :key="index"
              :fileData="file"
              :hasDownload="false"
              :index="index"
              @onDelete="removeFile($event)"
            />
          </template>
        </section>
        <footer class="modal-card-foot has-background-info" style="justify-content: center;">
          <div class="is-pulled-right">
            <button class="button" type="button" @click="cancel">Close</button>
            <button class="button is-primary">Save</button>
          </div>
        </footer>
      </div>
    </form>
  </div>
</template>
<script>
import { AgendaAPI, PostCategoryAPI } from '@/api';
import FilePreview from '@/components/FilePreview.vue';
import FileUpload from '@/components/FileUpload.vue';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { mapState } from 'vuex';

export default {
  name: 'NewAgenda',
  components: {
    FilePreview
  },
  data() {
    return {
      item: {
        files: []
      },
      categoryList: [],
      editor: ClassicEditor,
      editorConfig: {
        // The configuration of the rich-text editor.
      }
    };
  },
  props: {
    mainTopicId: { required: true }
  },
  created() {
    this.getCategoryList();
  },
  computed: {
    ...mapState('DocumentStore', [
      'documentUploadProgress',
      'isDocumentUploading'
    ])
  },
  methods: {
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
    cancel() {
      this.$emit('close');
    },
    async getCategoryList() {
      const categories = await PostCategoryAPI.all();
      this.categoryList = categories.rows;
    },
    async save() {
      const valid = await this.$validator.validateAll();
      if (valid) {
        const formData = new FormData();
        Object.keys(this.item).forEach((key) => {
          const value = typeof this.item[key] === 'object'
            && !(this.item[key] instanceof Date)
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

        formData.append('mainTopicId', this.mainTopicId);

        this.$store.commit('DocumentStore/setDocumentUploading', true);

        await AgendaAPI.create(formData);
        this.$store.commit('DocumentStore/setDocumentUploading', false);
        this.$store.commit('DocumentStore/setDocumentUploadProgress', 0);
        this.$toast.open({
          message: 'Sub Topic created.',
          type: 'is-success',
          position: 'is-top'
        });
        this.$emit('close', true);
      }
    },
    removeFile(index) {
      this.item.files.splice(index, 1);
    }
  }
};
</script>
<style scoped>
.modal-card {
  width: 740px;
  min-height: 550px;
}
.ck.ck-editor__editable_inline > :last-child {
  height: 200px;
}
</style>
