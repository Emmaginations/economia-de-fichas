<script setup>
  import { ref } from "vue";
  import { getFirestore, collection } from "firebase/firestore"; // Correct imports from Firebase
  import { firebaseApp } from "@/main"; // Import your Firebase app

  import axios from 'axios';
  
  const emit = defineEmits();

  const db = getFirestore(firebaseApp); // Initialize Firestore with your app
  const loginCollection = collection(db, "LoginInfo"); // Reference to the Firestore collection

  const username = ref("");
  const password = ref("");
  const number = ref(""); 
  const error = ref(null);
  const email = ref("");
  const contact = ref(null);

  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

  async function signUpP() {
  if (username.value == "") {
    error.value = "Por favor entra un nombre de usario";
  } else if (password.value.length < 6) {
    error.value = "Por favor entra una contraseña valida";
  } else if (contact.value == null) {
    error.value = "Por favor selecciona una manera de contacto";
  } else if (contact.value == "Correo" && email.value == "") {
    error.value = "Por favor entra un correo";
  } else if (contact.value == "WhatsApp" && number.value == "") {
    error.value = "Por favor entra un número";
  } else {
    try {
      // Make a POST request to the backend API endpoint
      const response = await axios.post('http://localhost:5000/api/signupParticipant', {
        Nombre: username.value,
        Contraseña: password.value,
        Correo: contact.value === "Correo" ? email.value : null,
        Numero: contact.value === "WhatsApp" ? number.value : null,
        Papel: "participante",
        Tutor: currentUser.username,
        Contacto: contact.value.toLowerCase()
      });

      // Handle backend response
      if (response.data.success) {
        emit('participant-added');
      } else {
        error.value = response.data.error || "Registro fallado";
      }
    } catch (err) {
      error.value = "Failed to register: " + (err.response?.data?.error || err.message);
    }
  }
}

</script>

<template>

<div id="add-participants">

<h2>Nueva Participante</h2>
<div class="inputs">
    <h3>Nombre de Usario</h3>
    <input v-model="username" placeholder="Entra el nombre de usario del participante aquí" />
</div>
<div class="inputs">
    <h3>Manera de Contacto</h3>
    <select v-model="contact">
        <option disabled value="">Por favor selecciona uno</option>
        <option>WhatsApp</option>
        <option>Correo</option>
    </select>
</div>
<div v-if="contact == 'WhatsApp'" class="inputs">
    <h3>Numero de WhatsApp</h3>
    <input v-model="number" placeholder="Entra el número del participante aquí" />
</div>
<div v-if="contact == 'Correo'" class="inputs">
    <h3>Correo Electronico</h3>
    <input v-model="email" placeholder="Entra el correo del participante aquí" />
</div>
<div class="inputs">
    <h3>Contraseña</h3>
    <input v-model="password"  placeholder="Entra la contraseña del participante aquí" />
</div>

<button @click="signUpP">Agregar</button>
<p v-if="error" style="color: red">{{ error }}</p>
</div>

</template>

<style>
#add-participants {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 400px;
  margin: 0 auto;
  padding: 30px;
  border-radius: 5px;
  background-color: #DEF3D7;
  box-shadow: 3px 5px 3px lightgray;
  
}

.inputs {
  margin: 0;
  padding: 0;
  width: 100%;
  text-align: left;
  width: 100%;
}

.check {
  display: inline-block;
}

input {
  width: 100%;
  padding: 0.5em;
  box-sizing: border-box;
}

button {
  color: white;
  border: none;
  border-radius: 5px;
  margin-top: 30px;
  box-shadow: 2px 4px 2px lightgray;
}

h2 {
  text-align: center;
  margin-bottom: 5px;
  font-size: 1.2em;
}

h3 {
  margin-top: 5px;
  font-size: .9em;
  width: 100%;
}

a {
  font-size: .75em;

}

.error-message {
  color: red;
  margin-top: 1em;
}
</style>