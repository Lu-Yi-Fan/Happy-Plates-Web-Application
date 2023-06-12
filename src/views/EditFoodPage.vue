<template>
  <div>
    <NavigationBar/>
  </div>
  
  <div id="food">
    <Tab :isSelected="true">
      <div class="QuickAdd">
        <img class="images" src="@/assets/images/forkspoon.png" width="130" height="120">
        <h1 class="quickaddtitle">Edit meal</h1>
      </div>
      <div class="centered">
        <form @submit.prevent="editFood" class="newFood"> 
          <!-- Quick Add Form -->
          <label class="labels" for="foodName">FOOD NAME: {{ foodName.foodName }}</label>
          <select class="formfields" for="foodName" id="foodName" v-model="foodName" >
            <option v-for="food in foodNames" :value="food" >{{ food.foodName }}</option>
          </select>
          <br>
          <div v-if="foodName" >
            <p> NUMBER OF CALORIES: {{ foodName.numCalories }} </p>
          </div>
          <div v-else>
            <p>NUMBER OF CALORIES: 0 </p>
          </div>

          <label class="labels" for="foodName">MEAL TYPE: {{ mealType }}</label>
          <select class="formfields"  v-model="mealType">
            <option>Breakfast</option>
            <option>Lunch</option>
            <option>Dinner</option>
            <option>Snacks</option>
          </select>

          <label class="labels" for="foodName">NUMBER OF SERVINGS: {{ numServings }}</label>
          <select  type=number  class="formfields" v-model="numServings">
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
            <option>6</option>
            <option>7</option>
            <option>8</option>
            <option>9</option>
            <option>10</option>
          </select>

          <!-- Edit Button -->
          <button class="button" id="editFood" type="submit" >Edit</button><br><br>
        </form>
      </div>
    </Tab>
  </div>
</template>


<script>
import NavigationBar from "@/components/NavigationBar.vue"
import { doc, setDoc, addDoc, getFirestore, collection, query, where, getDocs, deleteDoc} from "firebase/firestore"; 
import { getAuth, onAuthStateChanged} from "firebase/auth";
import { onMounted } from 'vue';
import Tab from "@/components/Tab.vue";
import TabNav from "@/components/TabNav.vue";
import CustomFoodForm from "@/components/CustomFoodForm.vue";
import CustomFoodCard from "@/components/CustomFoodCard.vue";
import MealHeader from '@/components/MealHeader.vue';
import axios from 'axios';
import Papa from 'papaparse';


let currEmail=  "";

export default {
    name:"EditFoodPage" ,
    data() {
        return {
            selected: "Quick Add",
            foodName: {
            foodName: this.$route.query.foodProp[2],
            numCalories: this.$route.query.foodProp[4]
            },
            mealType: this.$route.query.foodProp[3],
            numServings: this.$route.query.foodProp[5],
            showForm: false,
            haveCustomFood: false,
            customFoodData: [],
            foodNames: []
        };
        },

    components : {
        NavigationBar,
        Tab,
        TabNav,
        CustomFoodForm,
        CustomFoodCard, 
        MealHeader
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

    // function that retrieves the foods from the food database (csv)
    async displayFood() {
      const url = 'https://raw.githubusercontent.com/Lu-Yi-Fan/Testing/main/food.csv';
      await fetch(url)
      .then((response) => {
        return response.text();
      })
      .then((csvText) => {
        // Process the CSV data
        // console.log(csvText);
        // Here, you can parse the CSV data as needed
        // For example, you can use a library like Papa Parse to parse the CSV data into an array
        const csvData = Papa.parse(csvText);
        // console.log(csvData);
        let foodNames = csvData.data.map(food => {
          return {
            foodName: food[0],
            numCalories: food[2],
          };
        });
        this.foodNames = foodNames;

      })
      .catch((error) => {
        // Handle any errors
      });
    },

    setSelected(tab)  {
      this.selected = tab;
    },

    addCustomFoodButton() {
      this.showForm = true;
    },

    // function to edit the foods through using the details keyed in from the user that edits the current foods' 
    // details to the updated one. updated one will then be shown on the food log page 
    async editFood(){

      const auth = getAuth();
      const user =  auth.currentUser.email;
      // console.log("email", user);
      // console.log(currEmail);


      let foodData = {
        foodName: this.foodName.foodName,
        mealType: this.mealType.value,
        numServings: this.numServings.value,
        numCalories: this.foodName.numCalories

      };
      const current = new Date();
      const yyyy = current.getFullYear();
      let mm = current.getMonth() + 1; // Months start at 0!
      let dd = current.getDate();
      if (dd < 10) dd = '0' + dd;
      if (mm < 10) mm = '0' + mm;
      const date = `${dd}-${mm}-${current.getFullYear()}`;

      // delete the current food document
        const mealsCollectionRef = collection(getFirestore(), "Meals");
        const queryRef = query(
            mealsCollectionRef,
            where("email", "==", currEmail),
            where("date", "==", date),
            where("foodName", "==", this.$route.query.foodProp[2]),
            where("mealType", "==", this.$route.query.foodProp[3]),
            where("numServings", "==", this.$route.query.foodProp[5])
        );
        const querySnapshot = await getDocs(queryRef);
        querySnapshot.forEach((doc) => {
            deleteDoc(doc.ref);
        });
      
      // add the document to the current date based on bf/lunch/dinner
      // add new date document 

      // add to meal collections
      const newDocRef = doc(collection(getFirestore(), "Meals"));
            await setDoc(newDocRef, {
              email: currEmail,
              date: date,
              foodName: this.foodName.foodName, 
              mealType: this.mealType, 
              numServings: this.numServings,
              numCalories: this.foodName.numCalories
              
              
        });
      alert("Food Successfully Edited")

      // console.log(date);
      this.$router.push('/FoodLogPage');

    
    },

    // function that retreives the custom food that updates the custom foods that the user has 
    async retrieveCustomFood() {
        const auth = getAuth();
        let userEmail;
        onAuthStateChanged(auth, async (user) => {
          // console.log("Auth state changed:", user);
          if (user) {
            userEmail = user.email;
            // console.log("Current user email:", userEmail);
            const current = new Date();
            const yyyy = current.getFullYear();
            let mm = current.getMonth() + 1; // Months start at 0!
            let dd = current.getDate();
            if (dd < 10) dd = '0' + dd;
            if (mm < 10) mm = '0' + mm;
            const today = dd + '-' + mm + '-' + yyyy;
            // console.log(today);
            const mealsRef = collection(getFirestore(), "CustomFood");
            // console.log(mealsRef);
            const q = query(mealsRef, where("email", "==", userEmail));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
              this.customFoodData.push(doc.data());
            });

            // if more than 0, the change this to true 
            if (this.customFoodData.length > 0) {
              this.haveCustomFood = true;
            }
  
          }
        });

      }

    },
  created() {
      this.foodData = [];
      this.retrieveCustomFood();
      this.displayFood();
    }
  }


</script>

<style scoped>


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


.labels {
text-align: center;
font-size: 15px;
margin-top: 20px;
display: block;
margin-top: 2vh;


}



.formfields {
text-align: center;
border-radius: 10px;
width: 225px;
height: 30px;
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
left: 50%;
margin-top:2vh;
margin-left: -8vh;

}






.QuickAdd{
display: flex;
font-size: 20;
justify-content: center;
margin-top: -10vh;

}

.images {
padding-top: 20px;
justify-content: center;
margin-top: 10vh;

}

/* .newFood {
margin-top: 100px;
} */

#food {
justify-content: center;
display: flex;
flex-direction: row;
padding-top: 30px;

}



</style>