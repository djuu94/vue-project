<template>
  <div class="wrapper">  
    <div class="content">
      <router-link :to="`/movie/${movie.idSearch}`" class="movie-title">{{ movie.title }}</router-link>
      <img v-if="movie.image && movie.image.url" :src="movie.image.url" alt="Movie Poster" class="movie-img"/> 
      <div class="movie-info">
        <span>
      <i class='far fa-star'></i>
      <span v-if="movie.rating && movie.rating.results">{{ movie.rating.results.averageRating }}</span>

      <span v-else>N/A</span>
      </span>
        <span class="dot">{{ movie.releaseYear.year }}</span>
        <span class="dot">{{ movie.type }}</span>
      </div>
    </div>
  </div>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  props: {
    movie: {
      type: Object,
      required: true,
    },
  },
});
</script>
<style scoped>
.wrapper {
  position: relative;
  width: 100%;
  padding-left:10px;
  padding-right:10px;

}



.movie-title {
  position: absolute;
  left:0;
  top:0;
  margin: 10px;;
  color:white;
  font-size: 15px;
  font-family: 'Quicksand', sans-serif;
}

.content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  background: #1c1a23;
  position: relative;
  height:70px;
  border-radius: 0.6rem;
  overflow: hidden;
}
.content:hover {
  background: #0c0b0f;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.movie-img {
  height:66px;
  width: 49px;
  margin-left: auto;
  justify-self: center;

  
  align-self: center;
}

.movie-info {
  position: absolute;
  left: 0;
  bottom: 10px;
  margin-left: 10px; /* Adjust the spacing between the image and information */
  font-weight: 400;
  font-size: 13.5px;
  color: #6b6973;
  font-family: 'Quicksand', sans-serif;
}

.movie-info span {
  margin-left:12px;
  position: relative; /* Make sure ::before is positioned relative to the span */
}

.dot::before {
  content: "\2022"; /* Unicode character for a small circle */
  color: #6b6973; /* Color of the circle */
  font-size: 10px; /* Adjust the size of the circle */
  margin-right: 5px; /* Adjust the spacing between the circle and the text */
}
</style>