<template>
  <div class="add-song">
    <button v-if="!showForm" @click="showFormToggle">Add Songs</button>
    <form v-if="showForm" @submit.prevent="handleSubmit">
      <h4>Add a New Song</h4>
      <input type="text" placeholder="Song title *" required v-model="title" />
      <input type="text" placeholder="Artist *" required v-model="artist" />
      <input type="text" placeholder="Video link" v-model="videoLink" />
      <div class="box">
        <input
          type="file"
          id="file"
          class="inputfile"
          data-multiple-caption="{count} files selected"
          multiple
          @change="handleChange"
          v-on:change="previewFiles"
          accept="audio/*"
        />
        <label for="file"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="17"
            viewBox="0 0 20 17"
          >
            <path
              d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"
            />
          </svg>
          <span class="file-name">{{ fileAudio }}</span>
        </label>
      </div>

      <button v-if="!isPending">Add</button>
      <!-- <button v-if="isPending" disabled>Loading...</button> -->
      <progress-bar
        v-if="isPending"
        :aploadValue="uploadValue"
        maxWidth="400px"
        color="danger"
      ></progress-bar>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue'
import useDocument from '@/composables/useDocument.js'
import getUser from '@/composables/getUser.js'
import ProgressBar from './ProgressBar.vue'

import { projectStorage } from '../firebase/config'
export default {
  props: ['playlist'],
  components: { ProgressBar },
  setup(props) {
    const title = ref('')
    const artist = ref('')
    const videoLink = ref(null)
    const showForm = ref(false)
    const { updateDoc } = useDocument('playlists', props.playlist.id)

    const { user } = getUser()

    const file = ref(null)
    const fileError = ref(null)
    const isPending = ref(false)

    const url = ref(null)
    const filePath = ref(null)
    const uploadValue = ref(0)
    const fileAudio = ref('Choose a file...')
    const showFormToggle = () => {
      showForm.value = !showForm.value
    }

    const handleSubmit = async () => {
      if (file.value) {
        // start
        isPending.value = true

        const uploadAudio = async (file) => {
          filePath.value = `audio/${user.value.uid}/${file.name}`
          const storageRef = projectStorage.ref(filePath.value)

          const res = storageRef.put(file)
          res.on(
            `state_changed`,
            (snapshot) => {
              uploadValue.value =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            },
            (error) => {
              console.log(error.message)
            },
            () => {
              uploadValue.value = 100
              res.snapshot.ref.getDownloadURL().then((downloadURL) => {
                url.value = downloadURL
                const newSong = {
                  title: title.value,
                  artist: artist.value,
                  audioUrl: url.value,
                  filePath: filePath.value,
                  id: new Date().getTime().toString(20),
                  userId: user.value.uid,
                  videoUrl: videoLink.value,
                }
                updateDoc({
                  songs: [newSong, ...props.playlist.songs],
                })
                title.value = ''
                artist.value = ''
                fileAudio.value = 'Choose a file...'
                uploadValue.value = 0
                isPending.value = false
                videoLink.value = null
                showForm.value = false
              })
            }
          )
        }
        uploadAudio(file.value)
      }
    }

    const types = ['audio/wav', 'audio/mpeg']
    const handleChange = (e) => {
      const selected = e.target.files[0]
      if (selected && types.includes(selected.type)) {
        file.value = selected
        fileError.value = null
      } else {
        fileError.value = 'Please select an audio file (wav or mp3)'
      }
    }

    const previewFiles = (event) => {
      fileAudio.value = event.target.files[0].name
    }

    return {
      title,
      artist,
      videoLink,
      showForm,
      showFormToggle,
      handleSubmit,
      handleChange,
      fileError,
      isPending,
      previewFiles,
      fileAudio,
      uploadValue,
    }
  },
}
</script>

<style scoped>
.add-song {
  text-align: center;
  margin-bottom: 40px;
}
form {
  max-width: 100%;
  text-align: left;
}
section .row {
  margin-bottom: 10px;
  background: #e9f0ff;
  list-style: none;
  padding: 15px 20px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
section .row i {
  color: #6990f2;
  font-size: 30px;
}
section .details span {
  font-size: 14px;
}
.progress-area .row .content {
  width: 100%;
  margin-left: 15px;
}
.progress-area .details {
  display: flex;
  align-items: center;
  margin-bottom: 7px;
  justify-content: space-between;
}
.progress-area .content .progress-bar {
  height: 6px;
  width: 100%;
  margin-bottom: 4px;
  background: #fff;
  border-radius: 30px;
}
.content .progress-bar .progress {
  height: 100%;
  width: 0%;
  background: #6990f2;
  border-radius: inherit;
}
</style>

