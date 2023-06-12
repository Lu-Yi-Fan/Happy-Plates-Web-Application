<template>
  <div class="card-wrapper">
    <div class="FoodName">
      <span>{{ food.foodName }}</span>
    </div>
    <div class="NumServings" v-if="food.numServings > 1">
      <span>{{ food.numServings }} Servings</span>
    </div>
    <div class="NumServings" v-else>
      <span>{{ food.numServings }} Serving</span>
    </div>
    <div class="card-right">
      <span>{{ food.numCalories }} Calories / Serving</span>
      <div class="icons">
        <img @click.stop="showEditButtons = true" class="icon" src="@/assets/images/threedots.png" width="30" height="30"/>
        <Edit class="editButtons" v-if="showEditButtons == true" @close="showEditButtons = false" @deleteFood="deleteFoodHandler" @editFood="editFoodHandler" :food="food" />
      </div>
    </div>
  </div>
</template>

<script>
import Edit from "@/components/Edit.vue";

export default {

  methods: {
    deleteFoodHandler(food) {
      this.$emit("delete", food);
    },

    editFoodHandler(food) {
      console.log("foodcard.vue edit emits", food);
      this.$emit("edit", food);
    },
},

  name: "FoodCard",
  props: ["food"],
  components: {
    Edit,
  },

  data() {
    return {
      showEditButtons: false,
    };
  },
};
</script>





<style scoped > 

.card-wrapper {
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

}

.FoodName {
  font-size: 20px;
  display: flex;
  align-items: center;
  margin-left: 50px;
  font-weight: bold;
}

.NumServings {
  display: flex;
  align-items: center;
  margin-left: 40px;
  font-size: 15px;
}

.card-right {
  font-size: 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-left: auto;
  margin-right: 70px;
}

.icons{
    display: flex;
    justify-items: flex-end;
    margin-top: -45px;
    margin-right: -15px;
    margin-bottom: 20px;

}

.editButtons {
    margin-top: -150px;
    margin-left:-70px;
    position: absolute;
}

.icon{
    margin-right: 10px;
    margin-left: 10px;
}




</style>