<template>
  <div v-if="fileData" class="columns no-padding">
    <div class="column">
      <div class="site-card pointer">
        <div class="card-body">
          <h3 class="card-title-small">{{fileData.meta.title}}</h3>
          <div class="header-text">{{fileData.meta.year | formatDate }}</div>
          <h3 class="card-title-small">Summery</h3>
          <div class="header-text">{{fileData.meta.summary}}</div>
          <h3 class="card-title-small">Bibliography</h3>
          <div class="header-text">{{fileData.meta.bibliography}}</div>
          <article class="media no-border">
            <div class="media-left no-margin-right">
              <figure class="image is-24x24 sub-comment-figure">
                <b-icon icon="file"></b-icon>
              </figure>
            </div>
            <div v-if="fileData.file" @click="download" class="media-content">
              <div class="content" style="margin-top: 3px;">
                <strong>{{fileData.file.name}}</strong>
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
    }
  },
  methods: {
    async download() {
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
    }
  }
};
</script>

<style>
</style>