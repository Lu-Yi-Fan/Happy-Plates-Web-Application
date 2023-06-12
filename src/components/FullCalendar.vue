<template>
  <div class="calendarComponent">
    <FullCalendar 
      ref="calendar"
      :options="calendarOptions"/><br>
      <button v-on:click="logSelectedDate">Enter</button>
  </div>
</template>
<script>
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

export default {
  components: {
    FullCalendar 
  },
  data() {
    return {
      calendarOptions: {
        plugins: [dayGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        weekends: true,
        select: this.handleDateSelect,
        headerToolbar: {
          left: '',
          center: 'title',
          right: 'prev,next',
        },
        selectable: true,
      },
      selectedDate: null,
    }
  },
  methods: {
    handleDateSelect(info) {
      let dateSelected = info.startStr
      this.selectedDate = dateSelected
    },
    logSelectedDate() {
      this.date = this.selectedDate;
      if (this.date && this.selectedDate) {
        //emit an event with the selected date as a parameter
        // this.$emit('date-selected', this.date)
        let x = this.date.split("-")
        const selectedDate =  x[2] + "-" +x[1] + "-" + x[0]
        // console.log(selectedDate);
        this.$router.push({ path: "/HomePage" , query: {updatedDate: selectedDate}})
      }
    }
  }
}
</script> 

<style>
  button {
    background-color: rgb(126, 216, 87); /* change the background color of the button to lime green */
    border-radius: 10px; /* make the edges of the button rounded */
    border: 2px solid rgb(126, 216, 87); /* add a lime green border to the button */
    padding: 10px 50px; /* add some padding to the button */
    color: white;
  }
</style>