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

  app.get('/api/prizes', async (req, res) => {
    const { participant } = req.query;
    try {
      const snapshot = await db.collection('Premios').where('Participante', '==', participant).get();
      if (snapshot.empty) {
        return res.status(200).json({ success: true, prizes: {} });
      }
      const prizes = snapshot.docs[0].data();
      return res.status(200).json({ success: true, prizes });
    } catch (error) {
      console.error('Error fetching prizes:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  });

  app.put('/api/prizes', async (req, res) => {
    const { participant, level, value } = req.body;
    try {
      const snapshot = await db.collection('Premios').where('Participante', '==', participant).get();
      if (snapshot.empty) {
        return res.status(200).json({ success: true, prizes: {} });
      }
      const docRef = snapshot.docs[0].ref;
      await docRef.update({ [level]: value });
      return res.status(200).json({ success: true, message: 'Prize updated successfully' });
    } catch (error) {
      console.error('Error updating prize:', error);
      return res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post('/api/prizes', async (req, res) => {
    const { participant, prizes } = req.body;
  
    try {
      const docRef = await db.collection('Premios').add({
        Participante: participant,
        ...prizes
      });
  
      res.status(200).json({ success: true, id: docRef.id });
    } catch (error) {
      console.error('Error creating prizes:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get('/api/stars-earned', async (req, res) => {
    try {
      const { participant, week } = req.query;
      console.log('Received request for stars-earned:', { participant, week });
  
      if (!participant || !week || !/^\d{4}-\d{2}-\d{2}$/.test(week)) {
        console.log("Incorrect params");
        return res.status(400).json({ success: false, error: 'Invalid participant or week format' });
      }
  
      const startDate = week;
    
      // Calculate the end date (7 days later) in YYYY-MM-DD format
      const endDate = new Date(week);
      endDate.setDate(endDate.getDate() + 6);
      const endDateString = endDate.toISOString().split('T')[0];
  
      console.log('Date range:', { startDate, endDate: endDateString });
  
      const snapshot = await db.collection('Tareas')
        .where('Participante', '==', participant)
        .where('Fecha', '>=', startDate)
        .where('Fecha', '<=', endDateString)
        .where('Cumplido', 'in', [true, 'true'])
        .get();

      console.log('Query executed successfully');
  
      const starsEarned = snapshot.size;
      console.log('Query result size:', starsEarned);
  
      return res.status(200).json({ success: true, starsEarned });
    } catch (error) {
      console.error('Error fetching stars earned:', error);
      console.error('Stack trace:', error.stack);
      console.error('Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
      return res.status(500).json({ success: false, error: 'An unexpected error occurred' });
    }
  });


  app.post('/api/recover-password', async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        // Don't reveal that the email doesn't exist
        return res.status(200).json({ message: 'If the email exists, a recovery link will be sent.' });
      }
  
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now
  
      user.resetPasswordToken = token;
      user.resetPasswordExpires = expiresAt;
      await user.save();
  
      const resetLink = `https://yourdomain.com/reset-password?token=${token}`;
  
      // Send email with resetLink
      const transporter = nodemailer.createTransport({
        // Configure your email service here
      });
  
      await transporter.sendMail({
        from: 'noreply@yourdomain.com',
        to: email,
        subject: 'Password Reset Request',
        html: `Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 1 hour.`
      });
  
      res.status(200).json({ message: 'If the email exists, a recovery link will be sent.' });
    } catch (error) {
      console.error('Password recovery error:', error);
      res.status(500).json({ message: 'An error occurred during the password recovery process.' });
    }
  });
  
  // Password reset endpoint
  app.post('/api/reset-password', async (req, res) => {
    const { token, password } = req.body;
  
    try {
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
      });
  
      if (!user) {
        return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
      }
  
      user.password = password; // Assume you're hashing the password before saving
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
  
      res.status(200).json({ message: 'Your password has been successfully reset.' });
    } catch (error) {
      console.error('Password reset error:', error);
      res.status(500).json({ message: 'An error occurred during the password reset process.' });
    }
  });


app.listen(PORT, () => {
    console.log('Server is running on http://localhost:${PORT}');
});


