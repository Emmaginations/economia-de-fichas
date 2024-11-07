<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import axios from 'axios';

const props = defineProps({
  participant: String,
  week: String,
  selectedDate: String,
  starsEarned: Number
});

const emit = defineEmits(['update:week', 'update:selectedDate']);

const currentDate = new Date();
const weeks = ref([]);
const selectedWeek = ref(props.week || "");
const weekDays = ref([]);
const taskCounts = ref({});
const selectedDay = ref(props.selectedDate || null);

const starsEarned = ref(0);

const isCreatingNewPrizes = ref(false);
const statusMessage = ref('');

const prizes = ref({
  Level1: '',
  Level2: '',
  Level3: '',
  Level4: '',
  Level5: ''
});

const clearPrizes = () => {
  prizes.value = {
    Level1: '',
    Level2: '',
    Level3: '',
    Level4: '',
    Level5: ''
  };
};


const starLabels = [
  "1-5 estrellas",
  "6-10 estrellas",
  "11-15 estrellas",
  "16-20 estrellas",
  "21-25 estrellas"
];

const editingPrize = ref(null);

// Helper function to find the start of the week (Monday in this case)
const getStartOfWeek = (date) => {
  const day = date.getDay();
  const diff = (day === 0 ? -6 : 1) - day; // Calculate the difference to reach Monday (adjust -6 for Sunday start)
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() + diff);
  return startOfWeek;
};

// Generate weeks for the next month
const generateWeeks = () => {
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

  if (!selectedWeek.value) {
    selectedWeek.value = weeks.value[0].value;
  }
};

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

const fetchPrizes = async () => {
  if (!props.participant) return;

  try {
    const response = await axios.get('http://localhost:5000/api/prizes', {
      params: { participant: props.participant }
    });

    if (response.data.success) {
      // Sort the prizes by level

      if (Object.keys(response.data.prizes).length === 0) {
        // No prizes found, set flag to create new prizes
        isCreatingNewPrizes.value = true;
        statusMessage.value = 'No se encontraron premios. Por favor, ingrese los nuevos premios.';
      } else {
      
      const sortedPrizes = Object.fromEntries(
        Object.entries(response.data.prizes)
          .filter(([key]) => key.startsWith('Level'))
          .sort(([a], [b]) => {
            const levelA = parseInt(a.replace('Level', ''));
            const levelB = parseInt(b.replace('Level', ''));
            return levelA - levelB;
          })
      );
      prizes.value = sortedPrizes;
      console.log('Fetched and sorted prizes:', prizes.value);
      }
    } else {
      console.error('Failed to fetch prizes:', response.data.error);
    }
  } catch (error) {
    console.error('Error fetching prizes:', error);
  }
};

const updatePrize = async (level, value) => {
  if (!props.participant) return;

  try {
    const response = await axios.put('http://localhost:5000/api/prizes', {
      participant: props.participant,
      level,
      value
    });

    if (response.data.success) {
      console.log('Prize updated successfully');
    } else {
      console.error('Failed to update prize:', response.data.error);
    }
  } catch (error) {
    console.error('Error updating prize:', error);
  }
};

const createNewPrizes = async () => {
  if (!props.participant) return;

  try {
    const response = await axios.post('http://localhost:5000/api/prizes', {
      participant: props.participant,
      prizes: prizes.value
    });

    if (response.data.success) {
      console.log('New prizes created successfully');
      isCreatingNewPrizes.value = false;
      statusMessage.value = 'Nuevos premios creados exitosamente.';
    } else {
      console.error('Failed to create new prizes:', response.data.error);
      statusMessage.value = 'Error al crear nuevos premios. Por favor, intente de nuevo.';
    }
  } catch (error) {
    console.error('Error creating new prizes:', error);
    statusMessage.value = 'Error al crear nuevos premios. Por favor, intente de nuevo.';
  }
};

const startEditing = (level) => {
  editingPrize.value = level;
};

