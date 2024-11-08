<script setup>
  import { ref, watch, onMounted } from "vue"; // Ensure `ref` is imported from Vue
  import AddTareas from './AddTareas.vue';
  import axios from 'axios';

  const props = defineProps({
    participant: String,
    selectedDate: String,
  });
  const emit = defineEmits(['task-updated']);

  const tareas = ref([]);
  const add = ref(false);

  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

  async function fetchTareas() {
    if (!props.participant || !props.selectedDate) {
      return;
    }
    try {
      const response = await axios.get('http://localhost:5000/api/tareas', {
        params: {
          usuario: currentUser.username,
          participante: props.participant,
          fecha: props.selectedDate
        }
      });

      // Check if the response indicates success
      if (response.data.success) {
        tareas.value = response.data.tareas;
      } else {
      console.error('Failed to fetch tasks:', response.data.error);
    }
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
  }

  async function updateTaskStatus(tarea) {
  try {
    const response = await axios.put(`http://localhost:5000/api/tareas/${tarea.id}`, {
      Cumplido: tarea.Cumplido
    });

    if (response.data.success) {
      console.log('Task status updated successfully');
    } else {
      console.error('Failed to update task status:', response.data.error);
      // Revert the checkbox if the update failed
      tarea.Cumplido = !tarea.Cumplido;
    }
    emit('task-updated');
  } catch (error) {
    console.error('Error updating task status:', error);
    // Revert the checkbox if the update failed
    tarea.Cumplido = !tarea.Cumplido;
  }
}

  onMounted(() => {
    fetchTareas();
  })

  async function addTareas() {
    add.value = true;
  }

  function resetState() {
    add.value = false;
    fetchTareas();
  }

  watch([() => props.participant, () => props.selectedDate], ([newParticipant, newDate], [oldParticipant, oldDate]) => {
  console.log('Participant or date changed:', newParticipant, newDate);
  if (newParticipant !== oldParticipant || newDate !== oldDate) {
    tareas.value = []; // Clear tasks immediately when participant or date changes
    if (newParticipant && newDate) {
      fetchTareas();
    }
  }
});

</script>

<template>
<div>
<h3>Tareas</h3>

<AddTareas :participant="props.participant" @tarea-added="resetState" v-if="add"/>

<button @click="addTareas">Agregar Tarea</button>

<div id="task-block">
    <h3>{{  selectedDate }}</h3>
    <div class="task" v-for="tarea in tareas" :key="tarea.id">
      <div class="task-info">
          <p>{{ tarea.Nombre }}</p>
        </div>
        <div class="task-status">
          <label class="checkbox-container">
            <input 
              type="checkbox" 
              :checked="tarea.Cumplido" 
              @change="() => { tarea.Cumplido = !tarea.Cumplido; updateTaskStatus(tarea); }"
            >
            <span class="checkmark"></span>
          </label>
        </div>
    </div>
</div>


</div>

</template>

<style>

#task-block {
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
}

.task {
    border-top: 1px solid black;
    border-bottom: 1px solid black;
    width: 90%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 50px;
    align-items: center;
}

.task p {
    justify-content: center;
}

h3 {
    margin-top: 40px;
}


</style>