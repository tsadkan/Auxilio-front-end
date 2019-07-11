<template>
  <div v-if="fileData" class="columns no-padding">
    <div class="column">
      <div class="site-card pointer file-preview-card">
        <div class="card-body">
          <h3 class="card-title-small" v-if="fileData.meta.title">{{fileData.meta.title}}</h3>
          <div class="header-text" v-if="fileData.meta.year">Year of Report : {{fileData.meta.year }}</div>
          <h3 class="card-title-small" v-if="fileData.meta.summary">Summary</h3>
          <div  v-if="fileData.meta.summary" v-html="fileData.meta.summary" class="header-text"></div>
          <h3 v-if="fileData.meta.bibliography"  class="card-title-small">Citation</h3>
          <div  v-if="fileData.meta.bibliography" v-html="fileData.meta.bibliography" class="header-text"></div>
          <article class="media no-border">
            <div class="media-left no-margin-right">
              <figure class="image is-24x24 sub-comment-figure">
                <b-icon :icon="getIcon(fileData.file.fileType || fileData.file.type)"></b-icon>
              </figure>
            </div>
            <div v-if="fileData.file" class="media-content">
              <div class="content" style="margin-top: 3px;">
                <strong style="word-wrap: break-word">{{fileData.file.name | limitTo(40, '...')}}({{bytesToSize(fileData.file.size)}})</strong>
                <span @click="close"><b-icon v-if="!hasDownload" icon="close" style="float:right"></b-icon></span>
                <span @click="download"><b-icon v-if="hasDownload" icon="download" style="float:right"></b-icon></span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ContainerAPI } from '@/api';

export default {
  name: 'FilePreview',
  props: {
    bucket: {
      type: String,
      default: '',
      required: true
    },
    fileData: {
      type: Object,
      default: () => null
    },
    hasDownload: {
      type: Boolean,
      default: true
    },
    index: {
      type: Number,
      default: null
    }
  },
  methods: {
    async download() {
      console.log(this.fileData.file.name);
      if (!this.fileData || !this.fileData.file.name) return;
      const response = await ContainerAPI.get(
        this.bucket,
        this.fileData.file.name
      );

      // CREDITS: https://gist.github.com/javilobo8/097c30a233786be52070986d8cdb1743
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', this.fileData.file.name);
      document.body.appendChild(link);
      link.click();
    },
    close() {
      this.$emit('onDelete', this.index);
    },
    bytesToSize(bytes) {
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      if (bytes === 0) return 'n/a';
      const i = parseInt(Math.floor(Math.log(Math.abs(bytes)) / Math.log(1024)), 10);
      if (i === 0) return `${bytes} ${sizes[i]})`;
      return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`;
    },
    getIcon(fileType) {
      if (fileType.startsWith('image')) { return 'image'; }
      if (fileType.startsWith('application/pdf')) { return 'file-pdf'; }
      if (fileType.startsWith('video')) { return 'video'; }

      return 'file';
    }
  }
};
</script>

<style>
.file-preview-card {
  padding-bottom: 5px;
}
</style>
