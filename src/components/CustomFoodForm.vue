<template>
     <form @submit.prevent="addCustomFood" class="newFood"> 
      <!-- Quick Add Form -->
      <label class="labels" for="foodName">FOOD NAME</label>
      <input  class="formfields"  id="foodName" placeholder="Enter Custom Food Name " v-model="foodName" />
      <div>
        <label class="labels" for="foodName">NUMBER OF CALORIES</label>
        <input class="formfields" id="numCalories" placeholder="Enter Calories Per Serving" v-model="numCalories" />
      </div>
        
        <!-- Save Button -->
        <button class="buttonSaveFood" id="saveFood" type="submit" >Save Food</button><br><br>
      </form>
</template> 

<script>

import NavigationBar from "@/components/NavigationBar.vue";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import { getFirestore, collection, getDoc, getDocs, query, where, doc, setDoc} from 'firebase/firestore';

let currEmail=  "";
export default {
    name: "CustomFoodForm",
    data() {
      return {
        selected: "Quick Add",
        foodName: "", 
        numServings: null,
        showForm: false,
      };
    },
    components : {
        NavigationBar,

    },

    async mounted () {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          currEmail = user.email;
        } 
      });
    },

  methods: {
    setSelected(tab)  {
      this.selected = tab;
    },

    addCustomFoodButton() {
      this.showForm = true;
    },

    async addCustomFood() {

      const auth = getAuth();
      const user =  auth.currentUser.email;
      console.log("email", user);
      console.log(currEmail);


      let cutomFoodData = {
        foodName: this.foodName.value,
        numCalories: this.numCalories.value
      };
      
      const current = new Date();
      const yyyy = current.getFullYear();
      let mm = current.getMonth() + 1; // Months start at 0!
      let dd = current.getDate();
      if (dd < 10) dd = '0' + dd;
      if (mm < 10) mm = '0' + mm;
      const date = `${dd}-${mm}-${current.getFullYear()}`;
      // add the document to the current date based on bf/lunch/dinner
      // add new date document 

      // add to meal collections
      const newDocRef = doc(collection(getFirestore(), "CustomFood"));
            await setDoc(newDocRef, {
              email: currEmail,
              date: date,
              foodName: this.foodName, 
              numCalories: this.numCalories
            
        });
      alert("Added Custom Food Successfully")

      console.log(date);
      console.log(this.foodName)
      console.log(this.numCalories)


      
    },
  created() {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.user = user;
          console.log(this.currentUser.email);
        }
      });
    }
  }
}


</script>



<style scoped>

.buttonSaveFood{
  cursor: pointer;
  margin-top: 20px;
  padding-top: 20px;
  padding: 16px 20px;
  border-radius: 20px;
  border:none;
  font-size: 12px;
  color: black;
  background-color: green;
  transition-duration: 0.42s;
  justify-content: center;
}


.buttonSaveFood:hover {
    box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);
    border-radius: 2px;
}

#addCustomFood {
  cursor: pointer;
  margin-top: 20px;
  padding-top: 20px;
  padding: 16px 20px;
  border-radius: 20px;
  border:none;
  background-color: rgb(86, 239, 86);
  margin-bottom:20px;
  margin-left: 20px;

}

.labels {
text-align: center;
font-size: 15px;
margin-top: 20px;
display: block;


}

.centeredCustom {
  justify-content: center;
  display: flex;
}

.formfields {
text-align: center;
border-radius: 10px;
width: 225px;
height: 30px;
}

input:hover {
  border-radius: 1px;
  transition: 0.2s ease in;
}

h1 {
margin-top: 60px;
padding-top: 70px;
}




</style>