<template>
  <form @submit.prevent="performSearch" class="search-bar">
    <button type="submit">Search</button>
    <input v-model="searchQuery" type="text" placeholder="Search for movies..." />
  </form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'SearchBar',
  setup(_, context) {
    const searchQuery = ref('');
    const performSearch = () => {
      context.emit('performSearch', searchQuery.value);
    };
    return {
      searchQuery,
      performSearch,
    };
  }
});
</script>
<style scoped>

.search-bar {
  z-index: 3;
  height: 3rem;
  padding: 1rem 0.3rem;
  display: flex;
  align-items: center;
  position: relative;
  background: #0c0b0f;
  border-radius: 0 0.4rem 0.4rem 0;
  align-self: center;
  width:100%;
}

.search-bar input {
  position: relative;
  background: #0c0b0f;
  border-radius: 0.3rem;
  width: 27rem;
  padding: 0.5rem;
  font-size: 1.1em;
  border: 0;
  color: white;
}

.search-bar button {
  cursor: pointer;
  border-radius: 0.3rem;
  font-weight: 500;
  background-color: #211f29;
  flex-shrink: 0;
  padding: 0.2rem;
  border: 1px solid transparent;
  padding: 0.5rem 2rem;
  font-size: 1.2rem;
  color: #d3d2d6;
  transition: background-color 0.3s ease;
}

.search-bar button:hover {
  background-color: #322f3d;
}
</style>