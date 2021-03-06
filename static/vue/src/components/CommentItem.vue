<template>
  <article class="media">
    <figure class="media-left">
      <user-avatar
        v-if="comment.createdBy"
        :bucket="'users'"
        :size="64"
        :file-name="comment.createdBy.profilePicture"
      />
    </figure>
    <div class="media-content" :id="`target-${comment.id}`">
      <div class="content" v-if="!editMode">
        <p>
          <strong class="comment-creater" v-if="comment.createdBy"  @click.stop="openProfile(comment.createdBy.id)">{{`${comment.createdBy.givenName} ${comment.createdBy.familyName}`}}</strong>
          <br>
          <span v-html="urlify (comment.body)"></span>
          <link-preview :url="getFirstUrl(comment.body)"></link-preview>
          <br>
          <small>{{comment.createdAt | formatDate}}</small>
          &nbsp;&nbsp;
          <small
            v-if="$acl.hasPermission(comment)"
            class="has-text-link pointer"
            @click="editComment"
          >EDIT</small>
          &nbsp;&nbsp;
          <small
            v-if="$acl.hasPermission(comment)"
            class="has-text-danger pointer"
            @click="deleteComment"
          >DELETE</small>
          <small
            class="has-text-link pointer show-reply"
            @click="addReply"
          ><b-icon icon="reply" type="is-info" size="is-small"></b-icon>reply</small>
        </p>
      </div>
      <div v-if="editMode">
        <comment-edit
          @success="handleCommentUpdated($event)"
          :comment-id="comment.id"
          :body="comment.body"
        />
      </div>
      <comment-reply-item
        v-for="(comment, i) in comment.replies"
        @deleted="handleDeleteSuccess(i)"
        :key="i"
        :comment="comment"
      />
      <div v-if="showReplyBox">
        <comment-reply-input @success="handleNewReply($event)" :reply-id="comment.id"/>
      </div>
    </div>
  </article>
</template>
<script>
import { CommentAPI } from '@/api';
import CommentEdit from './CommentEdit.vue';
import UserAvatar from './UserAvatar.vue';
import CommentReplyInput from './CommentReplyInput.vue';
import CommentReplyItem from './CommentReplyItem.vue';
import CommentEditModal from './CommentEditModal.vue';
import CommentReplyInputModal from './CommentReplyInputModal.vue';

export default {
  name: 'FeedbackReplyItem',
  components: {
    CommentEdit,
    UserAvatar,
    CommentReplyInput,
    CommentReplyItem
  },
  props: {
    comment: {
      type: [Object],
      default: () => {}
    }
  },
  data() {
    return {
      editMode: false,
      showReplyBox: false,
      window: {
        width: 0,
        height: 0
      }
    };
  },
  created() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  },
  methods: {
    handleCommentUpdated(data) {
      this.comment = data;
      this.editMode = false;
    },
    addReply() {
      if (this.window.width < 700) {
        this.$modal.open({
          scroll: 'keep',
          parent: this,
          props: {
            commentId: this.comment.id
          },
          events: {
            close: (data) => {
              this.comment.replies.push(data);
            }
          },
          component: CommentReplyInputModal,
          hasModalCard: true
        });
      } else {
        this.showReplyBox = !this.showReplyBox;
      }
    },
    editComment() {
      if (this.window.width < 700) {
        this.$modal.open({
          scroll: 'keep',
          parent: this,
          props: {
            commentId: this.comment.id,
            body: this.comment.body
          },
          events: {
            close: (data) => {
              this.comment = data;
            }
          },
          component: CommentEditModal,
          hasModalCard: true
        });
      } else {
        this.editMode = true;
      }
    },
    deleteComment() {
      this.$dialog.confirm({
        title: 'Deleting reply',
        message:
          'Are you sure you want to <b>delete</b> your reply? This action cannot be undone.',
        confirmText: 'Delete Reply',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: async () => {
          await CommentAPI.remove(this.comment.id);
          this.$toast.open({
            message: 'Reply deleted.',
            type: 'is-success',
            position: 'is-top'
          });
          this.$emit('deleted');
        }
      });
    },
    openProfile(id) {
      this.$router.push({ name: 'profile', query: { userAccountId: id } });
    },
    handleNewReply(reply) {
      if (!reply) return;
      if (!this.comment.replies) {
        const replies = [reply];
        this.$set(this.comment, 'replies', replies);
      } else {
        const { replies } = this.comment;
        replies.push(reply);
        this.$set(this.comment, 'replies', replies);
      }
    },
    handleDeleteSuccess(index) {
      if (Number.isNaN(index) || !this.comment || !this.comment.replies) {
        return;
      }
      this.comment.replies.splice(index, 1);
    },
    urlify(text) {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      return text.replace(urlRegex, url => `<a href="${url}">${url}</a>`);
    },
    getFirstUrl(text) {
      // eslint-disable-next-line no-useless-escape
      const match = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.exec(text);
      return (match && match[0]) || null;
    },
    handleResize() {
      this.window.width = window.innerWidth;
      this.window.height = window.innerHeight;
    }
  }
};
</script>
<style>
.comment-creater {
  cursor: pointer;
}
.comment-creater:hover {
  color: #593c79;
}
.show-reply {
  margin-left: 10px;
}
</style>
