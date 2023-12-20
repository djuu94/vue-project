import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Import the router
import { DefaultApolloClient, provideApolloClient } from '@vue/apollo-composable';
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core';

import { pinia } from './store'; // Import the pinia instance

const httpLink = createHttpLink({
  uri: 'http://localhost:8000/graphql',
});

const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

createApp(App)
    .use(router) // Use the router
    .use(pinia) // Use Pinia
    .provide(DefaultApolloClient, apolloClient)
    .mount('#app');