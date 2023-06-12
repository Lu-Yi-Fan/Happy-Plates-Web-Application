<template>
    <div>
    <NavigationBar/>
  </div>
  <div>
    <h1 class="quickaddtitle">Edit Custom Food</h1>

  </div>
     <form @submit.prevent="editCustomFood" class="newFood"> 
        <!-- Quick Add Form -->
        <label class="labels" for="foodName">FOOD NAME</label>
        <input  class="formfields"  id="foodName" placeholder="Enter Custom Food Name " v-model="foodName" />
     
        
        <div>
        <label class="labels" for="foodName">NUMBER OF CALORIES</label>
        <input class="formfields" id="numCalories" placeholder="Enter Calories Per Serving" v-model="numCalories" />
      </div>
        
        <!-- Save Button -->
        <button class="button" id="editFood" type="submit" >Edit Food</button><br><br>

      </form>

</template> 

<script>

import NavigationBar from "@/components/NavigationBar.vue";
import FoodCard from "@/components/FoodCard.vue";
import AddFoodPage from "@/views/AddFoodPage.vue";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import firebaseApp from "@/firebase.js";
import { getFirestore, collection, getDoc, getDocs, query, where, doc, setDoc, deleteDoc} from 'firebase/firestore';

let currEmail=  "";
export default {
    name: "EditCustomFoodPage",
    data() {
      return {
        selected: "Quick Add",
        foodName: this.$route.query.customFoodProp[2],
        numCalories: this.$route.query.customFoodProp[3],
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

    // check if user authenticated and then allows the edit of food servings which will be sent to the database
    async editCustomFood() {
      const auth = getAuth();
      const user =  auth.currentUser.email;
      console.log("email", user);
      console.log(currEmail);


      let customFoodData = {
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
        const mealsCollectionRef = collection(getFirestore(), "CustomFood");
        const queryRef = query(
            mealsCollectionRef,
            where("date", "==", this.$route.query.customFoodProp[0]),
            where("email", "==", this.$route.query.customFoodProp[1]),
            where("foodName", "==", this.$route.query.customFoodProp[2]),
            where("numCalories", "==", this.$route.query.customFoodProp[3])
        );
        const querySnapshot = await getDocs(queryRef);
        querySnapshot.forEach((doc) => {
            deleteDoc(doc.ref);
        });

      const newDocRef = doc(collection(getFirestore(), "CustomFood"));
            await setDoc(newDocRef, {
              email: currEmail,
              date: date,
              foodName: this.foodName, 
              numCalories: this.numCalories
            
        });
      alert("Custom Food Edited Successfully");
      this.$router.push('/AddFoodPage');
      
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

button {
  border: 2px solid black;
  border-radius: 50px;
  color: black;
  font-weight: 400;
}
#editFood {
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
  border: 2px solid black;
}

.labels {
text-align: center;
font-size: 15px;
margin-top: 20px;
display: block;


}

.centeredCustom {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}


.formfields {
  text-align: center;
  border-radius: 10px;
  width: 225px;
  height: 30px;
  margin: 0 auto;
}

input:hover {
  border-radius: 1px;
  transition: 0.2s ease in;
}

h1 {
margin-top: 60px;
padding-top: 70px;
}




#editFood:hover {
background-color: red;
}


.centered {
position: fixed;
top: 25%;
left: 50%;
margin-top:2vh;
margin-left: -100px;

}
.quickaddtitle {
  margin-top: 5vh;
}

.customfoodtitle {
  margin-top: -30px;
}



.QuickAdd{
display: flex;
font-size: 20;
justify-content: center;
margin-top: 0px;
}

.images {
padding-top: 20px;
justify-content: center;
margin-bottom: 30px;

}



.imagescustom{
margin-top: 30px;
margin-right: 12px;
justify-content: center;

}

.newFood {
  margin-top: 10vh;
}

#food {
justify-content: center;
display: flex;
flex-direction: row;
padding-top: 30px;

}

.noCustomFood{
  display: flex;
  justify-content: center;
  font-size: 20px;
  font-style: italic;
  align-items: center;
  text-align: center;
  height: 50vh;

  

}

.meal-header {
  background-color: rgb(135, 187, 255);
  font-size: 25px;
  max-width: 95%;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  display: flex;
  margin-bottom: 25px;
  box-shadow: 2px px 6px rgba(121, 124, 126, 0.3);
  margin-top: 10px;

}

.images {
  margin: 0 5px;
}
</style>