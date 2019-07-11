<template>
  <div>
    <form @submit.prevent="save" novalidate>
      <div class="modal-card">
        <header
          class="modal-card-head has-background-info has-text-centered"
          style="justify-content: center;"
        >
        <p class="modal-card-title has-text-white">Resources</p>
        </header>
         <section class="modal-card-body">
             <div class="columns is-multiline">
                <div class="column" v-for="item in items">
                    <div class="card" v-for="file in item.files" @click="downloadFile(file.name)" style="margin-bottom:10px">
                        <div class="card-content">
                            <p class="subtitle">
                            <b-icon :icon="getIcon(file.fileType)"></b-icon>
                            {{ file.name | limitTo(20, '...') }} ({{bytesToSize(file.size)}})
                            </p>
                        </div>
                        <footer class="card-footer">
                            <p class="card-footer-item">
                            <span>
                                {{
                                    item.uploadedBy.givenName.toUpperCase() +
                                    ' ' +
                                    item.uploadedBy.familyName.toUpperCase()
                                }}
                            </span>
                            </p>
                            <p class="card-footer-item">
                            <span>
                                {{ item.createdAt | formatDate }}
                            </span>
                            </p>
                        </footer>
                    </div>
                </div>
            </div>

        </section>
        <footer class="modal-card-foot has-background-info" style="justify-content: center;">
          <div class="is-pulled-right">
            <button class="button" type="button" @click="cancel">Close</button>
          </div>
        </footer>
      </div>
    </form>
  </div>
</template>
<script>
import { GenericDocumentAPI, ContainerAPI } from '@/api';

export default {
  name: 'GenericDocument',
  data() {
    return {
      loading: true,
      totalItems: 0,
      items: [],
      bucket: 'generic-document'
    };
  },
  created() {
    this.loadDocuments();
  },
  methods: {
    cancel() {
      this.$emit('close', false);
    },
    async loadDocuments() {
      this.loading = true;
      const { rows, count } = await GenericDocumentAPI.all();
      this.items = rows;
      this.totalItems = count;
      this.loading = false;
    },
    async downloadFile(fileName) {
      ContainerAPI.openFile(this.bucket, fileName);
      // const response = await ContainerAPI.get(
      //   this.bucket,
      //   fileName
      // );

      // const url = window.URL.createObjectURL(new Blob([response]));
      // const link = document.createElement('a');
      // link.href = url;
      // link.setAttribute('download', fileName);
      // document.body.appendChild(link);
      // link.click();
    },
    getIcon(fileType) {
      if (fileType.startsWith('image')) { return 'image'; }
      if (fileType.startsWith('application/pdf')) { return 'file-pdf'; }
      if (fileType.startsWith('video')) { return 'video'; }

      return 'file';
    },
    bytesToSize(bytes) {
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      if (bytes === 0) return 'n/a';
      const i = parseInt(Math.floor(Math.log(Math.abs(bytes)) / Math.log(1024)), 10);
      if (i === 0) return `${bytes} ${sizes[i]})`;
      return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`;
    }
  }
};
</script>
<style scoped>
.modal-card {
  width: 740px;
  min-height: 550px;
}
.modal-card label {
  font-weight: 600;
}
.card {
  box-shadow: 0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)
}
</style>
