<template>
  <div>
    <NavigationBar/>
  
    <div class="save">
      <button class="addButton"  v-on:click="addNewExer">
        <div class="button-content">
        <img class="plusimage" src="@/assets/images/greenadd.png"  id="saveButton" >
        <span class="button-text"> Add New Exercise</span>
        </div>
        </button>
        <br><br>
    </div>
    <p class="exercise-header">Exercise - {{ cal.toFixed(1) }} calories burnt</p>
    <ExerCard :exercise="exercise" v-for="(exercise, index) in exerciseData" :key="index" @delete="deleteExerHandler" @edit="editExerHandler"/>
  </div>

</template>

<script>

import NavigationBar from "@/components/NavigationBar.vue";
import ExerCard from "@/components/ExerCard.vue";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import { getFirestore, collection, getDoc, getDocs, query, where, doc, deleteDoc, onSnapshot} from 'firebase/firestore';
let currEmail=  "";

export default {
    name:"ExerciseLog" ,
    data() {
      return {
      exerciseData: [],
      exerName: null, 
      numCalories: null, 
      duration: 0,
      cal: 0,
      };
    },
  
    components : {
        NavigationBar,
        ExerCard,
    },

    created() {
      this.exerciseData = [];
      this.retrieveExer();
    },

    methods: {

      async editExerHandler(exercise) {
        console.log("hihi", exercise);
        if (confirm("Are you sure you want to edit this exercise?")) {
          const auth = getAuth();
          let userEmail;
          let weight;

          const user = await new Promise((resolve, reject) => {
            onAuthStateChanged(auth, (user) => {
              if (user) {
                resolve(user);
              } else {
                reject(new Error("User not found"));
              }
            });
          });

          userEmail = user.email;
          const userRef = collection(getFirestore(), "Users");
          const q = query(userRef, where("email", "==", userEmail));
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            weight = doc.data().weight;
          });

          const exerOrder = ['date', 'duration', 'email', 'exerName', 'numCalories'];
          const exerList = exerOrder.map((key) => {
            if (key === 'numCalories') {
              return exercise[key] / weight;
            } else {
              return exercise[key];
            }
          });
          this.$router.push({path: "/EditExerPage", query: { exerProp: exerList }});
        }
      },

      
      async deleteExerHandler(exercise) {
        if (confirm("Are you sure you want to delete this exercise?")) {
          const auth = getAuth();
          let userEmail;
          // console.log(exercise.date);
          // console.log(exercise.email);
          // console.log(exercise.duration);
          // console.log(exercise.exerName);
          // console.log(exercise.numCalories);
          onAuthStateChanged(auth, async (user) => {
            if (user) {
              userEmail = user.email;
              const exersRef = collection(getFirestore(), "Exercises");
              const q = query(exersRef, where("date", "==", exercise.date), where("email", "==", exercise.email), where("duration", "==", exercise.duration), 
              where("exerName", "==", exercise.exerName) , where("numCalories", "==", exercise.numCalories));
              const querySnapshot = await getDocs(q);
              querySnapshot.forEach((doc) => {
                deleteDoc(doc.ref);
              });
              alert("Exercise Successfully Deleted")
              const index = this.exerciseData.indexOf(exercise);
              if (index !== -1) {
                this.exerciseData.splice(index, 1);
                this.totalCalories();
              }
            }
          });
        }
      },
      
      addNewExer() {
        this.$router.push('/AddExerPage');
      },

     totalCalories() {
        let total = 0;
          length = this.exerciseData.length;
          for (let i = 0; i < length; i++) {
            let cal = this.exerciseData[i].numCalories ;
            let dur = this.exerciseData[i].duration;
            total += cal * dur;
          }
          this.cal = total;
     },


      async retrieveExer() {
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
            const exerRef = collection(getFirestore(), "Exercises");
            console.log(exerRef);
            const q = query(exerRef, where("email", "==", userEmail), where("date","==", today));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
              this.exerciseData.push(doc.data());
            });
          }
          // get the total calories
          this.totalCalories();
        });
      },
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

.exercise-header {
  background-color:  rgb(135, 187, 255);;
  font-size: 25px;
  max-width: 95%;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  display: flex;
  margin-bottom: 25px;
  box-shadow: 2px px 6px rgba(121, 124, 126, 0.3);
  margin-top: 10px;
  margin-top: 3vh;
}

</style>