<template>
  <div class="navbar">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6"
      fill="none"
      stroke="currentColor"
      stroke-width="1"
      display="none"
    >
      <symbol id="logout-icon" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </symbol>
    </svg>
    <nav>
      <h1><router-link :to="{ name: 'home' }">Song Playlist</router-link></h1>
      <div class="links">
        <div v-if="user">
          <router-link :to="{ name: 'createPlaylist' }"
            >Create Playlist</router-link
          >
          <router-link :to="{ name: 'userPlaylists' }">My Playlist</router-link>
          <span>Hi {{ user.displayName }}</span>
          <div
            class="iconDiv"
            tooltip="Log out"
            tabindex="0"
            @click="handleSubmit"
          >
            <div class="iconSVG">
              <svg class="h-6 w-6" width="36px" height="36px">
                <use xlink:href="#logout-icon"></use>
              </svg>
            </div>
          </div>
          <button class="logout" @click="handleSubmit">Logout</button>
        </div>
        <div v-else>
          <router-link class="btn" :to="{ name: 'signup' }"
            >Sign up</router-link
          >
          <router-link class="btn" :to="{ name: 'login' }">Log in</router-link>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import useLogout from '@/composables/useLogout.js'
import getUser from '@/composables/getUser.js'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
export default {
  setup() {
    const isShow = ref(false)
    const { user } = getUser()
    const { logout } = useLogout()
    const router = useRouter()
    const handleSubmit = async () => {
      await logout()
      if (!user.value) {
        router.push({ name: 'login' })
        isShow.value = true
      }
    }

    return {
      handleSubmit,
      user,
    }
  },
}
</script>

<style scoped>
.navbar {
  padding: 16px 10px;
  margin-bottom: 60px;
  background: white;
}
nav {
  display: flex;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}
nav img {
  max-height: 60px;
}
nav h1 {
  margin-left: 20px;
}
nav .links {
  margin-left: auto;
}
nav .links a,
button {
  margin-left: 16px;
  font-size: 14px;
}
span {
  font-size: 14px;
  display: inline-block;
  margin-left: 16px;
  padding-left: 16px;
  border-left: 1px solid #eee;
}

/* Log out */
.iconDiv {
  display: block;
  position: relative;
  top: 10px;

  width: 36px;

  margin-left: 4px;
  padding: 4px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  cursor: pointer;
  transition: width 300ms ease-in-out 0s, background-color 300ms linear 200ms;
}
.iconSVG {
  height: 36px;
  aspect-ratio: 1 / 1;
}
.iconSVG svg {
  stroke: black;
  fill: #eee;
}
.iconDiv:hover,
.iconDiv:focus-visible {
  width: 142px;

  transition: width 300ms ease-in-out 0s, background-color 100ms linear 0s;
}
.iconDiv:focus-visible {
  outline-offset: 4px;
}
.iconDiv:active {
  opacity: 0.9;
}
.iconDiv::after {
  content: attr(tooltip);
  margin-left: 12px;
  animation: fadeIn 600ms linear forwards;

  color: #eee;
  border-radius: 8px;
  border: 0;
  padding: 8px 12px;
  font-weight: 600;
  display: inline-block;
  background: var(--primary);
}

.logout {
  display: none;
}

@media screen and (max-width: 860px) {
  .logout {
    display: inline;
  }
  .iconDiv {
    display: none;
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>