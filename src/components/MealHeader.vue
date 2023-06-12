<template>
  <div class="meal-header">
    <img class="images" :src="mealSource" width="80" height="60">

    <p> {{ meal }} - {{ calories }} Calories</p>
    <img class="images" :src="mealSource" width="80" height="60">

  </div>
</template>

<script>
import Breakfast from "@/assets/images/MealIcons/Breakfast.png";
import Lunch from "@/assets/images/MealIcons/Lunch.png";
import Dinner from "@/assets/images/MealIcons/Dinner.png";
import Snacks from "@/assets/images/MealIcons/Snacks.png";


export default {
  props: {
    calories: Number,
    meal: String, 
  }, 
  computed: {
    mealSource() {
      switch(this.meal) {
        case "Breakfast":
          return Breakfast;
        case "Lunch":
          return Lunch;
        case "Dinner":
          return Dinner;
        case "Snacks":
          return Snacks;
        default: 
          return null;
      }

    }
  }
}
</script>

<style scoped>
.meal-header {
  background-color:  rgb(135, 187, 255);;
  font-size: 25px;
  max-width: 95%;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  display: flex;
  margin-bottom: 25px;
  box-shadow: 2px px 6px rgba(121, 124, 126, 0.3);
  margin-top: 3vh;

}

.images {
  margin: 0 5px;
}
</style>