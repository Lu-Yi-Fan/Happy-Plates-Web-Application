<template>
    <div class="card-wrapper">
        <div class="exerName">
            <span>{{ exercise.exerName }}</span>
        </div>
        <div class="duration">
            <span>Duration: {{ exercise.duration }} hrs</span>
        </div>
        <div class="class-right">
            <span >{{ exercise.numCalories }} Calories / hr </span>
            <div class="icons">
              <img @click.stop="showEditButtons = true" class="icon" src="@/assets/images/threedots.png" width="30" height="30"/>
              <Edit class="editButtons" v-if="showEditButtons == true" @close="showEditButtons = false" @deleteExer="deleteExerHandler" @editExer="editExerHandler" :exercise="exercise" />
            </div>
        </div>
    </div>
</template> 

<script>

import Edit from "@/components/Edit.vue";
export default {
    name: "ExerCard",
    props: ["exercise"],

    components: {
    Edit,
  },

  methods: {
    deleteExerHandler(exercise) {
      console.log("exercard delete emits", exercise);
      this.$emit("delete", exercise);
    },

    editExerHandler(exercise) {
      console.log("exercard edit emits", exercise);
      this.$emit("edit", exercise);
    },
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  color: black;
  border-radius: 50px;
  background-color: #F0FFF0;
  margin-left: 5%;
  margin-right: 5%;
  box-shadow: 2px 2px 6px rgba(154, 244, 154, 0.3);
  height: 120px;
}

.exerName {
  font-size: 20px;
  display: flex;
  align-items: center;
  margin-left: 50px;
  font-weight: bold;
}
.duration {
  display: flex;
  align-items: center;
  margin-left: 40px;
  font-size: 15px;
}

.class-right {
  font-size: 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-left: auto;
  margin-right: 60px;
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