<script setup>
  import { ref } from "vue"; // Ensure `ref` is imported from Vue
  import { useRouter } from 'vue-router';
  import { getFirestore, collection, query, where, getDocs } from "firebase/firestore"; // Correct imports from Firebase
  import { firebaseApp } from "@/main"; // Import your Firebase app
  import axios from 'axios';



  const db = getFirestore(firebaseApp); // Initialize Firestore with your app
  const loginCollection = collection(db, "LoginInfo"); // Reference to the Firestore collection

  const router = useRouter();

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
      }else {
        // Iterate over the documents (though there should ideally be only one match)
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          if (userData.Contraseña === password.value) {
            if (userData.Papel == "tutor") {
            alert("Login successful!");
            error.value = null; // Clear error message
            const user = {username: userData.Nombre};
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            router.push({ name: 'Home' }); // redirect to homepage
            } else {
              error.value = "Esta es una cuenta de participante"
            }
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

  async function signUp () {
    router.push({ name: 'Signup' });
  }



</script>

<template>
    

  <div id="login-window">
    <h2>Login</h2>
    <div class="inputs">
    <h3>Nombre de Usuario</h3>
    <input v-model="username" placeholder="Entra tu nombre de usario aquí" />
    </div>
    <div class="inputs">
    <h3>Contraseña</h3>
    <input v-model="password"  placeholder="Entra tu contraseña aquí" />
    <p @click ="signUp">¿No tienes cuenta? Haz clic aquí.</p>
    <br />
    <p>Se me olvidó mi contraseña.</p>
    </div>

    <button @click="handleLogin">Entrar</button>
    <p v-if="error" style="color: red">{{ error }}</p>
  </div>


</template>

<style scoped>
#login-window {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
  margin: 0 auto;
  padding: 60px;
  border-radius: 5px;
  background-color: #DEF3D7;
  box-shadow: 3px 5px 3px lightgray;
  
}

.inputs {
  margin: 0;
  padding: 0;
  width: 100%
}

input {
  width: 100%;
  padding: 0.5em;
  box-sizing: border-box;
}

button {
  width: 70%;
  padding: 0.7em;
  background-color: #61C73F;
  color: white;
  border: none;
  border-radius: 5px;
  margin-top: 30px;
  box-shadow: 2px 4px 2px lightgray;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

h3 {
  margin-top: 10px;
  font-size: .9em;
}

a {
  font-size: .75em;

}

.error-message {
  color: red;
  margin-top: 1em;
}
</style>