<template>
  <div id="app"> 
    <NavBar />
    <main class="main-site">
      <div class="container-standard">
        <div v-if="$route.path === '/'" class="title-wrapper">
          <MainHeader/>
          <div class="title-search-wrapper">
          <div class="container-search">
            <SearchBar @performSearch="performSearch" @hideDropdown="hideDropdown" />
            <div v-if="searchResults"
              :class="{ 'isDropdownVisible': isDropdownVisible }"
              class="search-results"
              @click.stop="hideDropdown"
              ref="searchResults">
              <ul>
                <li v-for="(result, index) in getFlattenedResults.slice(0, 3)" :key="index">
                  <MovieCard :movie="result" />
                </li>
                <li v-if="getFlattenedResults.length > 3">
                  <router-link :to="{ name: 'MovieFilter', params: { keyword: searchQuery } }" class="btn-results">
                    View all results
                  </router-link>
                </li>
              </ul>
            </div>
          </div>
          </div>
        </div>
        <router-view /> <!-- Vue Router will render the current route's component here -->
        <FooterComponent/>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NavBar from '@/components/NavBar.vue';
import SearchBar from '@/components/SearchBar.vue';
import MainHeader from '@/components/MainHeader.vue';
import MovieCard from "@/components/MovieCard.vue";
import FooterComponent from './views/FooterComponent.vue';
import axios from 'axios';


interface ComponentCustomProperties extends ComponentData, ComponentMethods, ComponentComputed {
  $refs: { [key: string]: HTMLElement };
}
interface ComponentData {
  searchResults: SearchResults | null;
  isDropdownVisible: boolean;
  limitedResults: Movie[]; // Add this line
  searchQuery: string; // Change this line
}

interface ComponentMethods {
  performSearch(searchQuery: string): Promise<void>;
  fetchRatings(results: Movie[]): Promise<void>;
  hideDropdown(event: MouseEvent): void;
}
interface ComponentComputed {
  getFlattenedResults(): Movie[];
}

interface Movie {
  idSearch: string;
  id: string;
  _id?: string;
  title: string;
  image: string;
  releaseYear: number;
  rating: string;
  type: string;
  titleText?: { text: string };
  primaryImage?: string;
  titleType?: { text: string }; // Add this line
}

interface SearchResults {
  page: number;
  next: string;
  entries: number;
  results: Movie[];
}

export default defineComponent({
  name: 'App',
  components: {
    NavBar,
    MainHeader,
    SearchBar,
    MovieCard,
    FooterComponent
  },
  data(): { searchResults: SearchResults | null, isDropdownVisible: boolean, limitedResults: Movie[], searchQuery: string } {
    return {
      searchResults: null, // Change this line
      isDropdownVisible: false,
      limitedResults: [], // Add this line
      searchQuery: '', // Initialize searchQuery
    };
  },
  methods: {
    async performSearch(this: ComponentCustomProperties, searchQuery: string) {
      try {
        const options = {
          method: 'GET',
          url: `https://moviesdatabase.p.rapidapi.com/titles/search/title/${searchQuery}`,
          headers: {
            'X-RapidAPI-Key': 'a2b106ed40mshef8139e02bba13fp136679jsne3475a09736c',
            'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com',
          }
        };

        const response = await axios(options);
        await this.fetchRatings(response.data.results);
        this.searchResults = response.data;
        this.isDropdownVisible = true;
        this.searchQuery = searchQuery; // Add this line
        document.body.addEventListener('click', this.hideDropdown);
      } catch (error) {
        console.error('Error performing search:', error);
      }
    },
    async fetchRatings(this: ComponentCustomProperties, results: Movie[]) {
  if (Array.isArray(results) && results.length > 0) {
    const ratingPromises = results.map(async (result: Movie) => {
      try {
        const ratingOptions = {
          method: 'GET',
          url: `https://moviesdatabase.p.rapidapi.com/titles/${result.id}/ratings`,
          headers: {
            'X-RapidAPI-Key': 'a2b106ed40mshef8139e02bba13fp136679jsne3475a09736c',
            'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com',
          }
        };

        const ratingResponse = await axios(ratingOptions);
        const movieRating = ratingResponse.data;
        result.rating = movieRating;
        console.log(result.rating)
      } catch (error) {
        console.error(`Error fetching rating for movie ${result.id}:`, error);
      }
    }); // This closing bracket was missing
    await Promise.all(ratingPromises);
  }
},

    hideDropdown(this: ComponentCustomProperties, event: MouseEvent) {
      const searchResultsRef = this.$refs.searchResults as HTMLElement;
      const isClickInsideDropdown = searchResultsRef ? searchResultsRef.contains(event.target as Node) : false;

      if (!isClickInsideDropdown) {
        this.isDropdownVisible = false;
        document.body.removeEventListener('click', this.hideDropdown);
      }
    }
  },
  computed: {
  getFlattenedResults(this: ComponentData & ComponentMethods & ComponentComputed): Movie[] {
    if (Array.isArray(this.searchResults?.results)) {
      return this.searchResults.results.map(result => {
        console.log(result.titleType?.text); // Log the movie type
        return {
          idSearch: result.id,
          id: result.id,
          _id: result._id,
          title: result.titleText?.text || 'Movie title not available',
          image: result.primaryImage || 'Image not available',
          releaseYear: result.releaseYear,
          rating: result.rating,
          type: result.titleType?.text || 'Type not available', // Access the text property of titleType
        };
      }) as Movie[];
    } else {
      console.error('Results is not an array:', this.searchResults?.results);
      return [];
    }
  }
}
})

</script>

<style>
#app {
  font-family: 'Quicksand', sans-serif;
  display: flex;
  flex-direction: column;
  min-height: auto;
  position: relative;
  width:100%;
}

.main-site {
  flex-grow: 1;
  display: flex;
  height:100vh;
  z-index: 3;
}

.container-standard {
  background-image: linear-gradient(to top, rgba(3, 0, 10, .9) 0, rgba(3, 0, 10, .4) 60%, #03000a 100%);
  content: "";
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  background-size: cover;
  width: 100%;
  position: relative;
  display:flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.title-search-wrapper{
  position: relative;
  width:60%;
  display:flex;
  flex-direction: column;
  margin-bottom: 35%;
 
  margin-left:20%;
}

.container-search {
  display: flex;
  flex-direction: column;
  margin-bottom:10%;
  justify-items: center;
  position: relative;
  
}

.search-results {
  position: absolute;
  top:45px;
  color: #fff;
  background: #211f29;
  width: 100%;
  align-self: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease, box-shadow 0.1s ease, transform 0.1s ease;
  border-radius: 0 0.4rem 0.4rem 0;
  box-shadow: 0 5px 10px -5px rgba(0, 0, 0, 0.5);
  transform: translateY(-0px);
}

.isDropdownVisible {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
  box-shadow: 0 10px 20px -10px rgba(0, 0, 0, 0.7);
}

.show-results .search-results {
  opacity: 1;
  pointer-events: auto;
}

.search-results h2 {
  font-size: 2rem;
  margin-bottom: 10px;
}

.search-results ul {
  list-style-type: none;
  padding: 0;
}

.search-results li {
  margin-top:0;
  margin-bottom: 5px;
  list-style-type: none;
}
.btn-results{
  background-color: #b29d84;
  border:0px;
  width:95%;
  margin: 0 auto;
  display: block;
  font-size: 15px;
  color:white;
  height:35px;
  border-radius: 8px;
  font-family: 'Quicksand', sans-serif;
  display:flex;
  align-items: center;
  justify-content: center;
}
</style>