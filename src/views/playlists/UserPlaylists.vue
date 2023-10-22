<template>
  <div class="user-playlists">
    <h2>My Playlists</h2>
    <div v-if="playlists">
      <list-view :playlists="playlists"></list-view>
    </div>
    <router-link class="btn" :to="{ name: 'createPlaylist' }"
      >Create a new Playlist</router-link
    >
  </div>
</template>

<script>
import getUser from '@/composables/getUser.js'
import getCollection from '@/composables/getCollection.js'
import ListView from '@/components/ListView.vue'
export default {
  components: { ListView },
  setup() {
    const { user } = getUser()
    const { documents: playlists } = getCollection('playlists', [
      'userId',
      '==',
      user.value.uid,
    ])
    return { playlists }
  },
}
</script>

<style>
</style>