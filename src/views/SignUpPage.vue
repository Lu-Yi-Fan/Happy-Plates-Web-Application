<template>
  <br>
  <div>
    <div id="header">
      <router-link to="/"> <img src="@/assets/images/HomePageElements/Home.png" alt="Home" style="width:42px;height:42px;"></router-link>
      <h1 id="title">CREATE AN ACCOUNT</h1>
      <img src="@/assets/images/CommonElements/HappyPlatesLogo.png" alt="Logo" style="width:250px; height: auto;float: right;">
    </div>

    <div id="inputContainer">
        <form @submit.prevent="register" id="myForm">
            <div class="register">
                <label class="labels" for="userName">USERNAME <span style="color: red;">*</span></label>
                <input autocomplete="off" type="userName" id = "userName" placeholder="Enter your username" v-model="username" required> <br>

                <label class="labels" for="userEmail">EMAIL <span style="color: red;">*</span></label>
                <input type="email" autocomplete="off" id = "userEmail"  placeholder="Enter your email" v-model="email" required> <br>

                <label class="labels" for="userPass">PASSWORD <span style="color: red;">*</span></label>
                <input type="password" id = "userPass" placeholder="Enter your password" v-model="password" required> <br>

                <label class="labels" for="dob">DATE OF BIRTH <span style="color: red;">*</span></label>
                <input type="date" id="dob" placeholder="DD/MM/YYYY" v-model="dob" required><br>

                <label class="labels" for="gender">GENDER <span style="color: red;">*</span></label>
                <select id="gender" name="gender" v-model="gender" required>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>

                 <br>
                 <div class="LoginPage">
                   <p>Already have an account? <router-link to="/LoginPage">Sign in</router-link></p>
                </div>

                <div class="save">
                    <button id="registerButton" type="submit" >REGISTER</button><br>
                </div>
                <p v-if="error" class="error" style="font-size: medium">{{ this.error }}</p>

            </div>
        </form>
    </div>
    </div>
</template>

<script>
import fireBaseApp from "../firebase.js"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, addDoc, getFirestore} from "firebase/firestore";
import { collection } from 'firebase/firestore'

const auth = getAuth();

export default {
  name: "SignUp",
  props: {
    msg: String
  },
  data() {
    return {
      email:null,
      password: null,
      username:null,
      dob:null,
      gender:null,
      error:''
    }
  },
  methods: {
    // send document to firebase database with user details 
      async register(){
      createUserWithEmailAndPassword(auth, this.email, this.password)
          .then(async (userCred) => {
            const user = userCred.user;
            // console.log(user);
            const newDocRef = doc(collection(getFirestore(), "Users"), user.email);
            await setDoc(newDocRef, {
              email: this.email,
              userName: this.username,
              dob:this.dob,
              gender:this.gender

            });
            alert("Your HappyPlates account has registered successful!")

            this.$router.push({
              name: 'QuestionnairePage',
              query: {
                email: this.email
              }
            })
          }).catch(error => {
              if (error.code === 'auth/email-already-in-use') {
                this.error = 'Email already registered.'
              } else if (error.code === 'auth/weak-password') {
                this.error = "Password should be at least 6 characters"
              } else {
                this.error = error.message
              }
              const errorCode = error.code;
              console.log(errorCode, error);
              alert(error);
      
      });
      }
  }
};
</script>

<style>
#header{
  display:flex;
  justify-content: space-between;
  height: fit-content;
  padding-left: 1%;
  float: top;

}
#title{
  margin-left: 200px;
}
#registerButton{

  background-color: rgb(126, 216, 87); /* change the background color of the button to lime green */
  border-radius: 10px; /* make the edges of the button rounded */
  border: 2px solid rgb(126, 216, 87); /* add a lime green border to the button */
  padding: 10px 50px; /* add some padding to the button */
  color: white;
  display: block;
  justify-content: center;
  text-align: center;
  margin-left: 7vh;
}


#registerButton:hover {
    box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);
    border-radius: 2px;
}
.register {
    display: inline-block;
    text-align: right;
}
input,select{
  display: block;
  width: 100%;
  box-sizing: border-box;
}
input:hover,select:hover {
    box-shadow: 3px 3px rgb(0, 0, 0);
    border-radius: 2px;
}
#userEmail,#userPass, #userName, #dob, #gender {
  border-radius: 10px;
  font-size: 16px;
  padding: 10px;
  width: 300px;
  background-color: #e9e9e9;
}
.labels {
  display: block;
  font-size: 16px;
  text-align: left;
  border-block-color: #e9e9e9;
}
.LoginPage{
    text-align: center;
}
.LoginPage:hover {
    text-shadow: blue;
}

</style> 