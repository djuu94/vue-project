<template>
  <div v-if="isModalVisible" class="modal">
    <div class="modal-content">
      <button @click="closeModal" class="close-modal">
        <i class="fa-solid fa-circle-xmark i-circle"></i>
      </button>
      <h3 class="form-title" v-if="!showSignInForm">Create new account</h3>
      <h3 class="form-title" v-else>Sign In</h3>
      <p class="form-text" v-if="!showSignInForm">Create an account to use all the features..</p>
      <p class="form-text" v-else>Enter your credentials to sign in.</p>
      <form class="form-group" v-if="!showSignInForm" @submit.prevent="signUp">
        <input v-model="name" placeholder="Username">
        <input v-model="email" placeholder="Email">
        <input v-model="password" type="password" placeholder="Password">
        <button type="submit" class="btn-sign-up">
          Sign Up
          <i class="fa-sharp fa-solid fa-circle-chevron-right"></i>
        </button>
        <div class="success-txt">{{ successMessage }}</div>
      </form>
      <form class="form-group" v-else @submit.prevent="signIn">
        <input v-model="name" placeholder="Username or Email">
        <input v-model="password" type="password" placeholder="Password">
        <button type="submit" class="btn-sign-in">
            Sign In
          <i class="fa-sharp fa-solid fa-circle-chevron-right"></i>
        </button>
        <div class="success-txt">{{ successMessage }}</div> <!-- And here -->
        <div class="error-txt">{{ errorMessage }}</div> <!-- And here -->
      </form>
      <div class="sign-in-txt" v-if="!showSignInForm">
        Already have an account?
        <span @click="showSignInForm = true" class="sign-in">Sign in</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useMutation } from '@vue/apollo-composable';
