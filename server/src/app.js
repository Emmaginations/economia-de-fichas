console.log("hello")

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')


const admin = require('firebase-admin');
const serviceAccount = require('../economia-de-fichas-9fbf4-firebase-adminsdk-j1qha-7b482d72fb.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = db;

const app = express() // builds express server
const PORT = process.env.PORT || 5000;
app.use(morgan('combined')) // allows easy logging
app.use(bodyParser.json()) // allows express app to easily parse json requests
app.use(cors()) // allows any client to access - can be secutity risk

app.post('/api/login', async (req, res) => {
    const { Nombre, Contraseña } = req.body;
    try {
        const snapshot = await db.collection('LoginInfo').where("Nombre", "==", Nombre).get();

        if (snapshot.empty) {
            return res.status(404).json({ success: false, error: 'Username not found' });
        }

        let userFound = false;

        snapshot.forEach(doc => {
            const userData = doc.data();
            if (userData.Contraseña === Contraseña) {
                userFound = true;
                return res.status(200).json({
                    success: true,
                    Nombre: userData.Nombre,
                    Papel: userData.Papel
                });
            }
        });

        if (!userFound) {
            return res.status(401).json({ success: false, error: 'Incorrect password' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/signup', async (req, res) => {
    const { Nombre, Contraseña, Correo, Papel } = req.body;
    console.log("Received data:", {Nombre, Contraseña, Correo, Papel });
    try {
        // Check if the username already exists
        const snapshot = await db.collection('LoginInfo').where("Nombre", "==", Nombre).get();

        if (!snapshot.empty) {
            return res.status(400).json({ success: false, error: "Este nombre de usuario ya se usa" });
        }

        // Add new user to Firestore
        await db.collection('LoginInfo').add({
            Nombre,
            Contraseña,
            Correo,
            Papel
        });

        // Return a success message
        res.status(200).json({ success: true, message: "Usuario registrado" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/participants', async (req, res) => {
    const tutor = req.query.tutor; // Get the tutor's username from query parameters

    try {
        const snapshot = await db.collection('LoginInfo').where('Tutor', '==', tutor).get();

        if (snapshot.empty) {
            return res.status(404).json({ success: false, error: 'No participants found for this tutor' });
        }

        const participants = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return res.status(200).json({ success: true, participants });
    } catch (error) {
        console.error('Error fetching participants:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/tareas', async (req, res) => {
    const { usuario, participante, fecha } = req.query; // Get parameters from query string
    console.log(fecha);
    try {
        const snapshot = await db.collection('Tareas')
            .where("Usario", "==", usuario)
            .where("Participante", "==", participante)
            .where("Fecha", "==", fecha)
            .get();

        if (snapshot.empty) {
            return res.status(404).json({ success: false, error: 'No tasks found' });
        }

        const tareas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return res.status(200).json({ success: true, tareas });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/addtarea', async (req, res) => {
    const { Nombre, Participante, Usario, Fecha } = req.body;

    try {
        const newTask = {
            Cumplido: false,
            Nombre,
            Participante,
            Usario,
            Fecha,
        };

        // Add new task to Firestore
        const docRef = await db.collection('Tareas').add(newTask);
        return res.status(201).json({ success: true, id: docRef.id });
    } catch (error) {
        console.error('Error adding task:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/signupParticipant', async (req, res) => {
    const { Nombre, Contraseña, Correo, Numero, Papel, Tutor, Contacto } = req.body;
  
    try {
      // Check if the username already exists
      const snapshot = await db.collection('LoginInfo').where("Nombre", "==", Nombre).get();
  
      if (!snapshot.empty) {
        return res.status(400).json({ success: false, error: "Este nombre de usuario ya se usa" });
      }
  
      // Add new participant to Firestore
      const newParticipant = {
        Nombre,
        Contraseña,
        Papel,
        Tutor,
        Contacto
      };
  
      if (Correo) {
        newParticipant.Correo = Correo;
      }
      if (Numero) {
        newParticipant.Numero = Numero;
      }
  
      await db.collection('LoginInfo').add(newParticipant);
  
      // Return a success message
      res.status(200).json({ success: true, message: "Usuario registrado correctamente" });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post('/api/loginparticipant', async (req, res) => {
    const { Nombre, Contraseña } = req.body;
  
    try {
      const snapshot = await db.collection('LoginInfo').where("Nombre", "==", Nombre).get();
  
      if (snapshot.empty) {
        return res.status(404).json({ success: false, error: 'Username not found' });
      }
  
      let userFound = false;
  
      snapshot.forEach(doc => {
        const userData = doc.data();
        if (userData.Contraseña === Contraseña) {
          userFound = true;
          return res.status(200).json({
            success: true,
            Nombre: userData.Nombre,
            Papel: userData.Papel
          });
        }
      });
  
      if (!userFound) {
        return res.status(401).json({ success: false, error: 'Incorrect password' });
      }
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get('/api/participantslist', async (req, res) => {
    const { tutor } = req.query;
  
    try {
      // Query Firestore to find participants with the given tutor
      const snapshot = await db.collection('LoginInfo').where("Tutor", "==", tutor).get();
  
      if (snapshot.empty) {
        return res.status(404).json({ success: false, error: 'No participants found' });
      }
  
      // Map the snapshot results into an array of participants
      const participants = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
  
      // Return participants data
      res.status(200).json({ success: true, participants });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

app.get('/api/task-counts', async (req, res) => {
    const { participant, dates } = req.query;
  
    if (!participant || !dates || !Array.isArray(dates)) {
      return res.status(400).json({ success: false, error: "Invalid parameters" });
    }
  
    try {
      const tasksCollection = db.collection('Tareas');
      let taskCounts = {};
  
      // Loop through the provided dates and fetch tasks for each date
      for (const date of dates) {
        const snapshot = await tasksCollection
          .where("Participante", "==", participant)
          .where("Fecha", "==", date)
          .get();
        taskCounts[date] = snapshot.size; // Count the number of tasks for each date
      }
  
      // Return the task counts for each date
      res.status(200).json({ success: true, taskCounts });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
});

app.put('/api/tareas/:id', async (req, res) => {
    const taskId = req.params.id;
    const { Cumplido } = req.body;
  
    try {
      const taskRef = db.collection('Tareas').doc(taskId);
      const task = await taskRef.get();
  
      if (!task.exists) {
        return res.status(404).json({ success: false, error: 'Task not found' });
      }
  
      await taskRef.update({ Cumplido });
  
      return res.status(200).json({ success: true, message: 'Task updated successfully' });
    } catch (error) {
      console.error('Error updating task:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  });

app.get('/api/data', async (req, res) => {
    try {
        const snapshot = await db.collection('LoginInfo').get();
        
        const login = snapshot.docs.map(doc=> ({ id: doc.id, ...doc.data()}));
        return res.status(200).json(login);
    } catch (error) {
        console.error('Error fetching data from Firestore:', error);
        res.status(500).json({ error: error.message });
    }
})

app.listen(PORT, () => {
    console.log('Server is running on http://localhost:${PORT}');
});


