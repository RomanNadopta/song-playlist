<template>
  <div class="home">
    <div v-if="error" class="error">could not fetch the data</div>
    <div v-if="documents">
      <list-view :playlists="documents"></list-view>
    </div>
  </div>
</template>

<script>
import getCollection from '@/composables/getCollection.js'
import ListView from '@/components/ListView.vue'
export default {
  components: { ListView },
  name: 'HomeView',

  setup() {
    const { error, documents } = getCollection('playlists')

    return {
      error,
      documents,
    }
  },
}
</script>