import type { CreateUserMutation, CreateUserMutationVariables, LoginUserMutation, LoginUserMutationVariables } from '@/graphql/generated';
import { gql } from 'graphql-tag';
import { computed } from 'vue';
import { useStore } from '../store'; // Import useStore from your store file
export default defineComponent({
  name: 'CreateAccountModal',
  props: {
    isModalVisible: Boolean,
  },
  setup(props, { emit }) {
    const showSignInForm = ref(false);
    const name = ref('');
    const email = ref('');
    const password = ref('');
    const successMessage = ref(''); // New ref for the success message
    const errorMessage = ref(''); // Define errorMessage here
    const store = useStore();
    const isLoggedIn = computed(() => store.isLoggedIn);

    const { mutate: signUpMutation } = useMutation<CreateUserMutation, CreateUserMutationVariables>(
      gql`
        mutation CreateUser($name: String!, $email: String!, $password: String!) {
          createUser(name: $name, email: $email, password: $password) {
              id
              name
              email
      }
    }
  `
    );
    const { mutate: loginMutation } = useMutation<LoginUserMutation, LoginUserMutationVariables>(
  gql`
    mutation loginUser($name: String!, $password: String!) {
      loginUser(name: $name, password: $password) {
        id
        name
        email
        __typename
      }
    }
  `
);

    const signUp = async () => {
      successMessage.value = ''; // Reset the success message
      const variables: CreateUserMutationVariables = {
        name: name.value,
        email: email.value,
        password: password.value,
      };

      if (!variables.name || !variables.email || !variables.password) {
        console.error('Please fill in all fields.');
        return;
      }
      console.log('Mutation variables:', variables);

      try {
        const result = await signUpMutation(variables);
        store.login(); // Call action
        if (result) {
          const newUser = result.data?.createUser;
          successMessage.value = 'Account has been created!'; // Update the success message
          console.log(newUser)
          console.log('Mutation result:', result);
        } else {
          console.error('GraphQL request returned null result.');
        }
      } catch (error: any) {
        console.error('Error creating user:', error);
        console.log('GraphQL Errors:', error.graphQLErrors);
        console.log('Network Error:', error?.networkError);
        console.log('Error Message:', error?.message);
      }
    };
    const signIn = async () => {
  const variables: LoginUserMutationVariables = {
    name: name.value,
    password: password.value,
  };

  if (!variables.name || !variables.password) {
    console.error('Please fill in all fields.');
    return;
  }

  try {
    const result = await loginMutation(variables);
    if (result) {
      const loggedInUser = result.data?.loginUser;
      if (loggedInUser) {
        console.log('Logged in user:', loggedInUser);
        store.login();
        store.setUserId(loggedInUser.id); // Save the user ID in the store
        console.log('User ID:', loggedInUser.id); 
        successMessage.value = 'Logged in successfully!';
      } else {
        console.error('Invalid username or password.');
      }
    } else {
      console.error('GraphQL request returned null result.');
    }
  } catch (error: any) {
    console.error('Error logging in:', error);
    errorMessage.value = 'Invalid username or password. Please try again.';
    console.log('GraphQL Errors:', error.graphQLErrors);
    console.log('Network Error:', error?.networkError);
    console.log('Error Message:', error?.message);
  }
};
    const logout = () => {
      store.logout();
    };
    const closeModal = () => {
      emit('close');
    };
    return {
      showSignInForm,
      name,
      email,
      password,
      signUp,
      signIn,
      closeModal,
      successMessage, 
      errorMessage
    };
  },
});
</script>
  <style scoped>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .modal-content {
    font-family: Quicksand, sans-serif;
    font-size: 15px;
    line-height: 22.5px;
    height: 547px;
    width: 400px;
    border: 0px solid #B29D84;
    padding: 15px 23px 23px 23px;
    background-color: #211F29;
    display: flex;
    flex-direction: column;
    border-radius: 18px;
    position: relative;

  }
  .form-title {
    font-size: 1.6em;
    color: white;
    font-family: Quicksand, sans-serif;
    margin-top: 0;
  }
  .form-text {
    color: #6B6973;
    font-size: 1.1em;
    margin-top: 0;
  }
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 20px;
    height: 100%;
    position: relative;
  }
  .form-group input {
    background-color: #0C0B0F;
    font-size: 1.2em;
    border: none;
    border-radius: 8px;
    padding: 5px 5px 5px 17px;
    color: white;
    font-family: Quicksand, sans-serif;
  }
  .form-group input::placeholder {
    color: #6b69739c;
    font-family: Quicksand, sans-serif;
    margin-left: 5px;
  }
  .close-modal {
    width: auto;
    background-color: #211F29;
    border: none;
    align-self: end;
    margin-left: 2%;
  }
  .i-circle {
    font-size: 24px;
    color: #6B6973;
  }
  .i-circle:hover {
    color: #7e7d85;
  }
  .btn-sign-up {
    background-color: #e6d1b8;
    color: white;
    font-family: Quicksand, sans-serif;
    border-radius: 0.6rem;
    padding: 0.6rem 1.5rem;
    position: absolute;
    bottom: 10px;
    width: 100%;
    font-size: 18px;
    border: none;
  }
  .btn-sign-in{
    background-color: #e6d1b8;
    color: white;
    font-family: Quicksand, sans-serif;
    border-radius: 0.6rem;
    padding: 0.6rem 1.5rem;
    position: absolute;
    bottom: 10px;
    width: 100%;
    font-size: 18px;
    border: none;
  }
  .sign-in-txt {
    color: gray;
    align-self: center;
    font-size: 16px;
  }
  .sign-in {
    color: #d4d3d8;
    font-size: 16px;
  }
  .sign-in:hover {
    color: #fff;
    font-size: 17px;
  }
  .btn-login {
    width: 20%;
    border-radius: 9px;
    padding: 5px;
    border: none;
    position: absolute;
    bottom: 0;
    right: 5px;
    background-color: #6b6973da;
    color: #313133;
    font-size: 13px;
    margin-right: 5px;
  }
  .success-txt, .error-txt {
      color: white;
      padding-left: 10px;
      font-size: 1.3em;
      
      
    }

 
  </style>