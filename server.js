require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const User = require('./Models/UserModel');
const PORT = process.env.PORT;
const MONGO_URL = process.env.URL_MONGOOSE; 
const DATABASE_NAME = process.env.DBNAME; 
const TOKEN_SECRET = require('crypto').randomBytes(48).toString('hex');

app.use(cors());
app.use(express.json());
mongoose.connect(`${MONGO_URL}/${DATABASE_NAME}`); 

app.use('/auteur', require('./Routes/auteur'));
app.use('/editeur', require('./Routes/editeur'));
app.use('/livre', require('./Routes/livre'));
app.use('/user', require('./Routes/user'));

app.post('/register', async (req, res) => {
    const { email, fullName, username, password } = req.body;
    const existingUser = await User.findOne({ email }); 
    if (existingUser) {
        return res.status(400).json({ message: "L'utilisateur existe déjà." }); 
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ email, mdp: hashedPassword, Nom_Complet: fullName, username });
    res.status(201).json({ message: "Utilisateur créé avec succès." });
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "Utilisateur non trouvé." });
    }
    const isMatch = await bcrypt.compare(password, user.mdp);
    if (!isMatch) {
        return res.status(401).json({ message: "Mot de passe incorrect." });
    }
    const token = jwt.sign({ userId: user._id }, TOKEN_SECRET);
    res.status(200).json({ token });
});

app.listen(PORT, (error) => {
    if (!error) {
        console.log(`Écoute sur le port ${PORT}`);
    } else {
        console.log(`Erreur lors du lancement`);
    }
});

