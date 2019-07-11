<template>
  <div>
    <router-view/>
  </div>
</template>
<script>
export default {
  beforeCreate() {
    this.$store.commit('core/initializeStore');

    this.$store.subscribe((mutation, state) => {
      localStorage.setItem(
        'currentLanguage',
        JSON.stringify(state.core.currentLanguage)
      );
    });
  },
};
</script>
<style lang="scss">
.pointer{
  cursor: pointer;
}
.break {
  margin: 1em;
}
.editr {
    height: 300px;
}
</style>
