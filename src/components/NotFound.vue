<template>
    <div style = "text-align:center;" v-if="user"> 
        <!-- Navigation bar allows users to be able to get back to accessing relevant pages -->
        <NavigationBar/>
        <!-- Content shown on the page if user access a page that does not exist -->
        <h3>PAGE NOT FOUND !!!</h3>
        <h4>PLEASE CLICK ON THE ABOVE AVAILABLE OPTIONS</h4>
        <br>
    </div>
</template>

<script>

import NavigationBar from "@/components/NavigationBar.vue"
import { getAuth, onAuthStateChanged } from 'firebase/auth'

export default {
  name: 'NotFound',

  components: {
    NavigationBar,
  },

  data() {
    return {
      user: false // this page only appears when users are logged in and tried to exist a page that does not exist
    }
  },

  mounted() {
    const auth = getAuth()
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.user = user
      }
    })
  },
}
</script>
