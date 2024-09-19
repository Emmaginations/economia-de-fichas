<script setup>
   import { ref } from "vue"; // Ensure `ref` is imported from Vue
  import { getFirestore, collection, query, where, getDocs } from "firebase/firestore"; // Correct imports from Firebase
  import { firebaseApp } from "@/main"; // Import your Firebase app

  const db = getFirestore(firebaseApp); // Initialize Firestore with your app
  const loginCollection = collection(db, "LoginInfo"); // Reference to the Firestore collection

  // Reactive data properties
  const username = ref("");
  const password = ref("");
  const error = ref(null);

  // Async function to handle login logic
  async function handleLogin() {
    error.value = null; // Clear error before starting

    try {
      // Query Firestore to find a document where "Nombre" equals entered username
      const q = query(loginCollection, where("Nombre", "==", username.value));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // No matching username found
        error.value = "Username not found";
      } else {
        // Iterate over the documents (though there should ideally be only one match)
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          if (userData.Contraseña === password.value) {
            alert("Login successful!");
            error.value = null; // Clear error message
            // Proceed with login logic (e.g., redirect or store session data)
          } else {
            error.value = "Incorrect password";
          }
        });
      }
    } catch (err) {
      // Handle Firestore errors
      error.value = "Login failed: " + err.message;
    }
  }
</script>

<template>
    <ul>
    <li v-for="person in login" :key="person.id">
      <p>{{ person.Nombre }}</p>
      <p>
        <sub>contrasena: {{ person.Contraseña }}</sub>
      </p>
      <br />
    </li>
    </ul>

  <div>
    <h2>Login</h2>
    <input v-model="username" placeholder="Username" />
    <input v-model="password"  placeholder="Password" />
    <button @click="handleLogin">Login</button>
    <p v-if="error" style="color: red">{{ error }}</p>
  </div>
</template>

<style scoped>
.login-container {
  max-width: 400px;
  margin: auto;
  padding: 1em;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.form-group {
  margin-bottom: 1em;
}

label {
  display: block;
  margin-bottom: 0.5em;
}

input {
  width: 100%;
  padding: 0.5em;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 0.7em;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
}

.error-message {
  color: red;
  margin-top: 1em;
}
</style>