<template>
    <div>
      <br>
      <img src="@/assets/images/CommonElements/HappyPlatesWord.png" alt="HP Words" style="width: 300px; height: auto" >
      <br>
      <img src="@/assets/images/CommonElements/HappyPlatesLogo.png" alt="HP Logo" style="width: 400px; height: auto" >
      <h3>Sign in to continue</h3>
      <div id="inputContainer">
          <form id="myForm">
              <div class="formLi">
                  <label class="labels" for="userEmail">EMAIL</label>
                  <input type="text" autocomplete="off" id = "userEmail" required= "" placeholder="Enter your email"> <br>
  
                  <label class="labels" for="ticker1">PASSWORD</label>
                  <input type="password" id = "userPass" required= "" placeholder="Enter your password" @keyup.enter="verifyUser"> <br>
                   <div class="signUpPage">
                        <router-link to="/SignUpPage"> Don't have an account? Sign up now!</router-link>
                  </div>
                  <br>
                  <p v-if="errorMessage">{{  errorMessage }}</p>
                  <div class="save">
                      <button id="signInBtn" type="button" v-on:click="verifyUser">SIGN IN</button><br><br>
                  </div>
              </div>
          </form>
      </div>
      </div>
</template>
  
  
<script>
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, getDoc, getDocs, query, where, doc} from 'firebase/firestore';

const auth = getAuth();
  
export default {
    methods: {
        async verifyUser(){
            console.log("VERIFYING USER")
            let userEmail = document.getElementById("userEmail").value
            let userPassword = document.getElementById("userPass").value
            signInWithEmailAndPassword(auth, userEmail, userPassword)
            .then((userCredential) => {
                const user = userCredential.user;
                alert("Login Success")
                this.$router.push('/HomePage');
              }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
                alert(errorMessage);
        });
        }
    },
  };
</script>


  
<style>
  #signInBtn{
      display: block;
      margin: 0 auto;
      color: white;
      padding: 10px;
      height: 50px;
      width: 200px;
      text-align: center;
  }
  #signInBtn:hover {
    box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);
    border-radius: 2px;
}
  .formLi {
      display: inline-block;
      text-align: right;
  }
  input:hover {
      box-shadow: 3px 3px rgb(0, 0, 0);
      border-radius: 2px;
  }
  #userEmail,#userPass {
    border-radius: 10px;
    font-size: 16px;
    padding: 10px;
    width: 300px;
    background-color: #e9e9e9;
  }
  .labels {
    display: block;
    font-size: 16px;
    margin-bottom: 5px;
    text-align: left;
    border-block-color: #e9e9e9;
  }
  .signUpPage{
      text-align: center;
  }
  .signUpPage:hover {
      text-shadow: blue;
  }
</style>
