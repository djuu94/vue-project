<template>
  <nav class="navbar">
    <div class="navbar-menu">
      <div class="navbar-start">
        <img src="/box-of-popcorn.png" alt="Logo" class="logo">
        <router-link to="/" class="navbar-item">CornPop</router-link>
        <router-link to="/genre" class="navbar-item">Genre</router-link>
        <router-link to="/movies" class="navbar-item">Movies</router-link>
        <router-link to="/tv-shows" class="navbar-item">TV Shows</router-link>
        <router-link to="/top-imdb" class="navbar-item">Top IMDb</router-link>
      </div>
    </div>
    <div class="account-section">
      <div v-if="isLoggedIn" class="logged-in-element" @click="openFavoritesModal">
        <i class="fa-solid fa-bars"></i>
      </div>
      <button @click="openModal" class="account-button">
        <i class="fa-solid fa-user"></i>
      </button>
    </div>
    <AccountModal :isModalVisible="isModalVisible" @close="closeModal" />
    <FavoriteMoviesModal :isModalVisible="isFavoritesModalVisible" @close="closeFavoritesModal" />
  </nav>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watchEffect } from 'vue';
import { useStore } from '@/store';
import AccountModal from '@/components/AccountModal.vue';
import FavoriteMoviesModal from '@/components/FavoriteMoviesModal.vue'; // Import the FavoriteMoviesModal component

export default defineComponent({
  name: 'NavBar',
  components: {
    AccountModal,
    FavoriteMoviesModal, // Add the FavoriteMoviesModal component
  },
  setup() {
    const isModalVisible = ref(false);
    const isFavoritesModalVisible = ref(false); // Add a ref for the Favorites modal visibility
    const store = useStore();
    const isLoggedIn = computed(() => store.isLoggedIn); 

    watchEffect(() => {
      console.log('Is logged in:', isLoggedIn.value); // Log the value of isLoggedIn whenever it changes
    });

    return {
      isModalVisible,
      isFavoritesModalVisible, // Return the ref
      isLoggedIn, // Return the computed property
    };
  },
  methods: {
    openModal() {
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },
    openFavoritesModal() {
      this.isFavoritesModalVisible = true;
    },
    closeFavoritesModal() {
      this.isFavoritesModalVisible = false;
    },
  },
});
</script>



<style scoped>
.navbar {
  padding: 1rem;
  border-bottom: 1px solid #211f29;
  position: relative;
  width: 100%;
  background: #15131b;
  height: 5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 4;
}

.navbar-menu {
  display: flex;
}

.navbar-start {
  display: flex;
  align-items: center;
}
.logo{
  color:white;
  font-size: 3em;

}
.navbar-item {
  font-family: 'Quicksand', sans-serif;
  color: #FFFFFF;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0 1rem;
  font-weight: 550;
  height: 100%;
  display: flex;
  align-items: center;
  position: relative;
  box-sizing: border-box;
}

.navbar-item::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -22px;
  width: 0;
  height: 2px;
  background-color: #cfc7c7; /* Adjust the color as needed */
  transition: width 0.1s ease; /* Adding a smooth transition effect */
}

.navbar-item:hover::after {
  width: 100%;
}

.navbar-account {
  color: #FFFFFF;
}

.account-button{
  font-size: 22px;
  background-color: #15131b;
  border:none;
  color:white;
  margin-right:3%;
  cursor:pointer;
}

.logged-in-element{
  color:white;
  font-size:1.5em;
  margin-right: 5px;
}

.account-section {
  display: flex;
  align-items: center;
}
</style>