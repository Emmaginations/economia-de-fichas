<script setup>
import { ref, onMounted } from "vue";
import axios from 'axios';

const tareas = ref([]);

const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function fetchTareas() {
  try {
    const response = await axios.get('http://localhost:5000/api/tareas-p', {
      params: {
        participante: currentUser.username,
        fecha: getCurrentDate()
      }
    });

    if (response.data.success) {
      tareas.value = response.data.tareas;
    } else {
      console.error('Failed to fetch tasks:', response.data.error);
    }
  } catch (error) {
    console.error('Error fetching tasks:', error);
  }
}

onMounted(() => {
  fetchTareas();
});

</script>

<template>
  <div>
    <h3>Tareas para hoy</h3>

    <div id="task-block">
      <div class="task" v-for="tarea in tareas" :key="tarea.id">
        <div class="task-info">
          <p>{{ tarea.Nombre }}</p>
          <p>{{ tarea.Cumplido }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.task {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.task-info {
  flex-grow: 1;
}

.task-status {
  margin-left: 10px;
}

.checkbox-container {
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 12px;
  cursor: pointer;
  font-size: 22px;
  user-select: none;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 25px;
  width: 25px;
  background-color: #eee;
  border-radius: 4px;
}

.checkbox-container:hover input ~ .checkmark {
  background-color: #ccc;
}

.checkbox-container input:checked ~ .checkmark {
  background-color: #2196F3;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

.checkbox-container .checkmark:after {
  left: 9px;
  top: 5px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 3px 3px 0;
  transform: rotate(45deg);
}
</style>