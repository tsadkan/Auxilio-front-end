<template>
  <form class="columns" @submit.prevent="save" novalidate>
    <div class="column is-8 is-offset-2">
      <header
        class="modal-card-head has-background-info has-text-centered"
        style="justify-content: center;"
      >
        <p class="modal-card-title has-text-white">Create new agenda</p>
      </header>
      <section class="modal-card-body">
        <div class="columns">
          <div class="column">
            <b-field
            label="Title"
            :type="{'is-danger': errors.has('title')}"
            :message="errors.first('title')"
            >
            <b-input
                type="text"
                v-model="item.title"
                placeholder="title*"
                title="title"
                v-validate="'required'"
            ></b-input>
            </b-field>
            <b-field label="Description">
                <ckeditor :editor="editor" v-model="item.description" :config="editorConfig"></ckeditor>
            </b-field>
          </div>
        </div>
      </section>

      <footer class="modal-card-foot has-background-info" style="justify-content: right;">
        <div class="is-pulled-right">
          <button class="button" type="button" @click="cancel">Cancel</button>
          <button :disabled="isSaving" class="button is-primary">Save</button>
        </div>
      </footer>
    </div>
  </form>
</template>
<script>
import { AgendaAPI } from '@/api';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export default {
  name: 'NewAgenda',
  data() {
    return {
      isSaving: false,
      item: {
      },
      categoryList: [],
      editor: ClassicEditor,
      editorConfig: {
        // The configuration of the rich-text editor.
      }
    };
  },
  created() {
    this.item.id = this.$route.params.agendaId;
    if (this.item.id) this.getMainTopic(this.item.id);
  },
  methods: {
    cancel() {
      this.$router.push({ name: 'agendas' });
    },
    async getMainTopic(id) {
      this.item = await AgendaAPI.getTopic(id);
    },
    async save() {
      const valid = await this.$validator.validateAll();
      if (valid) {
        this.isSaving = true;
        await AgendaAPI.createMainTopic(this.item);
        this.$toast.open({
          message: 'Topic created successfully.',
          type: 'is-success',
          position: 'is-top'
        });
        this.isSaving = false;
        this.$router.push({ name: 'agendas' });
      }
    }
  }
};
</script>
<style>
@media (max-width: 500px) {
    .modal-card {
      width: 340px !important;
    }
}
</style>
