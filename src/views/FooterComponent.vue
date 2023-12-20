<template>
  <footer>
    <div class="footer-content">
      <div class="info-field">
        <h2>About Our Service</h2>
        <p>Your web service information goes here.</p>
      </div>
      <div class="contact-field">
        <h2>Contact Us</h2>
        <p>Email: info@yourwebsite.com</p>
        <p>Phone: 123-456-7890</p>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Footer',
});
</script>

<style scoped>
footer {
  z-index: 4;
  height: 150px;
  width: 100%;
  background-color: #15131B;
  display: flex;
  
  align-items: center;
  color:white;
  position: absolute;
  bottom:0;
  padding:5px;
  
}

.footer-content {
  display: flex;
  justify-content: space-between;
  width: 100%;

}

.contact-field, .info-field {
  margin-left: 5%;
}
.contact-field{
  margin-right: 5%; /* Add this */
}

</style>
