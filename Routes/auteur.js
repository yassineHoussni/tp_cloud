const express = require('express');
const Router = express.Router();
const Livre = require('../Models/LivresModels');
const Auteur = require('../Models/AuteursModel');

router.get('/all', (req, res) => {
    Auteur.find()
        .then(auteurs => res.json(auteurs))
        .catch(err => res.status(400).json(err));
});

router.get('/names', (req, res) => {
    Auteur.find({}, "nom -_id")
        .then(names => res.json(names))
        .catch(err => res.status(400).json(err));
});

router.get('/editeurs', (req, res) => {
    Livre.aggregate([
        {
            $lookup: {
                from: "editeurs",
                localField: "editeur",
                foreignField: '_id',
                as: 'editeurInfos'
            }
        },
        {
            $unwind: "$editeurInfos"
        },
        {
            $group: {
                _id: "$editeurInfos.nom",
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                nom: "$_id",
                count: 1
            }
        }
    ])
    .then(editeurs => res.json(editeurs))
    .catch(err => res.status(400).json(err));
});

router.post('/add', (req, res) => {
    Auteur.create(req.body)
        .then(auteur => res.status(201).json(auteur))
        .catch(err => res.status(400).json(err));
});

router.put('/update/:name', (req, res) => {
    Auteur.updateOne({ "nom": req.params.name }, { $set: req.body })
        .then(result => {
            if(result.modifiedCount === 0) {
                return res.status(404).json({ message: "Auteur non trouvé ou aucune modification apportée." });
            }
            res.json({ message: "Auteur mis à jour avec succès." })
        })
        .catch(err => res.status(400).json(err));
});

router.delete('/delete/:name', (req, res) => {
    Auteur.deleteOne({ "nom": req.params.name })
        .then(result => {
            if(result.deletedCount === 0) {
                return res.status(404).json({ message: "Auteur non trouvé." });
            }
            res.json({ message: "Auteur supprimé avec succès." })
        })
        .catch(err => res.status(400).json(err));
});

module.exports = router;
