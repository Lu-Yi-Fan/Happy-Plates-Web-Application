<template>
  <NavigationBar/>
  <div class="homePageContainer1">
      <!-- Container containing calendar and the text of the date displayed  -->
      <div class="childContainer1">
          <div class="calendar">
              <ul> 
                  <router-link to="/CalendarPage">
                    <!-- Calendar Button for users to access past dates  -->
                  <img src="@/assets/images/HomePageElements/Calender.png" class="calendar">
                  </router-link>
              </ul>    
          </div>
      </div>
      <div class="childContainer1">
           <div class="homePageDate">
              <!-- Conditional rendering to display the text  -->
              <h1 v-if="this.todayDate === this.date">TODAY'S SUMMARY</h1>
              <h1 v-else>{{ this.date }} SUMMARY</h1>
          </div> 
      </div>
  </div>
  <div class="homePageContainer2">
    <img src="@/assets/images/CommonElements/HappyPlatesLogo.png" alt="HP Logo" style="width: 300px; height: auto">
  </div>
  <div class="homePageContainer3">
      <!-- 4 tables side by side -->
  <div class="homepagetable1">
     <!-- First Table shows all the meals (Breakfast Lunch Dinner Snacks)  -->
    <table id = "displayCalorieTable">
      <tr>
      <th>Meal</th>
      <th>Calories</th>
    </tr>
    <tr>
      <img src="@/assets/images/MealIcons/Breakfast.png" style='width: 120px;'>
      <td>{{ this.breakfastCal }} CALS</td>
    </tr>
    
    <tr>
      <img src="@/assets/images/MealIcons/Lunch.png" style='width: 120px;'>
      <td>{{ this.lunchCal }} CALS</td>
    </tr>
    
    <tr>
      <img src="@/assets/images/MealIcons/Dinner.png" style='width: 120px;'>
      <td>{{ this.dinnerCal }} CALS</td>
    </tr>
    
    <tr>
      <img src="@/assets/images/MealIcons/Snacks.png" style='width: 120px;'>
      <td>{{ this.snacksCal }} CALS</td>
    </tr>
  
  </table>
  </div>
  
  <div class="homepagetable2">  
    <!-- Second Table Calories burnt  -->
    <table id = "displayCalorieBurntTable">
      <div class = calorieBurntIcon>
        <img src="@/assets/images/HomePageElements/Calories.png" style="width: 100px; height: auto">
        <h2 style="font-weight: bold; font-size: 35px;"> Calories Burnt </h2>
      </div>
      <br><br><br><br><br>
      <h2>{{ this.caloriesBurnt.toFixed(0) }} CAL</h2>
  </table>
  </div>
  
  <div class="homepagetable3">
    <!-- Third Table show net calorie intake  -->
    <table id = "displayNetCalorieTable">
      <div class = netCalorieIcon>
        <img src="@/assets/images/HomePageElements/Streaks.png" style="width: 100px; height: auto">
        <h2 style="color:#FF5712;font-weight: bold; font-size: 35px;"> Net Calorie Intake </h2>
      </div>
      <br><br><br><br><br>
      <h2>{{ this.caloriesNet.toFixed(0) }} CAL</h2>
  </table>
  </div>
  
  <div class="homepagetable4">
    <!-- Fourth Table show progress bar  -->
    <table id = "displayGoalTable">
      <br>
      <div class = "goalIcon">
        <img src="@/assets/images/HomePageElements/Target.png" style="width: 100px; height: auto">
        <h2 style="color:#FF5712;font-weight: bold; font-size: 35px;"> Goal </h2>
      </div>
      <tr>
        <td>
          <ProgressBar v-bind:prog-val="myProgress" v-bind:col-flag="flag" :key="keyValue"/>
        </td>
      </tr>
  </table>
  </div>
  </div>
</template>
  
<script>

import NavigationBar from "@/components/NavigationBar.vue"
import ProgressBar from "@/components/ProgressBar.vue"

import fireBaseApp from "../firebase";
import { getAuth, onAuthStateChanged } from "@firebase/auth";
import { getFirestore, collection, getDoc, getDocs, query, where, updateDoc, doc} from 'firebase/firestore';

