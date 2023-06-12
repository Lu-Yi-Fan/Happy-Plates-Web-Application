<template> 
  <div>
    <NavigationBar/>
    <div class="calendar-wrapper">
      <FullCalendar class="calendar-container"/>
    </div>
  </div>
</template>
  
<script>
import NavigationBar from "@/components/NavigationBar.vue";
import FullCalendar from "@/components/FullCalendar.vue";

export default {
  name: "CalendarPage",
  components: {
    NavigationBar,
    FullCalendar,
  }
};
</script>

<style>
.calendar-wrapper {
display: flex;
justify-content: center;
margin: 40px auto 0 auto;
width: 100%;
}

.calendar-container {
width: 60%;
height: 50%;
background-color: white;
}

.fc-daygrid-day-number, .fc-col-header-cell-cushion {
  color: rgb(19, 3, 53);
  text-decoration: none;
}
</style>