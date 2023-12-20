<template>
    <div>
      <div v-if="movies.length" class="movies-container">
        <div v-for="movie in movies" :key="movie._id" class="movie-box">
  <img :src="movie.primaryImage?.url" alt="Movie poster" class="movie-image">
  <div class="movie-info">
    <router-link :to="`/movie/${movie.id}`" class="movie-title">{{ movie.titleText?.text }}</router-link>

    <p>{{ movie.releaseYear?.year }}</p>
  </div>
</div>
      </div>
      <div v-else>
        <p>No movies found.</p>
      </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

export default defineComponent({
  name: 'MovieComponent',
  setup() {
    const route = useRoute();
    const movies = ref<any[]>([]); // renamed to movies

    const performSearch = async () => {
      try {
        const searchQuery = route.params.keyword; // Get the keyword parameter from the route
        console.log(searchQuery)
        const options = {
          method: 'GET',
          url: `https://moviesdatabase.p.rapidapi.com/titles/search/keyword/${searchQuery}`, // Use the search query in the API request
          headers: {
            'X-RapidAPI-Key': 'a2b106ed40mshef8139e02bba13fp136679jsne3475a09736c',
            'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com'
          },
        };
        const response = await axios(options);
        movies.value = response.data.results; // assign the results to movies
        console.log(movies.value)
      } catch (error) {
        console.error('Error performing search:', error);
      }
    };
    onMounted(performSearch);

    return {
      movies // return movies
    };
  },
});
</script>

<style scoped>
.movies-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start; /* Change this line */
}

.movie-box {
  margin: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  height:280px;
  flex-basis: 10%;
  font-size: 15px;
  display:flex;
  flex-direction: column;
  border-radius:7px;
  overflow: hidden;
  background-color:  #282532;
}

.movie-image {
  width: 200px;
  height:200px;
  object-fit: cover;
}

.movie-info{
  max-width:190px;
  min-width: 0;
  color:  #cccccc;
  display:flex;
  flex-direction: column;
  margin:3px
}

.movie-title {
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
}
</style>