<template>
  <div class="mediaPlayer">
        <div class="media-controls">
          <i class="fa-regular fa-circle-play btn-start"></i>
          
       
        </div>
      </div>
  <div class="wrapper" v-if="movie">  
    <div class="content">
      <div class="img-section">
        <img :src="movie.results.primaryImage.url"  alt="Movie Poster" class="movie-img"> 
      </div>
      <div class="info-section">
        <h1>{{ movie.results.originalTitleText.text }}</h1>
        <p>{{ movie.results.releaseYear.year }}</p>
        <p>{{ movie.results.title}}</p>
        <button v-if="store.$state.isLoggedIn" @click="addFavorite">Add to Favorites</button>
      </div>  
    </div>
  </div>
</template>
  
<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import type { AxiosRequestConfig } from 'axios';
import { useMutation } from '@vue/apollo-composable';
import { AddFavoriteMovieDocument } from '../graphql/generated';
import { useStore } from '../store';
import axios from 'axios'; 
export default defineComponent({
  name: 'MovieComponent',
  setup() {
    const store = useStore();
    const { mutate: addFavoriteMovie } = useMutation(AddFavoriteMovieDocument);
    const route = useRoute();
    const movieId = ref(route.params.id as string);
    const movie = ref<any>(null);

    const addFavorite = async () => {
      if (!store.$state.isLoggedIn || typeof store.$state.userId !== 'number') {
        console.error('User is not logged in or user ID is not a number');
        return;
      }

      console.log('User ID:', store.$state.userId);
      console.log('Movie ID:', movieId.value);

      try {
        await addFavoriteMovie({ userId: Number(store.$state.userId), movieId: movieId.value });
      } catch (error) {
        console.error('Error adding favorite movie:', error);
      }
    };

    const performSearch = async () => {
      try {
        const options: AxiosRequestConfig = {
          method: 'GET',
          url: `https://moviesdatabase.p.rapidapi.com/titles/${movieId.value}`,
          headers: {
            'X-RapidAPI-Key': 'a2b106ed40mshef8139e02bba13fp136679jsne3475a09736c',
            'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com',
          },
        };
        const response = await axios(options);
        movie.value = response.data;
       
      } catch (error) {
        console.error('Error performing search:', error);
      }
    };

    onMounted(performSearch);

    return {
      movie,
      addFavorite,
      store,
    };
  },
});
</script>


<style scoped>
.wrapper{
  width:100%;
  
  display:flex;
  flex-direction: column;
  align-items: center;
}
.content{
  width:70%; /* 3/4 of the parent's width */
  height:200px;
  display:flex;
  background-color: #15131B;
  margin-bottom:100px;;
  padding:0;
}
.img-section, .info-section{
  height:100%; 

}
.img-section{
  flex: 1; 
}
.info-section{
  flex: 3;
  color:white;
}
h1, p {
  margin-left:1.3rem;
}
.movie-img{
  width:100%;
  height:100%;
  object-fit: cover; 
}
.mediaPlayer {
  width: 70%;
  height: 55%;
  background-color: #000;
  border-radius: 10px;
  padding: 10px;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.media-controls {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center; 
}
.btn-start{
  font-size:5em;
  color:#B29D84;

}
.btn-start:hover{
 
  cursor: pointer;
  font-size:5.2em;
}






</style>
