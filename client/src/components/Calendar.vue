<script setup>
import { ref, computed, watch } from 'vue';
import axios from 'axios';

const props = defineProps({
  participant: String,
});

const emit = defineEmits(['update:week']);

const currentDate = new Date();
const weeks = ref([]);
const selectedWeek = ref("");
const weekDays = ref([]);
const taskCounts = ref({});

// Generate weeks for the next month
// Helper function to find the start of the week (Monday in this case)
const getStartOfWeek = (date) => {
  // Clone the date and find the previous Monday (or Sunday depending on start day)
  const day = date.getDay();
  const diff = (day === 0 ? -6 : 1) - day; // Calculate the difference to reach Monday (adjust -6 for Sunday start)
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() + diff);
  return startOfWeek;
};

// Generate weeks for the next month
weeks.value = [];
let startOfWeek = getStartOfWeek(currentDate); // Find the start of the current week

for (let i = 0; i < 5; i++) {
  const start = new Date(startOfWeek);
  start.setDate(startOfWeek.getDate() + i * 7);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  weeks.value.push({
    value: start.toISOString().split('T')[0],
    label: `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`,
  });
}

const updateWeekDays = () => {
  if (selectedWeek.value) {
    const startDate = new Date(selectedWeek.value + 'T00:00:00');
    console.log('Start of Week:', startDate);
    
    weekDays.value = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      console.log(`Day ${i}:`, day);
      return day.toISOString().split('T')[0];
    });

    console.log('Week Days:', weekDays.value);
  }
};

// API call to count tasks
const fetchTaskCounts = async () => {
  if (!props.participant) return;
  
  try {
    const response = await axios.get('http://localhost:5000/api/task-counts', {
      params: { 
        participant: props.participant,
        dates: weekDays.value
      }
    });

    if (response.data.success) {
      taskCounts.value = response.data.taskCounts;
    } else {
      console.error('Failed to fetch task counts:', response.data.error);
    }
  } catch (error) {
    console.error('Error fetching task counts:', error);
  }
};

watch(() => props.week, (newWeek) => {
  selectedWeek.value = newWeek;
  updateWeekDays();
  fetchTaskCounts();
});

watch(selectedWeek, (newWeek) => {
  emit('update:week', newWeek);
  updateWeekDays();
  fetchTaskCounts();
});

const formattedDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', timeZone: 'UTC' });
};
</script>

<template>
  <div class="week-calendar">
    <div class="week-selector">
      <label for="week-select">Seleccionar semana:</label>
      <select id="week-select" v-model="selectedWeek" class="week-select">
        <option v-for="week in weeks" :key="week.value" :value="week.value">
          {{ week.label }}
        </option>
      </select>
    </div>
    <div class="calendar-grid">
      <div v-for="day in weekDays" :key="day" class="day-block">
        <div class="date">{{ formattedDate(day) }}</div>
        <div class="task-count">
          <span>{{ taskCounts[day] || 0 }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.week-calendar {
  width: 100%;
  max-width: 800px;
  margin: 2rem auto;
}

.week-selector {
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.week-select {
  margin-left: 0.5rem;
  padding: 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid #ccc;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
}

.day-block {
  background-color: #f3f4f6;
  border-radius: 0.5rem;
  padding: 1rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100px;
}

.date {
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.task-count {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.calendar-icon {
  margin-right: 0.25rem;
}
</style>