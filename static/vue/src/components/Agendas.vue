<template>
  <div style="padding-top:0.5em;">
    <vue-next-level-scroll :target="`#topic-${mainTopicId}`" ref="scrollRef"></vue-next-level-scroll>
    <div v-if="isLoading" class="columns spinner">
      <atom-spinner :animation-duration="1000" :size="60" :color="'rgb(255,255,255)'"/>
    </div>
    <div v-if="!isLoading" class="columns is-centered">
      <div class="column is-narrow has-text-centered">
        <b-tag type="is-white" class="categories" @click.native="filterByAll()">All</b-tag>
        <b-tag
          class="categories"
          v-for="(category, i) in categoryList"
          :key="i"
          :closable="$acl.hasModeratorPermission()"
          v-bind:style="[{background: category.color }]"
          @close="deleteCategory(category.id)"
          @click.native="filterByCategory(category.id)"
        >{{category.name}}</b-tag>
        <tag
          v-if="$acl.hasModeratorPermission()"
          @click.native="openCategoryModal()"
          class="add-category"
        >
          <b-tooltip label="New Category" position="is-bottom">+</b-tooltip>
        </tag>
      </div>
    </div>
    <div v-if="!isLoading && agendaList.length == 0" class="columns no-found">
      <p>No agenda found.</p>
    </div>

    <!-- <div v-if="!isLoading && window.width < 700" class="agenda-container"> -->
      <!-- <draggable v-model="agendaList"> -->
      <!-- <Container @drop="onDrop" orientation='vertical'>
        <Draggable class="agenda-card" v-for="(agenda, i) in agendaList" :key="i">
          <agenda-item
            :parentIndex="i"
            :content="agenda"
            @onDelete="deleteTopic($event)"
            @onLeave="leaveTopic($event, i)"
            @onCardDrop="onCardDrop()"
            class="draggable-item"
          ></agenda-item>
        </Draggable>
      </Container> -->
      <!-- </draggable> -->
    <!-- </div> -->
    <div v-if="!isLoading" class="agenda-container">
      <!-- <draggable v-model="agendaList"> -->
      <Container @drop="onDrop" orientation="horizontal">
        <Draggable class="agenda-card" v-for="(agenda, i) in agendaList" :key="i">
          <agenda-item
            :parentIndex="i"
            :content="agenda"
            @onDelete="deleteTopic($event)"
            @onLeave="leaveTopic($event, i)"
            @onCardDrop="onCardDrop()"
            class="draggable-item"
          ></agenda-item>
        </Draggable>
      </Container>
      <!-- </draggable> -->
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { AtomSpinner } from 'epic-spinners';
// import draggable from 'vuedraggable';
import { Container, Draggable } from 'vue-smooth-dnd';
import VueNextLevelScroll from 'vue-next-level-scroll';
// import { applyDrag, generateItems } from './utils';
import AgendaItem from './AgendaItem.vue';
import { AgendaAPI, PostCategoryAPI } from '@/api';
import NewCategory from './NewCategory.vue';
import ConfirmationDialog from '../shared/components/ConfirmationDialog.vue';

