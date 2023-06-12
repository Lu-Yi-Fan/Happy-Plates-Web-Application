<template>
  <NavigationBar/>
  <div class="maincontainer">
    <div class="picandbutton">
      <div class="profilepic">
      <!-- rng some pic later -->
        <img class="pic" src="@/assets/images/Profile/tempDP.png" alt="profile picture" style="width: 100px; height: 120px">
      </div>
      <button v-on:click="goToEditProfilePage" class="editprofile">Edit Profile</button>
    </div>
  
    <div class="details">
      <div class="usernamegender">
        <span class="username" style="font-size: 28px; font-weight: 500;">{{ this.username }}</span>
        <img v-if="this.gender === 'Female'" class="gender" src="@/assets/images/Profile/Female.png" alt="Female" style="width: 30px; height: 40px">
        <img v-else class="gender" src="@/assets/images/Profile/Male.png" alt="Male" style="width: 30px; height: 40px">
      </div>
        <div class="heightweight">
          <div class="hwdeets">
            <span class="height">
              <span class="heightnum" style="font-size: 20px; font-weight: 800;">Height</span>
              <span style="font-size: 20px; font-weight: 700; color:  grey;">{{ this.height }} cm</span>
            </span>
            <span class="weight">
              <span class="weightnum" style="font-size: 20px; font-weight: 800;">Weight</span>
              <span style="font-size: 20px; font-weight: 700; color:  grey;">{{ this.weight }} kg</span>
            </span>
          </div>
        </div>
        <div class="activity">
          <h4 style="font-size: 20px; font-weight: 800;">Daily Intake Goal</h4>
          <h4 style="font-size: 20px; font-weight: 700; color:  grey;">{{ this.calories}} Calories</h4>
          <h4 style="font-size: 20px; font-weight: 800;">Activity Level</h4>
          <h4 style="font-size: 20px; font-weight: 700; color:  grey;">{{ this.activity }}</h4>
        </div>
        <div class="program">
          <h4 style="font-size: 20px; font-weight: 800;">Program</h4>
          <h4 style="font-size: 20px; font-weight: 700; color:  grey;">{{ this.program }}</h4>
          <h4 style="font-size: 20px; font-weight: 800;">Start Date</h4>
          <h4 style="font-size: 20px; font-weight: 700; color: grey;">{{ this.startdate }}</h4>
        </div>
    </div>
  </div>
</template>

<script>
import NavigationBar from "@/components/NavigationBar.vue"
import { getAuth, onAuthStateChanged } from "@firebase/auth";
import { getFirestore, collection, getDoc, getDocs, query, where, doc} from 'firebase/firestore';

export default {
    name:"ProfilePage" ,
    components : {
        NavigationBar,
    },
    data() {
      return {
        username: "",
        gender: "",
        height:0,
        weight:0,
        calories: 0,
        activity: "xxx",
        program: "xxx",
        startdate: "xx"
      }
    },
    created() {
      this.renderProfile();
    },
    methods : {
      async renderProfile() {
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
            this.username = userDocument.data().userName;
            this.gender = userDocument.data().gender;
            this.height = userDocument.data().height;
            this.weight = userDocument.data().weight;
            this.calories = userDocument.data().dailyIntakeGoal;
            this.activity = userDocument.data().exercise;
            this.program = userDocument.data().goal;
            this.startdate = userDocument.data().startDate;
            //userDocument.data().dailyIntakeGoal
            resolve(0);
          } else {
            reject("User not authenticated.");
          }
        }
        )
      })
    },
      goToEditProfilePage() {
        this.$router.push("/EditProfilePage");
      }
    }
}
</script>

<style>
.maincontainer {
  margin-top: 10vh;
  display: flex;
  justify-content: center;
}

.profilepic {
  background-color: white;
  border-radius: 30px;
  height: 140px;
  width: 140px;
  margin-left: 17px;
}

.picandbutton {
  display: inline-block;
  flex-direction: column;
  margin-right: 5vh;
}

.editprofile {
  background-color: #fff6f6; 
  border-radius: 10px; 
  border: 2px solid black; 
  padding: 10px 50px; 
  color: black;
  margin-top: 2vh;
}

.details {
  display: inline-block;
  flex-direction: column;
  /* margin-top: 200px; */
}

.usernamegender {
  display: flex;
}

.gender {
  flex-grow: 0;
  margin-left: 2vw;
}

.username {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  margin-bottom: 2vh;
}

.weight {
  margin-left: 100px;
}

.heightnum, .weightnum {
  margin-right: 30px;
}

.hwdeets {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
}

.heightweight, .activity, .program {
  background-color: #e4dede; /* set the background color to grey */
  padding: 25px;
  border-radius: 30px;
  width: 40vw;
}

.activity {
  margin-bottom: 2vh;
  margin-top: 2vh;
}

.activity h4, .program h4 {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
}
</style>