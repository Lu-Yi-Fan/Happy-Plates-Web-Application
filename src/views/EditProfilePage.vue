<template>
    <NavigationBar/>
    <div class="userProfile">
      <form @submit.prevent="editProfile" id="editProfile">
        <h5 style="color: #084298"><b>Account Information</b></h5>
  
        <div class="form-group">
          <label class="labels" for="username">Account name: </label>
          <input type="text" id = "username" placeholder="username" v-model="username" required>
        </div>
  
        <div class="form-group">
          <label class="labels" for="password">Password: </label>
          <input v-if="showPassword" type="text" v-model="password" id="password" required/>
          <input v-else type="password" v-model="password" id="password" required>
          <input class="showPassText" type="checkbox" @click="showPasswordMethod()" style="width: 15px"> Show Password
        </div>
  
        <h5 style="color: #084298"><b>My Details</b></h5>
  
        <div class="form-group">
          <label class="labels" for="gender">Gender: </label>
  
          <label for="female" class="radioLabels">Female</label>
          <input type="radio" name="gender" id="female" value="Female" v-model="gender">
  
          <label for="male" class="radioLabels">Male</label>
          <input type="radio" name="gender" id="male" value="Male" v-model="gender">
  
        </div>
  
        <div class="form-group">
          <label class="labels" for="weight">Weight (KG):  </label>
          <input type="number" id = "weight" v-model="weight">
        </div>
  
        <div class="form-group">
          <label class="labels" for="height">Height (CM): </label>
          <input type="number" id = "height" v-model="height">
        </div>
  
        <div class="form-group">
          <label class="labels" for="email">Email: </label>
          <input type="email" id = "email" placeholder="user email" v-model="email" disabled>
        </div>

        <div class="form-group">
          <label class="labels" for="exerGoal">Exercise level: </label>
          <select id="exerGoal" name="exerGoal" v-model="exerGoal" required>
            <option value="Less than 2 hrs">Less than 2 hrs</option>
            <option value="2-5 hrs">2 - 5 hrs</option>
            <option value="5-10 hrs">5 - 10 hrs</option>
            <option value="More than 10 hrs">More than 10 hrs</option>
          </select>
        </div>
    

        <h5 style="color: #084298"><b>My Goal</b></h5>
  
        <div class="form-group">
          <label class="labels" for="dailyCal">Daily Calories Intake: </label>
          <input type="number" id = "dailyCal" v-model="dailyCal">
        </div>
  
        <div class="form-group">
          <label class="labels" for="dietGoal">Diet Goal: </label>
          <select id="dietGoal" name="dietGoal" v-model="dietGoal" required>
            <option value="Weight Loss">Weight Loss</option>
            <option value="Maintain Weight">Maintain Weight</option>
            <option value="Weight Gain">Weight Gain</option>
          </select>
        </div>
        <div id = 'calculatedValueContainer'>
          <label for="calculatedValue">Recommended Calorie Intake Calculator <span style="color: blue;">*</span> </label>
        <input type="number" id="calculatedValue" v-model="calculatedValue" readonly>
        </div>

  
      </form>
      <button class="btnGrp" type="button" style="background-color: floralwhite" v-on:click="cancelEdit">Cancel</button>
      <button class="btnGrp" type="submit" v-on:click="editProfile">Save</button>
    </div>
  
  </template>
  
  <script>
  import NavigationBar from "@/components/NavigationBar.vue"
  import { getAuth, updatePassword} from "firebase/auth";
  import { getFirestore, collection, getDoc, getDocs, query, where, doc,updateDoc} from 'firebase/firestore';
  
  const auth = getAuth();
  
  export default {
    name:"EditProfilePage" ,
    components : {
      NavigationBar,
    },
    data() {
      return {
        showPassword:false,
        email:'',
        password: '',
        username:'',
        gender:'',
        weight:0,
        height:0,
        dailyCal:0,
        dietGoal:'Weight Loss',
        goalWeight:0, 
        exerGoal: ''
      }
    },
    computed: {
      calculatedValue() {
        if (this.weight && this.dietGoal) {
          var exerciseAdd = 0;
          if (this.exerGoal) {
            console.log(this.exerGoal)
            if (this.exerGoal == "Less than 2 hrs") {
              exerciseAdd = 50
            } else if (this.exerGoal == "2-5 hrs") {
              exerciseAdd = 100
            } else if (this.exerGoal == "5-10 hrs") {
              exerciseAdd = 150
            } else {
              exerciseAdd = 200
            }
          }
          console.log(exerciseAdd)
          var calGoal = 0;
          if (this.dietGoal === "Weight Loss") {
            calGoal = (this.weight * 2.20 * 10)
            if (this.exerGoal){
              return (calGoal + exerciseAdd).toFixed(0);
            }else{
              return calGoal.toFixed(0);
            }
          } else if (this.dietGoal === "Maintain Weight") {
            calGoal = (this.weight * 2.20 * 14)
            if (this.exerGoal){
              return (calGoal + exerciseAdd).toFixed(0);
            }else{
              return calGoal.toFixed(0);
            }
          } else {
            calGoal = (this.weight * 2.20 * 17)
            if (this.exerGoal){
              return (calGoal + exerciseAdd).toFixed(0);
            }else{
              return calGoal.toFixed(0);
            }
          }
        } else {
           return "";
          }
        }
    },
    created() {
      this.renderProfile();
    },
  
    methods : {
      async renderProfile(){
        const currentUser = auth.currentUser
        if (currentUser){
          this.email = currentUser.email
          console.log("Current User: ",this.email)
  
          const userCollection = collection(getFirestore(), "Users");
          const profileQuery = query(
              userCollection,
              where("email", "==", this.email),
          );
  
          const querySnapshot = await getDocs(profileQuery);
          const userDocument = (querySnapshot.docs)[0]
          const userData = userDocument.data()
          this.password = userData.password;
          this.username = userData.userName;
          this.gender = userData.gender;
          //fields may not exist
          this.height = userData?.height || 0;
          this.weight = userData?.weight || 0;
          this.dailyCal = userData?.dailyIntakeGoal || 0;
          this.dietGoal = userData?.goal || 'Weight Loss';
          this.goalWeight = userData?.goalWeight || 0;
          this.exerGoal = userData?.exercise || 'Less than 2 hrs'
  
        }else{
          console.log('No user is signed in')
        }
  
      },
      async editProfile(){
        const currentUser = auth.currentUser
        const email = currentUser.email
        //get page input data
  
        const userCollection = doc(collection(getFirestore(), "Users"), email);
  
        await updateDoc(userCollection, {
          userName:this.username,
          gender:this.gender,
          height:this.height,
          weight:this.weight,
          dailyIntakeGoal:this.dailyCal,
          goal:this.dietGoal,  
          exercise:this.exerGoal,
        })
            .then(() => {
              alert('User details updated successfully');
  
            })
            .catch((error) => {
              alert('Error updating document: ', error);
            });
  
        const newPassword = this.password
        await updatePassword(currentUser, newPassword)
            .then(() => {
              console.log('User password updated successfully');
            })
            .catch((error) => {
              alert('Error updating user password: ', error)
            })
  
        this.$router.push("/ProfilePage");
      },
      cancelEdit(){
        this.$router.push("/ProfilePage");
      },
      showPasswordMethod(){
        this.showPassword = !this.showPassword;
      },
    },
  }
  </script>
  
  <style scoped>
  .userProfile{
    margin-top: 5vh;
    font-size: 1.2rem;
    height: 60px;
    float: left;
    margin-left: 65vh;
    height:max-content;
    justify-content: center;
    text-align: center;
  }
  .userProfile h5{
    text-align: left;
    margin-top: 20px;
    margin-bottom: 10px;
  }
  #editProfile{
    display: grid;
  }
  .form-group {
    display: flex;
    align-items: flex-start;
    float: left;
    margin-bottom: 10px;
  }
  .labels{
    width: 200px;
    float: left;
    display: block;
    font-size: 16px;
    margin-bottom: 5px;
    text-align: left;
    border-block-color: #e9e9e9;
  }
  .form-group input{
    width: 250px;
    height: 27px;
  }
  #password{
    padding-right: 5px;
  }
  #female,#male,#other{
    width: fit-content;
    margin-left: 10px;
    margin-right: 30px;
  }
  #dietGoal{
    width: fit-content;
    height: 25px;
  }
  #exerGoal{
    width: fit-content;
    height: 25px;
  }
  .showPassText{
    margin-left: 2vh;
  }

  #calculatedValue {
  background-color: transparent;
  border: none;
  box-shadow: none;
  width: fit-content;
  height: 25px;
  display: inline-block;
  text-align: left;
  width: 300px; /* adjust this value as needed */
  margin-right: 100px; /* adjust this value as needed */
}

  .btnGrp{
    float: left;
    display: block;
    border-color: #2c3034;
    border-width: thin;
    color: #333333;
    margin-right: 40px;
    margin-top: 20px;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    font-size: 17px;
    border-radius: 30px;
    width: 100px;
  }
  label {
    font-size: 16px; /* adjust this value as needed */
  }
</style>