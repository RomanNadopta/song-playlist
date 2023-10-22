<template>
  <form @submit.prevent="handleSubmit">
    <h4>Create New Playlist</h4>
    <input type="text" required placeholder="Playlist title" v-model="title" />
    <textarea
      required
      placeholder="Playlist description..."
      v-model="description"
    ></textarea>
    <!-- upload playlist image -->
    <div class="preview-wrapper">
      <div>
        <p class="cover-title">Upload playlist cover image</p>
        <div class="box">
          <input
            type="file"
            id="file-img"
            class="inputfile"
            data-multiple-caption="{count} files selected"
            multiple
            @change="handleChange"
            v-on:change="previewFiles"
            ref="fileInput"
          />
          <label for="file-img"
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
            <span class="file-name">{{ fileImage }}</span>
          </label>
        </div>
      </div>
      <div
        v-if="imageData"
        class="preview-img"
        :style="{ 'background-image': `url(${imageData})` }"
        @change="fileInput"
      ></div>
    </div>
    <div class="error">{{ fileError }}</div>
    <button v-if="!isPending">Create</button>
    <button v-if="isPending" disabled>Loading...</button>
  </form>
</template>

<script>
import { ref } from 'vue'
import useStorage from '@/composables/useStorage.js'
import useCollection from '@/composables/useCollection.js'
import getUser from '@/composables/getUser.js'
import { timestamp } from '@/firebase/config.js'
import { useRouter } from 'vue-router'
export default {
  setup() {
    const { url, filePath, uploadImage } = useStorage()
    const { error, addDoc } = useCollection('playlists')
    const { user } = getUser()
    const router = useRouter()

    const title = ref('')
    const description = ref('')
    const file = ref(null)
    const fileError = ref(null)
    const isPending = ref(false)

    const fileImage = ref('Choose image...')
    const previewFiles = (event) => {
      fileImage.value = event.target.files[0].name
    }

    const handleSubmit = async () => {
      if (file.value) {
        // start
        isPending.value = true
        await uploadImage(file.value)
        const res = await addDoc({
          title: title.value,
          description: description.value,
          userId: user.value.uid,
          userName: user.value.displayName,
          coverUrl: url.value,
          filePath: filePath.value,
          songs: [],
          createdAt: timestamp(),
        })
        // end
        isPending.value = false
        if (!error.value) {
          router.push({ name: 'playlistDetails', params: { id: res.id } })
        }
      }
    }

    //  allowed file types
    const imageData = ref(null)
    const fileInput = ref(null)
    const types = ['image/png', 'image/jpeg']
    const handleChange = (e) => {
      const selected = e.target.files[0]
      if (selected && types.includes(selected.type)) {
        file.value = selected
        fileError.value = null
      } else {
        file.value = null
        fileError.value = 'Please select an image file (png or jpg)'
      }
      const input = fileInput.value
      const files = input.files
      if (files && files[0]) {
        const reader = new FileReader()
        reader.onload = (e) => {
          imageData.value = e.target.result
        }
        reader.readAsDataURL(files[0])
      }
    }

    return {
      title,
      description,
      handleChange,
      handleSubmit,
      fileError,
      isPending,
      imageData,
      fileInput,
      fileImage,
      previewFiles,
    }
  },
}
</script>

<style>
form {
  background: white;
}
textarea {
  resize: none;
}

.cover-title {
  text-align: center;
  margin-bottom: 10px;
}

.box {
  display: flex;
  justify-content: center;
}
.inputfile + label {
  font-size: 20px;

  font-weight: 700;
  text-overflow: ellipsis;
  white-space: wrap;
  word-break: break-all;
  cursor: pointer;
  display: inline-block;
  overflow: hidden;
  padding: 10px 20px;
  border-radius: 8px;
}

.inputfile {
  display: none;
}

.inputfile:focus + label {
  outline: 1px dotted #000;
  outline: -webkit-focus-ring-color auto 5px;
}

.inputfile + label svg {
  width: 1em;
  height: 1em;
  vertical-align: middle;
  fill: currentColor;
  margin-top: 4px;

  margin-right: 4px;
}
.inputfile + label {
  background: var(--secondary);
}

.inputfile:focus + label,
.inputfile:hover + label:hover {
  background: var(--primary);
  color: #fff;
}

.inputfile + label:hover .file-name,
.inputfile + label:hover svg {
  color: #fff;
  fill: #ffff;
}
button {
  margin-top: 20px;
}

.preview-img {
  display: block;
  width: 100px;
  height: 100px;
  margin: 0 auto;
  margin-top: 20px;
  background-size: cover;
  background-position: center center;
  border-radius: 24px;
}
</style>