export default {
  mounted() {

  },
  created() {
    
    if (this.$route.query.updatedDate) {
      // if this is a past date, update the this.date with the selected past date 
      this.date = this.$route.query.updatedDate;
      // console.log(this.date)
    }
  //update the meal calories and progress bar 
  const breakfastCalPromise = this.updateMealCal('Breakfast');
  const lunchCalPromise = this.updateMealCal('Lunch');
  const dinnerCalPromise = this.updateMealCal('Dinner');
  const snacksCalPromise = this.updateMealCal('Snacks');
  const calBurntPromise = this.updateCalBurnt();
  const calorieGoal = this.calorieGoal();
  if (this.date == new Date().toLocaleDateString().replaceAll("/","-")) {
      // only update streaks if user is on todays homepage
      const streakPromise = this.updateStreaks();
  }

  Promise.all([breakfastCalPromise, lunchCalPromise, dinnerCalPromise, snacksCalPromise, calBurntPromise, calorieGoal])
    .then((values) => {
      const netCalorie = values[0] + values[1] + values[2] + values[3] - values[4];
      this.caloriesNet = netCalorie;
      // console.log("Total calories for Breakfast:", values[0]);
      // console.log("Total calories for Lunch:", values[1]);
      // console.log("Total calories for Dinner:", values[2]);
      // console.log("Total calories for Snacks:", values[3]);
      // console.log("Total calories burnt:", values[4]);
      // console.log("Net calories intake:", netCalorie);
      // console.log("Target Goal Calorie:", values[5]);
      const targetGoal = values[5]
      const progressValue = Math.ceil(netCalorie/targetGoal * 100)
      if (progressValue >= 0){
        this.myProgress = progressValue;
      }
      if (new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-') != this.date) {
        this.flag = false
      }
      this.keyValue += 1
    })
    .catch((error) => {
      console.error("Error updating calories:", error);
    });
  },
  data() {
    return {
      user: null, 
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-'),
      todayDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-'), 
      breakfastCal: 0,
      lunchCal: 0,
      dinnerCal: 0,
      snacksCal: 0,
      caloriesBurnt: 0,
      caloriesNet: 0,
      myProgress: 0,
      flag : true, // true is to highlight that it is todays date and false highlight a past date
      keyValue: 1,
      weight:0
      }; 
  }
  ,
  methods: {
    async updateStreaks() {
      return new Promise(async (resole, reject) => {
        const auth = getAuth();
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            // steps to retrieve from questionnaire
            const userCollection = collection(getFirestore(), "Users");
            const streakQuery = query(
              userCollection,
              where("email", "==", this.useremail),
            );
            const querySnapshotU = await getDocs(streakQuery);
            const userDocument = (querySnapshotU.docs)[0]
            var streakNum = userDocument.data().streakNumber
            var streaksDate = userDocument.data().streaksDate
            var yesterday =new Date(Date.now() - 86400000).toLocaleDateString('en-GB').replace(/\//g, '-');
            console.log(streakNum)
            var newStreak = 0;
            if (streaksDate == new Date().toLocaleDateString().replaceAll("/","-")) {
              newStreak = streakNum;
            }
            const foodCollection = collection(getFirestore(), "Meals");
            const foodQuery = query(
              userCollection,
              where("email", "==", this.useremail),
              where("date", "==", yesterday)
            );
            const querySnapshotF = await getDocs(foodQuery);
            //check the streak date and update by 1 or replace with 0 

            if (querySnapshotU.docs){
              // console.log(streaksDate)
              if (streaksDate == yesterday) {
                //if the streak date is yesterday, means the user ate yesterday
                newStreak = parseInt(streakNum) + 1
                console.log(newStreak)
              }             
            }
            streaksDate = new Date().toLocaleDateString().replaceAll("/","-")
            const changeStreaksUserCollection = doc(collection(getFirestore(), "Users"), this.useremail);
            await updateDoc(changeStreaksUserCollection, {
              streakNumber:newStreak,
              streaksDate:streaksDate,
            }) 
            resole(newStreak);
          } else {
            reject("User not authenticated.");
          }
        }
        )
      })
    },
    async calorieGoal() {
      return new Promise(async (resole, reject) => {
        const auth = getAuth();
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            // steps to retrieve from questionnaire
            const userCollection = collection(getFirestore(), "Users");
            const goalQuery = query(
              userCollection,
              where("email", "==", this.useremail),
            );
            const querySnapshot = await getDocs(goalQuery);
            const userDocument = (querySnapshot.docs)[0]
            const goalIntake = userDocument.data().dailyIntakeGoal
            resole(goalIntake);
          } else {
            reject("User not authenticated.");
          }
        }
        )
      })
    },

    async updateCalBurnt() {
      return new Promise(async (resolve, reject) => {
        var totalCalorieBurnt = 0;
        const auth = getAuth();
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            this.useremail = user.email;
            const queryDate = this.date
            const exercisesCollection = collection(getFirestore(), "Exercises");
            const exerciseQuery = query(
              exercisesCollection,
              where("email", "==", this.useremail),
              where("date", "==", queryDate)
            );
            const querySnapshot = await getDocs(exerciseQuery);
            querySnapshot.forEach((doc) => {
              const docdata = doc.data();
              const dur = docdata.duration;
              const calorie = docdata.numCalories;
              const caloriesBurnt = calorie * dur
              totalCalorieBurnt += caloriesBurnt
              this.caloriesBurnt = totalCalorieBurnt;
            })
            resolve(totalCalorieBurnt);
          } else {
            reject("User not authenticated.");
          }
        })
      });
    },
    async updateMealCal(mealType) {
      return new Promise(async (resolve, reject) => {
        const auth = getAuth();
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            this.useremail = user.email;
            const queryDate = this.date;
            const mealsCollection = collection(getFirestore(), "Meals");
            const mealQuery = query(
              mealsCollection,
              where("email", "==", this.useremail),
              where("date", "==", queryDate),
              where("mealType", "==", mealType)
            );
            const querySnapshot = await getDocs(mealQuery);
            var totalMealCalorie = 0;
            querySnapshot.forEach((doc) => {
              const docdata = doc.data();
              const nCal = docdata.numCalories;
              const nSer = docdata.numServings;
              var totalCal = nCal * nSer;
              totalMealCalorie += totalCal;
            });
            if (mealType === 'Breakfast') {
              this.breakfastCal = totalMealCalorie;
            } else if (mealType === 'Lunch') {
              this.lunchCal = totalMealCalorie;
            } else if (mealType === 'Dinner') {
              this.dinnerCal = totalMealCalorie;
            } else if (mealType === 'Snacks') {
              this.snacksCal = totalMealCalorie;
            }
            resolve(totalMealCalorie);
          } else {
            reject("User not authenticated.");
          }
        });
      });
    },
  },
  name:"HomePage" ,
  components : {
      NavigationBar,
      ProgressBar,
  },
}
</script>

<style scoped>
.goalIcon {
 display: grid;
 align-items: center; 
 justify-content: center;
 grid-template-columns: 0fr 0fr 0fr;
}

.homePageDate h1 {
  font-size: 50px;
}

.homePageDate{
  text-align: center;
}
.calendar {
width: 160px;
height: 120px; 
}

.homePageContainer3{
  margin: auto;
  width: 90%;
  height: 400px;
  background-color:white;
  border-radius: 30px;
  padding: 10px;
}

.homepagetable1,
.homepagetable2,
.homepagetable3,
.homepagetable4 {
float: left;
width: 24.8%;
height: 100%;
/* border: 1px solid black; */
}

.homepagetable1 table {
height: 100%; /* Set the height of the table to 100% */
width: 100%; /* Set the width of the table to 100% */
font-size: 20px;
}
.homepagetable2 table {
height: 100%; /* Set the height of the table to 100% */
width: 100%; /* Set the width of the table to 100% */
}
.homepagetable3 table {
height: 100%; /* Set the height of the table to 100% */
width: 100%; /* Set the width of the table to 100% */
}
.homepagetable4 table {
height: 100%; /* Set the height of the table to 100% */
width: 100%; /* Set the width of the table to 100% */
}

</style>


