<template>
  <article class>
     <form @submit.prevent="editFeedback" novalidate >
      <div class="modal-card">
        <header
          class="modal-card-head has-background-info has-text-centered"
          style="justify-content: center;"
        >
          <p class="modal-card-title has-text-white">Edit Feedback</p>
        </header>
        <section class="modal-card-body">
          <div class="media-content">
            <b-field :type="{'is-danger': errors.has('feedback')}" :message="errors.first('feedback')">
              <b-input
                v-model="bodyContent"
                v-validate="'required'"
                type="textarea"
                minlength="1"
                name="feedback"
                placeholder="Add a comment..."
              />
            </b-field>
            <div class="field">
              <p class="control">
                <button class="button is-primary submit">Edit comment</button>
              </p>
            </div>
          </div>
        </section>
      </div>
     </form>
    <br>
  </article>
</template>
<script>
import { AuthService } from '@/services';
import { FeedbackAPI } from '@/api';

export default {
  name: 'FeedbackEditModal',
  props: {
    feedbackId: {
      type: [String],
      default: () => ''
    },
    body: {
      type: [String],
      default: () => ''
    }
  },
  data() {
    return {
      userProfile: {},
      bodyContent: this.body
    };
  },
  created() {
    this.userProfile = AuthService.getProfile();
  },
  methods: {
    async editFeedback() {
    alert(`${this.bodyContent}, ${this.feedbackId}`)
      const valid = await this.$validator.validateAll();
      if (!valid) {
        return;
      }
      console.log(this.bodyContent, this.feedbackId)
      const formData = new FormData();
      formData.append('body', this.bodyContent);
      formData.append('id', this.feedbackId);
      const response = await FeedbackAPI.update(formData);
      this.$toast.open({
        message: 'Comment edited successfully.',
        type: 'is-success',
        position: 'is-top'
      });
      this.$emit('close', response);
    }
  }
};
</script>
