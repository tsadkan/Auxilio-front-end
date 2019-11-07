<template>
<form @submit.prevent="editComment" novalidate >
      <div class="modal-card">
        <header
          class="modal-card-head has-background-info has-text-centered"
          style="justify-content: center;"
        >
          <p class="modal-card-title has-text-white">Edit Reply</p>
        </header>
        <section class="modal-card-body">
            <article class="media">
                <div class="media-content">
                <b-field :type="{'is-danger': errors.has('comment')}" :message="errors.first('comment')">
                    <b-input
                    v-model="bodyContent"
                    v-validate="'required'"
                    type="textarea"
                    minlength="1"
                    name="comment"
                    placeholder="Add a reply..."
                    />
                </b-field>
                <div class="field">
                    <p class="control">
                    <button class="button is-primary">Edit reply</button>
                    </p>
                </div>
                </div>
                <br>
            </article>
        </section>
      </div>
</form>
</template>
<script>
import { AuthService } from '@/services';
import { CommentAPI } from '@/api';

export default {
  name: 'CommentInput',
  props: {
    commentId: {
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
      bodyContent: this.body,
      userProfile: {}
    };
  },
  created() {
    this.userProfile = AuthService.getProfile();
  },
  methods: {
    async editComment() {
      const valid = await this.$validator.validateAll();
      if (!valid) {
        return;
      }
      const formData = new FormData();
      formData.append('id', this.commentId);
      formData.append('body', this.bodyContent);
      const response = await CommentAPI.update(formData);
      this.$toast.open({
        message: 'Reply updated successfully.',
        type: 'is-success',
        position: 'is-top'
      });
      this.$emit('close', response);
    }
  }
};
</script>
