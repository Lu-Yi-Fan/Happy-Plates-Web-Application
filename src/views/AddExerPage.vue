<template>
  <div>
    <NavigationBar/>
  </div>
  <div id="exer">
  <TabNav :tabs="['Add Exercise']" :selected="selected" @selected="setSelected">
    <Tab :isSelected="selected === 'Add Exercise'">
  <div class="QuickAdd">
  <img class="images" src="@/assets/images/exer.png" width="100" height="120">
  <h1 class="quickaddtitle">Add Exercise</h1>
</div>
<div class="centered">
    <form @submit.prevent="saveExer" class="newExer"> 
      <label class="exerNameLabels" for="exerName">EXERCISE NAME: {{ exerName.exerName }}   </label>

      <select class="formfields" for="exerName" id="exerName" v-model="exerName" >
        <option v-for="exer in exerNames" :value="exer">{{ exer.exerName }}</option>
      </select>
      <br>

      <div class="numCaloriesDiv" v-if="exerName">
        <p> NUMBER OF CALORIES / HR: {{ (exerName.numCalories * this.weight).toFixed(1) }} Calories</p>
      </div>
      <div v-else class="numCaloriesDiv">
        NUMBER OF CALORIES / HR: 0
      </div>
      <br>
      <label class="durationLabel" for="duration">DURATION (in hrs): {{ duration }}</label>
      <select class="formfields"  v-model="duration">
        <option>0.5</option>
        <option>1</option>
        <option>1.5</option>
        <option>2</option>
        <option>2.5</option>
        <option>3</option>
      </select>
      <!-- Save Button -->
      <button class="buttonSaveExer" id="saveExer" type="submit" >Save</button><br><br>

    </form>
  </div>
    </Tab>


  </TabNav>
  </div>
</template>

<script>
import NavigationBar from "@/components/NavigationBar.vue"
import { doc, setDoc, addDoc, getFirestore, collection, query, where, getDocs, updateDoc} from "firebase/firestore"; 
import { getAuth, onAuthStateChanged} from "firebase/auth";
import { onMounted } from 'vue';
import Tab from "@/components/Tab.vue";
import TabNav from "@/components/TabNav.vue";
import MealHeader from '@/components/MealHeader.vue';
import axios from 'axios';
import Papa from 'papaparse';


let currEmail=  "";

export default {
    name:"AddExerPage" ,
    data() {
      return {
        selected: "Add Exercise",
        exerName: "", 
        mealType: null,
        duration: null,
        numCalories: null, 
        showForm: false,
        haveCustomExer: false,
        customExerData: [],
        exerNames: [], 
        weight: 0,
      };
    },
    components : {
        NavigationBar,
        Tab,
        TabNav,
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
    // function to retrieve the exercises from the exercise database (csv)
    async displayExer(){
      const url = 'https://raw.githubusercontent.com/Lu-Yi-Fan/Testing/main/exer.csv';
      await fetch(url)
      .then((response) => {
        return response.text();
      })
      .then((csvText) => {
        // Process the CSV data
        // console.log(csvText);
        // Here, you can parse the CSV data as needed
        // For example, you can use a library like Papa Parse to parse the CSV data into an array
        const csvData = Papa.parse(csvText)
        // console.log(csvData);
        let exerNames = csvData.data.map(exer => {
          return {
            exerName: exer[0],
            numCalories: exer[5],
          };
        });
        this.exerNames = exerNames;

      })
      .catch((error) => {
        // Handle any errors
      });
    },
    setSelected(tab)  {
      this.selected = tab;
    },

    addCustomExerButton() {
      this.showForm = true;
    },
    // function to save the exercises using the detailed keyed in from the user 
    // this exercise will then be added to the exercise collection in firebase and will be reflected on the exercise log page 
    async saveExer(){

      const auth = getAuth();
      const user =  auth.currentUser.email;
      // console.log("email", user);
      // console.log(currEmail);


      let exerData = {
        exerName: this.exerName.exerName,
        duration: this.duration.value,
        numCalories: this.exerName.numCalories

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

      const exerRef = collection(getFirestore(), "Exercises");

      const q = query(exerRef, where("email", "==", user), where("date","==", date), where("exerName", "==", this.exerName.exerName));
      const querySnapshot = await getDocs(q);
      // console.log(querySnapshot);
      if (querySnapshot.size === 1) {
        // get the mealId
        const docId = querySnapshot.docs[0].id;
        const exerData = querySnapshot.docs[0].data();
        const updatedDuration = parseInt(exerData.duration) + parseInt(this.duration);
        // console.log(updatedDuration)
        const exerCollection = doc(collection(getFirestore(), "Exercises"), docId);
        await updateDoc(exerCollection, {
          duration: updatedDuration
        })
      } else {
        const newDocRef = doc(collection(getFirestore(), "Exercises"));
            await setDoc(newDocRef, {
              email: currEmail,
              date: date,
              exerName: this.exerName.exerName, 
              duration: this.duration,
              numCalories: (this.exerName.numCalories * this.weight).toFixed(1),
        });

      }
      alert("Added Exercise Successfully")

      // console.log(date);
      this.$router.push('/ExerciseLogPage');

    
    },

    // function to get the current user's weight 
    async getUserWeight() {
        const auth = getAuth();
        let userEmail;
        onAuthStateChanged(auth, async (user) => {
          // console.log("Auth state changed:", user);
          if (user) {
            userEmail = user.email;
            // console.log("Current user email:", userEmail);
            // console.log(today);
            const userRef = collection(getFirestore(), "Users");
            const q = query(userRef, where("email", "==", userEmail));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
              this.weight = doc.data().weight;
              // console.log(this.weight);
            });
          }
        });
      }
    },
  created() {
      this.exerData = [];
      this.getUserWeight();
      this.displayExer();
    }
}



</script>

<style scoped>

.buttonSaveExer{
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
  margin-left: -160vh;
}


.buttonSaveExer:hover {
    box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);
    border-radius: 2px;
}
#addCustomExer {
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
display: flex;
justify-content: center;

}

.formfields {
text-align: center;
border-radius: 10px;
width:30vh;
height: 30px;
margin-left:-15vh;
}

input:hover {
  border-radius: 1px;
  transition: 0.2s ease in;
}

h1 {
margin-top: 60px;
padding-top: 70px;
}



.centered {
  position: relative;
  top: 25%;
  left: 50%;
  margin-top:2vh;
}

.quickaddtitle {
  margin-top: -30px;
  
}

.customexertitle {
  margin-top: -30px;
}

.exerNameLabels, .numCaloriesDiv, .durationLabel {
  display: flex;
  justify-content: center;
  text-align: center;
  padding-right: 20vh;
  margin-left: -140vh;

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
#exer {
justify-content: center;
display: flex;
flex-direction: row;
padding-top: 30px;

}

.noCustomExer{
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