const stopEditing = (level) => {
  editingPrize.value = null;
  if (isCreatingNewPrizes.value) {
    // Don't update prize if we're creating new ones
    return;
  }
  updatePrize(level, prizes.value[level]);
};

const selectDay = (day) => {
  selectedDay.value = day;
  emit('update:selectedDate', day);
};

const orderedPrizes = computed(() => {
    if (!prizes.value || typeof prizes.value !== 'object') {
        return [];
    }  
    return Object.entries(prizes.value)
    .filter(([key]) => key.startsWith('Level'))
    .sort(([a], [b]) => {
      const levelA = parseInt(a.replace('Level', ''));
      const levelB = parseInt(b.replace('Level', ''));
      return levelA - levelB;
    })
    .map(([level, prize], index) => ({
      level,
      label: starLabels[index],
      prize
    }));
});

/*const fetchStarsEarned = async () => {
  if (!props.participant || !selectedWeek.value) return;

  try {
    const response = await axios.get('http://localhost:5000/api/stars-earned', {
      params: {
        participant: props.participant,
        week: selectedWeek.value
      }
    });

    if (response.data.success) {
      starsEarned.value = response.data.starsEarned;
    } else {
      console.error('Failed to fetch stars earned:', response.data.error);
      statusMessage.value = 'Error al obtener las estrellas ganadas. Por favor, intente de nuevo.';
    }
  } catch (error) {
    console.error('Error fetching stars earned:', error);
    statusMessage.value = 'Error al obtener las estrellas ganadas. Por favor, intente de nuevo.';
  }
}; */



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

watch(() => props.selectedDate, (newDate) => {
  selectedDay.value = newDate;
});

watch(() => props.participant, (newParticipant) => {
  if (newParticipant) {
    clearPrizes();
    fetchPrizes();
    fetchTaskCounts();
  }
});

const formattedDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', timeZone: 'UTC' });
};

const isSelectedDay = computed(() => {
  return (day) => day === selectedDay.value;
});

onMounted(() => {
  generateWeeks();
  updateWeekDays();
  if (props.participant) {
    fetchPrizes();
  }
});

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
      <div 
        v-for="day in weekDays" 
        :key="day" 
        :class="['day-block', { 'selected': isSelectedDay(day) }]"
        @click="selectDay(day)"
      >
        <div class="date">{{ formattedDate(day) }}</div>
        <div class="task-count">
          <span>{{ taskCounts[day] || 0 }}</span>
        </div>
      </div>
    </div>



    <div class="prize-table">
      <h3>Premios</h3>
      <p v-if="statusMessage" :class="{ 'error': statusMessage.includes('Error') }">{{ statusMessage }}</p>
      <table v-if="orderedPrizes.length > 0">
        <thead>
          <tr>
            <th>Nivel</th>
            <th>Premio</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="{ level, label, prize } in orderedPrizes" :key="level">
            <td>{{ label }}</td>
            <td 
              @click="startEditing(level)" 
              @blur="stopEditing(level)"
            >
              <span v-if="editingPrize !== level">{{ prize }}</span>
              <input 
                v-else 
                v-model="prizes[level]" 
                @keyup.enter="stopEditing(level)"
                @keyup.esc="stopEditing(level)"
              >
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="isCreatingNewPrizes">
        <h4>Ingrese los nuevos premios:</h4>
        <div v-for="(label, index) in starLabels" :key="index">
          <label :for="`prize-${index + 1}`">{{ label }}:</label>
          <input 
            :id="`prize-${index + 1}`"
            v-model="prizes[`Level${index + 1}`]" 
            :placeholder="`Premio para ${label}`"
          >
        </div>
        <button @click="createNewPrizes">Guardar Nuevos Premios</button>
      </div>
      <p v-else-if="orderedPrizes.length === 0">No hay premios disponibles.</p>
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
  border: 2px solid transparent;
}

.day-block.selected {
    background-color: lightgrey;
    border-color:blue;
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