<template>
  <div>
  <div class="firstcontainer">
    <br>
    <img src="@/assets/images/CommonElements/HappyPlatesWord.png" alt="HP Words" style="width: 350px; height: auto">
    <div class="toprightbuttons">
      <router-link to="/LoginPage" class="loginlink">Log In</router-link>
      <button v-on:click="goToSignUpPage" class="getstarted">Get Started</button>      
    </div>
  </div>
  <div class="secondcontainer">
      <div class="intro">
        <strong><h2 style="font-size: 34px; font-weight: 800;">The first step towards a healthy lifestyle.</h2></strong><br>
        <h6 style="font-size: 18px;">Track your meals and activity. Achieve your goals with Happy Plates!</h6><br>
        <button v-on:click="goToSignUpPage" class="getstarted">Start for Free</button>  
      </div>
      <div class="pic">
        <img src="@/assets/images/CommonElements/HappyPlatesLogo.png" alt="HP Logo" style="width: 350px; height: auto" >
      </div>
  </div>
  <div class="thirdcontainer">
    <img src="@/assets/images/LandingPageElements/LandingPageIcons.png" alt="LP Icons" style="width:auto; height: auto">
  </div>
  </div>
  
</template>

<script>
export default {
methods: {
  goToLoginPage() {
    this.$router.push("/LoginPage");
  },
  goToSignUpPage() {
    this.$router.push("/SignUpPage");
  },
},
};
</script>

<style>
.toprightbuttons {
  position: absolute;
  top: 10px;
  right: 50px;
  top: 60px;
  right: 50px;
}

.loginlink {
  color: black;
  text-decoration: none;
  margin-right: 60px;
}

.getstarted {
  background-color: rgb(126, 216, 87); /* change the background color of the button to lime green */
  border-radius: 10px; /* make the edges of the button rounded */
  border: 2px solid rgb(126, 216, 87); /* add a lime green border to the button */
  padding: 10px 50px; /* add some padding to the button */
  color: white;
}

.secondcontainer {
  margin-top: 50px;
  margin-left: 300px;
  display: flex;
  flex-wrap: wrap;
}
.intro {
  margin-left: 50px;
  text-align: center;
  inline-size: 400px;
  overflow-wrap: break-word;
  color: black;
  padding-right: 50px;
  /* flex-basis: 50%; */
}

.pic {
  flex-basis: 50%;
}
</style>