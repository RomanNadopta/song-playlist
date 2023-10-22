<template>
  <div v-if="error" class="error">{{ error }}</div>
  <div v-if="playlist" class="playlist-details">
    <!-- playlist information -->
    <div class="playlist-info">
      <div class="cover">
        <img :src="playlist.coverUrl" />
      </div>
      <h2>{{ playlist.title }}</h2>
      <p class="username">Created by {{ playlist.userName }}</p>
      <p class="description">{{ playlist.description }}</p>
      <button v-if="ownership" @click="handleDelete">Delete Playlist</button>
    </div>

    <!-- song list -->
    <div class="song-list">
      <div v-if="!playlist.songs.length">
        No songs have been added to this playlist yet.
      </div>
      <div class="single-song" v-for="song in playlist.songs" :key="song.id">
        <div class="details">
          <div class="delete-button-container">
            <button
              class="delete-button"
              @click="handleDeleteSong(song.id)"
              v-if="ownership"
            >
              Delete
            </button>
          </div>
          <mini-player
            :title="song.title"
            :artist="song.artist"
            :src="song.audioUrl"
            :href="song.videoUrl"
          >
          </mini-player>
        </div>
      </div>
      <add-song v-if="ownership" :playlist="playlist"></add-song>
    </div>
  </div>
</template>

<script>
import getDocument from '@/composables/getDocument.js'
import getUser from '@/composables/getUser.js'
import useDocument from '@/composables/useDocument.js'
import useStorage from '@/composables/useStorage'
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import AddSong from '@/components/AddSong.vue'
import MiniPlayer from '@/components/MiniPlayer.vue'
export default {
  components: { AddSong, MiniPlayer },
  props: ['id'],
  setup(props) {
    const router = useRouter()
    const { error, document: playlist } = getDocument('playlists', props.id)
    const { user } = getUser()
    const { deleteDoc, updateDoc } = useDocument('playlists', props.id)
    const { deleteImg, deleteAudio, url } = useStorage()

    const ownership = computed(() => {
      return (
        playlist.value && user.value && user.value.uid === playlist.value.userId
      )
    })
    const handleDelete = async () => {
      await deleteImg(playlist.value.filePath)
      await deleteDoc()
      router.push({ name: 'home' })
    }
    const deleteSrotage = async (id) => {
      const songs = playlist.value.songs
      await songs.map((song) => {
        if (song.id === id) {
          deleteAudio(song.filePath)
        }
      })
    }

    const handleDeleteSong = async (id) => {
      deleteSrotage(id)
      const songs = playlist.value.songs.filter((song) => song.id !== id)

      updateDoc({ songs })
    }
    return {
      error,
      playlist,
      ownership,
      handleDelete,
      handleDeleteSong,
      url,
    }
  },
}
</script>

<style>
.song-list {
  margin-top: -50px;
}

.playlist-details {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 80px;
}
.cover {
  overflow: hidden;
  border-radius: 20px;
  position: relative;
  padding: 160px;
}
.cover img {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  min-width: 100%;
  min-height: 100%;
  max-width: 100%;
  max-height: 100%;
}
.playlist-info {
  text-align: center;
}
.playlist-info h2 {
  text-transform: capitalize;
  font-size: 28px;
  margin-top: 20px;
}
.playlist-info p {
  margin-bottom: 20px;
}
.username {
  color: #999;
}
.description {
  text-align: left;
}
.single-song {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.delete-button-container {
  position: relative;
}
.delete-button {
  position: absolute;
  top: 45px;
  left: 78%;
  background-color: var(--warning-hover);
}

@media screen and (max-width: 860px) {
  .playlist-details {
    display: grid;
    grid-template-columns: 1fr;
    gap: 80px;
  }
  .delete-button {
    top: 35px;
    left: 75%;
  }

  .cover {
    padding: 0px;
  }
  .cover img {
    position: relative;
  }
  .single-song {
    justify-content: center;
  }
}
</style>