<template>
<div class="modal-card">
        <header
          class="modal-card-head has-background-info has-text-centered"
          style="justify-content: center;"
        >
        <p class="modal-card-title has-text-white">News</p>
        </header>
         <section class="modal-card-body">
  <div class="announcement-container">
    <div class="card" v-for="item in items" :key="item.id" style="margin-bottom: 10px">
        <div class="card-image">
            <!-- <figure class="image is-2by4"> -->
                <img :src="newsUrl(item.featuredImage)" @click="downloadFile(item.featuredImage)" alt="News Image" style=" display: block;
  max-height:250px;
  width: 100%;
  height: auto;">
            <!-- </figure> -->
        </div>
        <div class="card-content">
            <div class="media">
                <div class="media-left">
                    <figure class="image is-48x48">
                        <img :src="imgUrl(item.uploadedBy.profilePicture)" alt="Profile picture">
                    </figure>
                </div>
                <div class="media-content">
                    <p class="title is-4">
                      {{
                          item.uploadedBy.givenName.toUpperCase() +
                          ' ' +
                          item.uploadedBy.familyName.toUpperCase()
                      }}
                    </p>
                </div>
            </div>

            <div class="content">
                <span v-if="item.title">{{ item.title }}</span>
                <br>
                <span v-if="item.content">{{ item.content }}</span>
                <br>
                <small>{{ item.createdAt | formatDate }}</small>
            </div>
        </div>
    </div>
  </div>
         </section>
</div>
</template>
<script>
import { NewsAPI, ContainerAPI, API_ROOT } from '@/api';

export default {
  name: 'Announcement',
  data() {
    return {
      loading: true,
      totalItems: 0,
      items: [],
      bucket: 'news',
      userBucket: 'users'
    };
  },
  created() {
    this.loadNews();
  },
  methods: {
    cancel() {
      this.$emit('close', false);
    },
    async loadNews() {
      this.loading = true;
      const { rows, count } = await NewsAPI.all();
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
    imgUrl(imgName) {
      if (!this.userBucket || !imgName) {
        return `${API_ROOT}/Containers/${this.userBucket}/download/avatar_anonymous.png`;
      }
      return `${API_ROOT}/Containers/${this.userBucket}/download/${imgName}`;
    },
    newsUrl(imgName) {
      return `${API_ROOT}/Containers/${this.bucket}/download/${imgName}`;
    },
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
.announcement-container {
  /* height: 700px; */
  /* overflow-y: scroll; */
  /* background:#fff; */
}
</style>
