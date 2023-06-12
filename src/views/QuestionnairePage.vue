<template>
    <div id="header">
      <router-link to="/"> <img src="@/assets/images/HomePageElements/Home.png" alt="Home" style="width:42px;height:42px;"></router-link>
      <div id="title">
        <h1>QUESTIONNAIRE</h1>
        <p id="reminder"><i>Questions marked with <span style="color: red;">*</span> are compulsory</i></p>
      </div>
  
      <img src="@/assets/images/CommonElements/HappyPlatesLogo.png" alt= "Logo" style="width:250px; height: auto;float: right;">
    </div>
  
    <div id="form">
      <form @submit.prevent="submitForm">
        <label for="height">What is your height in cm? <span style="color: red;">*</span></label>
        <input type="number" id="height" v-model="height" placeholder="Enter your height" required><br><br>
  
        <label for="weight">What is your weight in kg? <span style="color: red;">*</span></label>
        <input type="number" id="weight" v-model="weight" placeholder="Enter your weight" required><br><br>
  
        <label for="exercise">How much exercise do you get per week? <span style="color: red;">*</span></label>
        <select id="exercise" name="exercise" v-model="exercise" required>
          <option value="Less than 2 hrs">Less than 2 hrs</option>
          <option value="2-5 hrs">2 - 5 hrs</option>
          <option value="5-10 hrs">5 - 10 hrs</option>
          <option value="More than 10 hrs">More than 10 hrs</option>
        </select><br><br>
  
        <label for="goal">What is your goal? <span style="color: red;">*</span></label>
        <select id="goal" name="goal" v-model="goal" required>
          <option value="Weight Loss">Weight Loss</option>
          <option value="Maintain Weight">Maintain Weight</option>
          <option value="Weight Gain">Weight Gain</option>
        </select>
        <div id = 'calculatedValueContainer'>
          <label for="calculatedValue">Recommended Calorie Intake Calculator <span style="color: blue;">*</span></label>
        <input type="number" id="calculatedValue" v-model="calculatedValue" readonly>
        </div>
        <br>

        <label for="dailyIntakeGoal">What is your daily calorie intake goal? </label>
        <input type="number" id="dailyIntakeGoal" v-model="dailyIntakeGoal" placeholder="Enter your calorie intake"><br><br>
  
        <button type="submit">SAVE</button>
      </form>
    </div>
  </template>
  
  <script>
  import fireBaseApp from "../firebase.js";
  import {getAuth } from "firebase/auth";
  import { doc, updateDoc, getFirestore} from "firebase/firestore";
  import { collection } from 'firebase/firestore'

  
  export default {
    name: "QuestionnairePage.vue",
    props: {
      msg: String
    },
    data() {
      return {
        height:null,
        weight: null,
        exercise:null,
        goal:null,
        dailyIntakeGoal:0,
      }
    },
    computed: {
      email() {
        return this.$route.query.email || ''
      },
      // function to return the value of the recommended target calorie intake 
      calculatedValue() {
        if (this.weight && this.goal) {
          var exerciseAdd = 0;
          if (this.exercise) {
            if (this.exercise == "Less than 2 hrs") {
              exerciseAdd = 50
            } else if (this.exercise == "2-5 hrs") {
              exerciseAdd = 100
            } else if (this.exercise == "5-10 hrs") {
              exerciseAdd = 150
            } else {
              exerciseAdd = 200
            }
          }
          var calGoal = 0;
          if (this.goal === "Weight Loss") {
            calGoal = (this.weight * 2.20 * 10)
            if (this.exercise){
              return (calGoal + exerciseAdd).toFixed(0);
            }else{
              return calGoal.toFixed(0);
            }
          } else if (this.goal === "Maintain Weight") {
            calGoal = (this.weight * 2.20 * 14)
            if (this.exercise){
              return (calGoal + exerciseAdd).toFixed(0);
            }else{
              return calGoal.toFixed(0);
            }
          } else {
            calGoal = (this.weight * 2.20 * 17)
            if (this.exercise){
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
    methods:{
      async submitForm(){
        const email = this.email;
        const userCollection = doc(collection(getFirestore(), "Users"), email);
        
        // update more details collected from the user 
        await updateDoc(userCollection, {
          height:this.height,
          weight:this.weight,
          exercise:this.exercise,
          goal:this.goal,
          dailyIntakeGoal:this.dailyIntakeGoal,
          startDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-'),
          streaksDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-'),
          streakNumber: 0
        })
            .then(() => {
              console.log('Document updated successfully');
            })
            .catch((error) => {
              console.error('Error updating document: ', error);
            });

        alert("Save successfully!")

        this.$router.push('/LoginPage');
        }
    }
  }

  </script>
  
  <style scoped>
  #header{
    display:flex;
    justify-content: space-between;
    height: fit-content;
    padding-left: 1%;
    float: top;
  
  }
  #title{
    margin-left: 150px;
  }
  #reminder{
    text-align: center;
    color: darkgrey;
    font-size: 17px;
  }
  #form{
    display: flex;
    justify-content: center;
    margin-top: 20px;
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
  #height, #weight,#exercise,#goal,#dailyIntakeGoal{
    border-radius: 10px;
    font-size: 16px;
    padding: 10px;
    width: 300px;
    background-color: #e9e9e9;
  }
  label{
    display: block;
    font-size: 18px;
    text-align: left;
    margin-bottom: 5px;
  }
  button{
    display: block;
    background-color: #9eff6a;
    border: #dddddd;
    color: #333333;
    text-align: center;
    font-size: 17px;
    padding: 13px 28px;
    margin: 10px 2px;
    border-radius: 30px;
    transition-duration: 0.3s;
    justify-content: center;
    margin-left: 11vh;
  }
  button:hover{
    box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);
    border-radius: 2px;
  }
  #calculatedValueContainer {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
  }
  #calculatedValue {
  background-color: transparent;
  border: none;
  box-shadow: none;
  width: fit-content;
  height: 25px;
}


  </style>