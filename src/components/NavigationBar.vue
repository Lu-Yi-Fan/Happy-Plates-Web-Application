<!-- Navigation Component -->
<!-- Home, Dashboard, Food, Exercise, Profile, Sign out -->

<template>
  <div class="navigation-bar">
    <ul>
        <li><router-link to="/HomePage">
          <img src="@/assets/images/HomePageElements/Home.png" class="logo"></router-link></li>
        <li><router-link to="/DashboardPage">Dashboard</router-link></li>
        <li><router-link to="/FoodLogPage">Food Log</router-link></li>
        <li><router-link to="/ExerciseLogPage">Exercise Log</router-link></li>
        <li><router-link to="/ProfilePage">Profile</router-link></li>
        <li @click="handleSignOut"><a>Sign Out</a></li>  
        <!-- the handleSignOut function when clicked. 
        The @click directive is a shorthand for the v-on:click directive in Vue.js,
         which allows us to bind a function to an event on the element -->

    </ul>
  </div>
</template>


<script>
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

export default {

  methods: {
      handleSignOut() {
        const auth = getAuth();
        const user = auth.currentUser;
        signOut(auth,user)
      // navigate to landing page
      this.$router.push('/');
    },
  }
};
</script>

<style>

.navigation-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  background-color:greenyellow;
  padding: 0 20px;
  width: 100%;
}

.navigation-bar ul {
  display: flex;
  justify-content: space-between;
  list-style-type: none;
  margin: 0;
  padding: 0;
  width: 100%;
}

.navigation-bar li {
  flex: 1;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid #333;
  border-radius: 20px;
  background-color: white;
  margin: 30px;
}

.navigation-bar a {
  color: #333;
  text-decoration: none;
  font-weight: bold;
}

.navigation-bar a:hover {
  text-decoration: underline;
  color: red;
}
.logo {
  width: 30px;
  height: 30px;
}
</style>
