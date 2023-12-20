<template>
    <div v-if="isModalVisible" class="modal">
      <div class="modal-content">
        <span class="close" @click="$emit('close')">&times;</span>
        <ul>
       
        </ul>
      </div>
    </div>
  </template>
  
  <script lang="ts">
import { defineComponent } from 'vue';
import type { PropType } from 'vue';
  
  export default defineComponent({
    name: 'FavoriteMoviesModal',
    props: {
      isModalVisible: {
        type: Boolean as PropType<boolean>,
        required: true,
      },
    },
    data() {
      return {
        favoriteMovies: [], 
      };
    },
  });
  </script>
  
  <style scoped>
  .modal {
    margin:0
  }
  .modal-content {
    margin:0
  }
  .close {
    margin:0
  }
  </style>