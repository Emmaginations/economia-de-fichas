<script setup>
  import { ref } from "vue";
  import { getFirestore, collection, query, where, getDocs, addDoc } from "firebase/firestore"; // Correct imports from Firebase
  import { firebaseApp } from "@/main"; // Import your Firebase app

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
    }else if (contact.value == null) {
        error.value = "Por favor selecciona una manera de contacto";
    }else if (contact.value == "Correo" && email.value == "") {
        error.value = "Por favor entra un correo";
    }else if (contact.value == "WhatsApp" && number.value == "") {
        error.value = "Por favor entra un número";
    } else {
      try {
        const q = query(loginCollection, where("Nombre", "==", username.value));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
        // No matching username found
          if (contact.value = "Correo"){
          
            await addDoc(loginCollection, {
                Nombre: username.value,
                Contraseña: password.value,
                Correo: email.value,
                Papel: "participante",
                Tutor: currentUser.username,
                Contacto: "correo",
            });
              
          }else if (contact.value = "WhatsApp"){
            await addDoc(loginCollection, {
                Nombre: username.value,
                Contraseña: password.value,
                Numero: number.value,
                Papel: "participante",
                Tutor: currentUser.username,
                Contacto: "whatsapp",
            });
          }

          emit('participant-added');

        } else {
            error.value = "Este nombre de usario ya se usa"
        }
      }catch (err) {
        error.value = "Failed to register: " + err.message;
      }
  }
}

</script>

<template>

<div id="signup-window">

<h2>Inscribirse</h2>
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

<button @click="signUpP">Inscribirse</button>
<p v-if="error" style="color: red">{{ error }}</p>
</div>

</template>