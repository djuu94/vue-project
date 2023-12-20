import { createRouter, createWebHistory } from 'vue-router';
import MoviePage from '@/components/MoviePage.vue';
import type { RouteRecordRaw } from 'vue-router';
import AllMovies from '@/components/AllMovies.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/movie/:id',
    name: 'Movie',
    component: MoviePage
  },
  {
    path: '/filter/:keyword',
    name: 'MovieFilter',
    component: AllMovies
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});


router.afterEach((to, from) => {
  if (to.name === 'MovieFilter' && !to.params.keyword) {
    router.push({ name: 'MovieFilter', params: { keyword: 'default' } });
  }
});

export default router;