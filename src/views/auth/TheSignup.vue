<template>
  <form @submit.prevent="handleSubmit">
    <h3>Sign up</h3>
    <input type="text" placeholder="Display name" v-model="displayName" />
    <input type="email" v-model="email" placeholder="Email" />
    <input type="password" v-model="password" placeholder="Password" />
    <div class="error" v-if="error">{{ error }}</div>
    <button v-if="!isPending">Sign up</button>
  </form>
</template>

<script>
import useSignup from '@/composables/useSignup.js'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
export default {
  setup() {
    const email = ref('')
    const password = ref('')
    const displayName = ref('')
    const { error, signup, isPending } = useSignup()

    const router = useRouter()

    const handleSubmit = async () => {
      const res = await signup(email.value, password.value, displayName.value)
      if (!error.value) {
        router.push({ name: 'userPlaylists' })
        return res
      }
    }
    return { email, password, displayName, isPending, error, handleSubmit }
  },
}
</script>

<style>
</style>