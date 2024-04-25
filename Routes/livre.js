const express = require('express');
const router = express.Router();
const Livre = require('../Models/LivresModels');
const Auteur = require('../Models/AuteursModel');
const Editeur = require('../Models/EditeursModel');

router.get('/all', (req, res) => {
    Livre.find().then(livres => res.send(livres));
});

router.get('/auteurs/:bookname', async (req, res) => {
    const livre = await Livre.findOne({ nom: req.params.bookname });
    const auteurs = await Auteur.find({ _id: { $in: livre.auteurs } });
    res.send(auteurs);
});

router.get('/editeurs/:bookname', async (req, res) => {
    const livre = await Livre.findOne({ nom: req.params.bookname });
    const editeur = await Editeur.find({ _id: { $in: livre.editeur } });
    res.send(editeur);
});

router.get('/listCategorie/:category', (req, res) => {
    Livre.find({ categorie: req.params.category }).then(categorie => res.send(categorie));
});

router.get('/:year1/:year2', (req, res) => {
    Livre.find({ annee: { $gte: req.params.year1, $lte: req.params.year2 }}).then(livre => res.send(livre));
});

router.post('/add', (req, res) => {
    Livre.create(req.body);
});

router.put('/update/:name', (req, res) => {
    Livre.updateOne({ "nom": req.params.name }, { $set: req.body }).then(livre => res.send(livre));
});

router.delete('/delete/:name', (req, res) => {
    Livre.deleteOne({ "nom": req.params.name }).then(livre => res.send(livre));
});

module.exports = router;