export default {
  components: {
    AgendaItem,
    AtomSpinner,
    // draggable,
    Container,
    Draggable,
    VueNextLevelScroll
  },
  name: 'Agendas',
  data() {
    return {
      agendaList: [],
      categoryList: [],
      isLoading: true,
      mainTopicId: null,
      window: {
        width: 0,
        height: 0
      }
    };
  },
  computed: {
    ...mapGetters('core', ['dragElement', 'dropElement'])
  },
  created() {
    this.getCategories();
    this.getAgendas();
    if (this.$route.query.mainTopicId) {
      this.mainTopicId = this.$route.query.mainTopicId;
    }
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  },
  updated() {
    this.scrolltoTarget();
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    async getCategories() {
      const categories = await PostCategoryAPI.all();
      this.categoryList = categories.rows;
    },
    async getAgendas(filter = {}) {
      this.isLoading = true;
      const agendas = await AgendaAPI.all(filter);
      this.agendaList = agendas.rows;
      this.isLoading = false;
    },
    async filterByCategory(categoryId) {
      if (categoryId) {
        await this.getAgendas({ categoryId });
        this.agendaList = this.agendaList.filter(
          agenda => agenda.subTopics.rows.length > 0
        );
      }
    },
    async filterByAll() {
      await this.getAgendas();
    },
    openCategoryModal() {
      this.$modal.open({
        scroll: 'keep',
        parent: this,
        events: {
          close: () => {
            this.getCategories();
          }
        },
        component: NewCategory,
        hasModalCard: true
      });
    },
    deleteCategory(id) {
      this.$modal.open({
        scroll: 'keep',
        parent: this,
        events: {
          close: async (data) => {
            if (data) {
              await PostCategoryAPI.remove(id);
              this.getCategories();
              this.$toast.open({
                message: 'Category deleted.',
                type: 'is-success',
                position: 'is-top'
              });
            }
          }
        },
        component: ConfirmationDialog,
        hasModalCard: true
      });
    },
    async deleteTopic(id) {
      await AgendaAPI.removeMainTopic(id);
      this.getAgendas();
      this.$toast.open({
        message: 'Topic deleted.',
        type: 'is-success',
        position: 'is-top'
      });
    },
    scrolltoTarget() {
      const elem = this.$refs.scrollRef;
      elem.click();
    },
    leaveTopic(index) {
      this.agendaList.splice(index, 1);
    },
    onDrop(dropResult) {
      this.agendaList = this.applyDrag(this.agendaList, dropResult);
    },
    applyDrag(arr, dragResult) {
      const { removedIndex, addedIndex, payload } = dragResult;
      if (removedIndex === null && addedIndex === null) return arr;

      const result = [...arr];
      let itemToAdd = payload;

      if (removedIndex !== null) {
        // eslint-disable-next-line prefer-destructuring
        itemToAdd = result.splice(removedIndex, 1)[0];
      }

      if (addedIndex !== null) {
        result.splice(addedIndex, 0, itemToAdd);
      }

      return result;
    },
    onCardDrop() {
      const { removedIndex, columnId } = this.dragElement;
      const { addedIndex, dropColumnId } = this.dropElement;
      if (addedIndex !== -1 && removedIndex !== -1) {
        const dragContent = this.agendaList.filter(agenda => agenda.id === columnId)[0];
        const dropContent = this.agendaList.filter(agenda => agenda.id === dropColumnId)[0];

        const dragIndex = this.agendaList.indexOf(dragContent);
        const dropIndex = this.agendaList.indexOf(dropContent);

        const contentToMove = this.agendaList[dragIndex].subTopics.rows[removedIndex];
        this.agendaList[dragIndex].subTopics.rows.splice(removedIndex, 1);
        this.agendaList[dropIndex].subTopics.rows.splice(addedIndex, 0, contentToMove);

        this.$store.commit('core/changeDragElement', { removedIndex: -1, columnId: '' });
        this.$store.commit('core/changeDropElement', { addedIndex: -1, dropColumnId: '' });

        const postId = contentToMove.id;
        const mainTopicId = dropContent.id;
        AgendaAPI.movePost({
          postId,
          mainTopicId
        });
      }
    },
    handleResize() {
      this.window.width = window.innerWidth;
      this.window.height = window.innerHeight;
    }
  }
};
</script>
<style scoped lapng="scss">
.spinner {
  margin-top: 200px;
  margin-left: 50%;
}
.no-found {
  font-size: 20px;
  color: rgb(255, 255, 255);
  margin-top: 200px;
  margin-left: 30%;
}
.add-category {
  color: #fff !important;
  background-color: #08020266 !important;
  font-size: 18px;
}
.add-category:hover {
  background-color: #111 !important;
}
.categories {
  margin: 10px;
  cursor: pointer;
}

.agenda-container {
  overflow-y: auto;
  padding: 10px;
}

.agenda-container, .agenda-card {
  transform:rotateX(180deg);
  -moz-transform:rotateX(180deg); /* Mozilla */
  -webkit-transform:rotateX(180deg); /* Safari and Chrome */
  -ms-transform:rotateX(180deg); /* IE 9+ */
  -o-transform:rotateX(180deg); /* Opera */

}
.agenda-card {
  display: table-cell;
  padding-left: 1em;
}
::-webkit-scrollbar {
  border: 6px solid #666;
}
::-webkit-scrollbar-thumb {
  background: #999;
  opacity: 0.7;
  height: 2px;
  width: 10px;
}
.tag {
  color: #fff;
}
</style>
