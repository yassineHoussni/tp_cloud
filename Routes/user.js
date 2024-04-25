const express = require('express');
const router = express.Router();
const User = require('../Models/UserModel');

router.get('/all', (req, res) => {
    User.find().then(utilisateurs => res.send(utilisateurs));
});

router.get('/names', (req, res) => {
    User.find({}, { "Nom_Complet": 1, _id: 0 }).then(noms => res.send(noms));
});

router.post('/add', (req, res) => {
    User.create(req.body);
});

router.put('/update/:name', (req, res) => {
    User.updateOne({ "Nom_Complet": req.params.name }, { $set: req.body }).then(utilisateur => res.send(utilisateur));
});

router.delete('/delete/:name', (req, res) => {
    User.deleteOne({ "Nom_Complet": req.params.name }).then(utilisateur => res.send(utilisateur));
});

module.exports = router;
