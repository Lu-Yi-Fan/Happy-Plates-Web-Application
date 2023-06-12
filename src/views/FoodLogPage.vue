<template>
  <div>
    <NavigationBar/>
  
   
    <div class="save">
      <button class="addButton"  v-on:click="addNewFood">
        <div class="button-content">
        <img class="plusimage" src="@/assets/images/greenadd.png"  id="saveButton" >
        <span class="button-text"> Add New Food</span>
        </div>
        </button>
          
      <br><br>
    </div>

    <meal-header :calories="breakfastCalories" meal="Breakfast" />
    <FoodCard :food="food" v-for="(food, index) in breakfastFoods" :key="index" @delete="deleteFoodHandler" @edit="editFoodHandler"/>
    <template v-if="breakfastCalories === 0">
      <div class = "noteaten">You have not eaten breakfast :(</div>
    </template>

    <meal-header :calories="lunchCalories" meal="Lunch"/>
    <FoodCard :food="food" v-for="(food, index) in lunchFoods" :key="index" @delete="deleteFoodHandler" @edit="editFoodHandler"/>
    <template v-if="lunchCalories === 0">
      <div class = "noteaten">You have not eaten lunch :(</div>
    </template>

    <meal-header :calories="dinnerCalories" meal="Dinner"/>
    <FoodCard :food="food" v-for="(food, index) in dinnerFoods" :key="index" @delete="deleteFoodHandler" @edit="editFoodHandler"/>
    <template v-if="dinnerCalories === 0">
      <div class = "noteaten">You have not eaten dinner :(</div>
    </template>

    <meal-header :calories="snacksCalories" meal="Snacks"/>
    <FoodCard :food="food" v-for="(food, index) in snacksFoods" :key="index" @delete="deleteFoodHandler" @edit="editFoodHandler"/>
    <template v-if="snacksCalories === 0">
      <div class = "noteaten">You have not eaten any snacks :)</div>
    </template>

  </div>

</template>


<script>
import NavigationBar from "@/components/NavigationBar.vue";
import FoodCard from "@/components/FoodCard.vue";
import AddFoodPage from "@/views/AddFoodPage.vue";
import EditFoodPage from "@/views/EditFoodPage.vue";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import firebaseApp from "@/firebase.js";
import { getFirestore, collection, getDoc, getDocs, query, where, doc, deleteDoc, onSnapshot} from 'firebase/firestore';
import MealHeader from '@/components/MealHeader.vue';

let currEmail=  "";



export default {
    name:"FoodLogPage" ,
    data() {
      return {
      foodData: [],
      };
    },

    computed: {

    breakfastIsEmpty() {
    return this.breakfastFoods.length === 0;
  },
  lunchIsEmpty() {
    return this.lunchFoods.length === 0;
  },
  dinnerIsEmpty() {
    return this.dinnerFoods.length === 0;
  },
  snacksIsEmpty() {
    return this.snacksFoods.length === 0;
  },

    
     totalCalories() {
    let sum = 0;
    for (let i = 0; i < this.foodData.length; i++) {
      sum += this.foodData[i].numCalories * this.foodData[i].numServings;
    }
    return sum;
  },

    breakfastFoods() {
      return this.foodData.filter((food) => food.mealType === "Breakfast");
    },
    breakfastCalories() {
      return this.breakfastFoods.reduce(
        (total, food) => total + food.numCalories * food.numServings,
        0
      );
    },

    lunchFoods() {
      return this.foodData.filter((food) => food.mealType === "Lunch");
    },
    lunchCalories() {
      return this.lunchFoods.reduce(
        (total, food) => total + food.numCalories * food.numServings,
        0
      );
    },

    dinnerFoods() {
      return this.foodData.filter((food) => food.mealType === "Dinner");
    },
    dinnerCalories() {
      return this.dinnerFoods.reduce(
        (total, food) => total + food.numCalories * food.numServings,
        0
      );
    },

    snacksFoods() {
      return this.foodData.filter((food) => food.mealType === "Snacks");
    },
    snacksCalories() {
      return this.snacksFoods.reduce(
        (total, food) => total + food.numCalories * food.numServings,
        0
      );
    },
  },
  
    components : {
        NavigationBar,
        FoodCard,
        MealHeader
    },

    created() {
      this.foodData = [];
      this.retrieveFood();
    },

    methods: {

      async editFoodHandler(food) {
        console.log("hihi");
        console.log(food);
        if (confirm("Are you sure you want to edit this meal?")) {
          console.log("foodlogpage edit emitted");
          const foodOrder = ['date', 'email', 'foodName','mealType','numCalories','numServings'];
          const foodList = foodOrder.map((key) => [food[key]]);
          this.$router.push({path: "/EditFoodPage", query: { foodProp: foodList }});
        }
      },
      
      async deleteFoodHandler(food) {
        console.log("foodlogpage delete emitted");
        if (confirm("Are you sure you want to delete this meal?")) {
        console.log("emit received");
          const auth = getAuth();
          let userEmail;
          onAuthStateChanged(auth, async (user) => {
            if (user) {
              userEmail = user.email;
              const mealsRef = collection(getFirestore(), "Meals");
              const q = query(mealsRef, where("date", "==", food.date), where("email", "==", food.email), where("foodName", "==", food.foodName), 
              where("mealType", "==", food.mealType) , where("numCalories", "==", food.numCalories), where("numServings", "==", food.numServings));
              const querySnapshot = await getDocs(q);
              querySnapshot.forEach((doc) => {
                deleteDoc(doc.ref);
              });
              alert("Food Successfully Deleted")
            }
          });
        }
      },



      addNewFood() {
        this.$router.push('/AddFoodPage');
      },

      async retrieveFood() {
        const auth = getAuth();
        let userEmail;
        onAuthStateChanged(auth, async (user) => {
          console.log("Auth state changed:", user);
          if (user) {
            userEmail = user.email;
            console.log("Current user email:", userEmail);
            const current = new Date();
            const yyyy = current.getFullYear();
            let mm = current.getMonth() + 1; // Months start at 0!
            let dd = current.getDate();
            if (dd < 10) dd = '0' + dd;
            if (mm < 10) mm = '0' + mm;
            const today = dd + '-' + mm + '-' + yyyy;
            // console.log(today);
            const mealsRef = collection(getFirestore(), "Meals");
            console.log(mealsRef);
            const q = query(mealsRef, where("email", "==", userEmail), where("date","==", today));
            const unsubscribe = onSnapshot(q, (snapshot) => {
              this.foodData = [];
              snapshot.forEach((doc) => {
                this.foodData.push({ id: doc.id, ...doc.data() });
              });
            }, (error) => {
              console.error(error);
            });
            this.unsubscribe = unsubscribe;
          }
        });
      }
    }
  }
</script>



<style scoped>
button{
  margin-top: 20px;
  border: 2px solid black;
  border-radius: 50px;
  height: 8.5vh;
}
.button-content { 
  margin-top: 8px;
  display: block;
}

.button-text{
  margin-left: 4px;
  justify-content: center;
  display:flexbox;
  font-weight:600;
  font-size: 22px;
  color: black;
}

.save {
  display: flex;
  justify-content: center;
  height: 10vh;
}

.plusimage {
  background-color: greenyellow;
  color: black;
  font-size: 30px;
  border-radius: 30px;
  width: 6vh;
  height: 6vh;
  margin-top: -13px;
  justify-content: center;
  align-items: center;
  display: flexbox;
  margin-right: 5px;

}



.noteaten {
  font-size: 20px;
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
  color: black;
  border-radius: 50px;
  background-color: #F0FFF0;
  align-items: center;
  margin-left: 5%;
  margin-right: 5%;
  box-shadow: 2px 2px 6px rgba(53, 61, 53, 0.3);
  height: 100px;
  font-style: italic;

}

</style>