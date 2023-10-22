<template>
  <navbar></navbar>
  <div class="content">
    <router-view />
  </div>
</template>
<script>
import Navbar from './components/TheNavbar.vue'
export default {
  components: { Navbar },
}
</script>
<style>
.content {
  margin: 0 auto;
  max-width: 1200px;
  padding: 0 20px;
}
</style>
