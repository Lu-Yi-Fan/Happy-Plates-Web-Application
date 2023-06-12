<template>
  <div>
    <NavigationBar/>
  </div>
  <div>
    <br>
    <br>
    <div>
      <h2 style="color:black;font-weight: bold; font-size: 55px;"> Dashboard </h2>
    </div>
  </div>
  <div class = "dashBoardButtons">
    <!-- display weekly chart of user once button pressed -->
    <button class="weekly-button" @click="displayWeeklyCharts()">Weekly Charts</button> 
    <!-- display popular meals of user once button pressed -->
    <button class="popular-meals-button" @click="displayPopularFoods()"> Popular Meals </button>
  </div>
  <br>

  <div class="dashBoardContainer">
    <div class = streaksLogin style="padding-top: 90px;"  v-if="streaks >= 0" id="streaksDiv">
      <img src="@/assets/images/HomePageElements/Streaks.png" style="width: 250px; height: auto">
      <h2 style="font-weight: bold; font-size: 65px; padding-right: 90px;"> {{this.streaks}} DAY STREAK </h2>
    </div>
  </div>
</template>

<script>
import NavigationBar from "@/components/NavigationBar.vue"
import { getAuth, onAuthStateChanged } from "@firebase/auth";
import { getFirestore, collection, getDoc, getDocs, query, where, doc} from 'firebase/firestore';
export default {
    name:"DashboardPage" ,
    components : {
        NavigationBar,
    },
    data() {
      return {
        streaks:0
      }
    },
    created() {
      this.streakUpdate()
    },
    
    async mounted() {
      
    },
    methods: {
      async streakUpdate() {
      return new Promise(async (resolve, reject) => {
        const auth = getAuth();
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            this.useremail = user.email;
            // steps to retrieve from questionnaire
            const userCollection = collection(getFirestore(), "Users");
            const profileQuery = query(
              userCollection,
              where("email", "==", this.useremail),
            );
            const querySnapshot = await getDocs(profileQuery);
            const userDocument = (querySnapshot.docs)[0]
            this.streaks = userDocument.data().streakNumber;

            resolve(0);
          } else {
            reject("User not authenticated.");
          }
        }
        )
      })
    },
    async displayWeeklyCharts() {
        const auth = getAuth();
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            this.user = user
            this.useremail = user.email;
            let divStreaks = document.getElementById("streaksDiv")
            divStreaks.innerHTML =""  
            const canvas = document.createElement("canvas");
            canvas.setAttribute("id", "myChartCanvas");
            divStreaks.appendChild(canvas);
            const divWidth = divStreaks.offsetWidth;
            const divHeight = divStreaks.offsetHeight;
            canvas.width = divWidth;
            canvas.height = divHeight;  

            const today = new Date();
            const pastDays = [];

            for (let i = 0; i < 7; i++) {
              const pastDate = new Date(today);
              pastDate.setDate(today.getDate() - i);
              pastDays.push(pastDate);
            }
            var formattedDates = pastDays.map(date => {
              const day = ("0" + date.getDate()).slice(-2);
              const month = ("0" + (date.getMonth() + 1)).slice(-2);
              const year = date.getFullYear();
              return `${day}-${month}-${year}`;
            });
            formattedDates.reverse();
            let xValues = formattedDates
            console.log(formattedDates)

            const userCollection = collection(getFirestore(), "Users");
            const goalQuery = query(
              userCollection,
              where("email", "==", this.useremail),
            );
            const querySnapshot = await getDocs(goalQuery);
            const userDocument = (querySnapshot.docs)[0]
            const goalIntake = userDocument.data().dailyIntakeGoal
            const goalCalorie = [];

            for (let i = 0; i < formattedDates.length; i++) {
              goalCalorie.push(goalIntake);
            }

            let dayData = []
            for (let x = 0; x < formattedDates.length; x++){
              let queryDate = formattedDates[x]
              const mealsCollection = collection(getFirestore(), "Meals");
              const mealQuery = query(
                mealsCollection,
                where("email", "==", this.useremail),
                where("date", "==", queryDate),
              );
              const querySnapshotMeals = await getDocs(mealQuery);
              var totalMealCalorie = 0;
              querySnapshotMeals.forEach((doc) => {
                const docdata = doc.data();
                const nCal = docdata.numCalories;
                const nSer = docdata.numServings;
                var totalCal = nCal * nSer;
                totalMealCalorie += totalCal;
              })

              const exercisesCollection= collection(getFirestore(), "Exercises");
              const exerciseQuery = query(
                exercisesCollection,
                where("email", "==", this.useremail),
                where("date", "==", queryDate),
              );
              const querySnapshotExercise = await getDocs(exerciseQuery);
              var totalCalBurnt = 0;
              querySnapshotExercise.forEach((doc) => {
                const docdata = doc.data();
                const nCal = docdata.numCalories;
                const nHr = docdata.duration;
                var totalCal = nHr * nCal;
                totalCalBurnt += totalCal;
              })
              console.log(queryDate)
              console.log("Calorie intake: ", totalMealCalorie)
              console.log("Calorie burnt: ",totalCalBurnt)
              const netCalorie = totalMealCalorie - totalCalBurnt
              console.log("Net Calorie: ",netCalorie)
              dayData.push(netCalorie)
            }
            console.log(dayData)

            const myChart = new Chart("myChartCanvas", {
              type: "line",
              data: {
                labels: xValues,
                datasets: [{
                  label:"Net Calorie Intake",
                  data: dayData,
                  borderColor: "red",
                  fill: false
                },{
                  label:"Calorie Goal",
                  data: goalCalorie,
                  borderColor: "green",
                  fill: false
                }]
              },
              options: {},
            });
          }
        })
      },
      async displayPopularFoods() {
        return new Promise(async (resole, reject) => {
        const auth = getAuth();
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            this.user = user
            this.useremail = user.email;

            let divStreaks = document.getElementById("streaksDiv")
            divStreaks.innerHTML =""

            let monthName = new Date().toLocaleString('en-us',{month: 'long'})
            alert("Popular Meals in " + monthName)
            // display a table
            divStreaks.style.paddingTop = "40px"
            let table = document.createElement("table")
            table.setAttribute("id", "table")
            table.setAttribute("class", "auto-index")
            table.setAttribute("style", "border-collapse: collapse; width: 90%; height: auto")

            // add header row
            let headerRow = table.insertRow()
            let headers = ["Food", "Calories/Serving","Frequency/Month"]
            for (let i = 0; i < headers.length; i++) {
                let headerCell = headerRow.insertCell(i)
                headerCell.innerHTML = headers[i]
                headerCell.setAttribute("style", "background-color: #4CAF50; color: white; font-weight: bold; padding: 10px; text-align: center; border: 1px solid #ddd;")
            }

            // get data for this month
            let today = new Date();
            let year = today.getFullYear();
            let month = today.getMonth() + 1;
            let daysInMonth = new Date(year, month, 0).getDate();
            var queryDates = []
            for (let day = 1; day <= daysInMonth; day++) {
              let formattedDate = `${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${year}`;
              queryDates.push(formattedDate)
            }

            const mealsCollection = collection(getFirestore(), "Meals");
            const mealQuery = query(
              mealsCollection,
              where("email", "==", this.useremail),
            );
            const querySnapshot = await getDocs(mealQuery);
            let calorieMap = {}
            let foodMap = {}; // counts
            querySnapshot.forEach((doc) => {
              const docdata = doc.data();
              if (queryDates.includes(docdata.date)){
                const foodName = docdata.foodName;
                const calorieCount = docdata.numCalories
                if (foodMap.hasOwnProperty(foodName)) {
                  foodMap[foodName]++;
                } else {
                  foodMap[foodName] = 1;
                }
                if (calorieMap.hasOwnProperty(foodName)) {
                } else {
                  calorieMap[foodName] = calorieCount
                }
              }
            });
            const sortedFoods = Object.fromEntries(
              Object.entries(foodMap).sort((a, b) => b[1] - a[1])
            );
            const topFoods = Object.entries(sortedFoods).slice(0, 4).map(([food, freq,]) => ({ food, freq }));
            for (let i = 0; i < topFoods.length; i++) {
              topFoods[i].calorie = calorieMap[topFoods[i]["food"]];
            }
            const dataRows = topFoods.map(item => [item.food, item.calorie, item.freq]);
            console.log(dataRows)
            for (let i = 0; i < dataRows.length; i++) {
                let row = table.insertRow()
                for (let j = 0; j < dataRows[i].length; j++) {
                    let cell = row.insertCell(j)
                    cell.innerHTML = dataRows[i][j]
                    cell.setAttribute("style", "padding: 10px; text-align: center; border: 1px solid #ddd;")
                }
            }
            // append table to HTML element
            divStreaks.appendChild(table)
          } else {
            reject("User not authenticated.");
          }
        })
      })
    },
  }
}
</script>


<style scoped>

.streaksLogin {
 display: flex;
 align-items: center; 
 justify-content: center;
 grid-template-columns: 0fr 0fr 0fr;
 text-align: center;
}
.dashBoardButtons {
  display: flex;
  justify-content: space-between;
  padding-left: 150px; 
  padding-right: 150px;
}
.dashBoardButtons button:hover {
  text-decoration: underline;
  cursor: pointer;
}
.dashBoardButtons button {
  transition: background-color 0.3s ease, color 0.3s ease;
}

.dashBoardButtons button {
  display: inline-block;
  background-color: #ffffff;
  border: 2px solid #000000;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 16px;
  color: #000000;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
}

.dashBoardContainer{
  margin: auto;
  width: 90%;
  height: 400px;
  background-color:white;
  border-radius: 30px;
  padding: 10px;
}

</style>