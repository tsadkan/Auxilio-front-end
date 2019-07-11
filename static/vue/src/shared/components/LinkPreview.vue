<template>
  <div>
    <div id="loader-container" v-if="!response && validUrl" :style="{width:cardWidth}">
      <slot name="loading">
        <div class="spinner"></div>
      </slot>
    </div>
    <div v-if="response">
      <!-- <slot :img="response.images[0]" :title="response.title" :description="response.description" :url="url"> -->
        <div class="wrapper" :style="{width:cardWidth}" @click="viewMore">
            <!-- <div class="card-img">
                <img :src="response.images[0]">
            </div> -->
            <div class="card-info">
              <a :href="url" class="url">{{url | limitTo(30, "...")}}</a>
            </div>
            <div class="card-text link-preview-content">
                <h6 class="header">{{response.title | limitTo(35, "...")}}</h6>
                <p class="content">{{response.description | limitTo(100, "...")}}</p>
                <div class="video-container">
                  <div v-if="isVideo" class="play-icon">
                    <b-icon
                      icon="play"
                      size="is-large">
                    </b-icon>
                  </div>
                  <div class="card-img img-content">
                      <img :src="response.images[0]" style="height:200px">
                  </div>
                </div>
                
            </div>
            <div class="card-btn">
                <a href="javascript:;" v-if="showButton" @click="viewMore">View More</a>
            </div>
            </div>
        </div>
    <!-- </slot> -->
    </div>
  </div>
</template>

<script>
import urlParser from 'js-video-url-parser';

export default {
  name: 'link-prevue',
  props: {
    url: {
      type: String,
      default: ''
    },
    isVideo: {
      type: Boolean,
      default: false
    },
    cardWidth: {
      type: String,
      default: '400px'
    },
    onButtonClick: {
      type: Function,
      default: undefined
    },
    showButton: {
      type: Boolean,
      default: false
    },
    apiUrl: {
      type: String,
      default: 'https://linkpreview-api.herokuapp.com/'
    }
  },
  watch: {
    url() {
      this.response = null;
      this.getLinkPreview();
    }
  },
  created() {
    if (this.url) {
      const response = urlParser.parse(this.url);
      this.isVideo = (response && response.mediaType && response.mediaType === 'video') || false;
    }
    this.getLinkPreview();
  },
  data() {
    return {
      response: null,
      validUrl: false,
      isLoading: true,
    };
  },
  methods: {
    viewMore() {
      if (this.onButtonClick !== undefined) {
        this.onButtonClick(this.response);
      } else {
        const win = window.open(this.url, '_blank');
        win.focus();
      }
    },
    isValidUrl(url) {
      const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
      this.validUrl = regex.test(url);
      return this.validUrl;
    },
    getLinkPreview() {
      if (this.isValidUrl(this.url)) {
        this.httpRequest((response) => {
          this.response = JSON.parse(response);
        }, () => {
          this.response = null;
          this.validUrl = false;
        });
      }
    },
    httpRequest(success, error) {
      const http = new XMLHttpRequest();
      const params = `url=${this.url}`;
      http.open('POST', this.apiUrl, true);
      http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      http.onreadystatechange = () => {
        if (http.readyState === 4 && http.status === 200) {
          success(http.responseText);
        }
        if (http.readyState === 4 && http.status === 500) {
          error();
        }
      };
      http.send(params);
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Hind+Siliguri:400,600');

.wrapper {
  overflow: auto;
  border-radius: 7px 7px 7px 7px;
  background-color: #fff;
  -webkit-box-shadow: 0px 14px 32px 0px rgba(0, 0, 0, 0.15);
  -moz-box-shadow: 0px 14px 32px 0px rgba(0, 0, 0, 0.15);
  box-shadow: 0px 14px 32px 0px rgba(0, 0, 0, 0.15);
}

.card-img {
  width: 100%;
}

.card-img img {
  width: 100%;
  border-radius: 7px 7px 0 0;
}

img {
  vertical-align: middle;
  border-style: none;
}

.card-info {
  border-radius: 0 0 7px 7px;
  background-color: #ffffff;
}

.card-text {
  width: 80%;
  margin: 0 auto;
  text-align: justify;
}

.card-text h1 {
  text-align: center;
  font-size: 24px;
  color: #474747;
  margin: 5px 0 5px 0;
  font-family: 'Hind Siliguri', sans-serif;
}

.card-text p {
  font-family: 'Hind Siliguri', sans-serif;
  color: #8d8d8d;
  font-size: 15px;
  overflow: hidden;
  margin: 0;
  text-align: center;
}

.card-btn {
  margin: 1em 0 1em 0;
  position: relative;
  text-align: center;
}

.card-btn a {
  border-radius: 2em;
  font-family: 'Hind Siliguri', sans-serif;
  font-size: 14px;
  letter-spacing: 0.1em;
  color: white;
  background-color: #593c79;
  padding: 10px 20px 10px 20px;
  text-align: center;
  display: inline-block;
  text-decoration: none !important;
  -webkit-transition: all 0.2s ease-in-out;
  -moz-transition: all 0.2s ease-in-out;
  -ms-transition: all 0.2s ease-in-out;
  -o-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
}

.card-btn a:hover {
  background-color: #9879ba;
}

/* Loader */
.spinner {
  margin-top: 40%;
  margin-left: 45%;
  height: 28px;
  width: 28px;
  animation: rotate 0.8s infinite linear;
  border: 5px solid #868686;
  border-right-color: transparent;
  border-radius: 50%;
}

.url {
  padding: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
}
.link-preview-content .header, .link-preview-content .content {
  text-align: left;
}

.link-preview-content .content {
  color: #402f43;
}

.card-info a {
  color: #593c79;
}

.link-preview-content {
  width: 90%;
  margin-top: 10px;
  border-left: 3px solid #593c79;
  padding-left: 10px;
}
.wrapper {
  padding-top: 10px;
}

.video-container {
  position: relative;
}

.play-icon {
  position: absolute;
  top: 45%;
  left: 45%;
  color: #ffffff;
  background: #593c79;
  opacity: 0.7;
  border-radius: 30px;
}

@keyframes rotate {
  0%    { transform: rotate(0deg); }
  100%  { transform: rotate(360deg); }
}
</style>
