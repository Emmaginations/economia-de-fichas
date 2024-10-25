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

app.post('/register', (req, res) => {
    res.send({
        message: 'Hello your user was regstered!'
    })
})

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


