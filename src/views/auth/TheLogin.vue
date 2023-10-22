<template>
  <form @submit.prevent="handleSubmit">
    <h3>Login</h3>
    <input type="email" v-model="email" placeholder="Email" />
    <input type="password" v-model="password" placeholder="Password" />
    <div class="error" v-if="error">{{ error }}</div>
    <button v-if="!isPending">Log in</button>
  </form>
</template>

<script>
import useLogin from '@/composables/useLogin.js'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
export default {
  setup() {
    const { error, login, isPending } = useLogin()
    const email = ref('')
    const password = ref('')

    const router = useRouter()

    const handleSubmit = async () => {
      const res = await login(email.value, password.value)
      if (!error.value) {
        router.push({ name: 'userPlaylists' })
        return res
      }
    }
    return { email, password, handleSubmit, error, isPending }
  },
}
</script>

<style>
</style>