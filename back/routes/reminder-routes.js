// Import des modules nécessaires
const express = require("express");
const passport = require("passport");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const { connect } = require("./secure-routes");

// Création du routeur Express
const app = express.Router();

// Endpoint pour récupérer tous les rappels (authentification requise)
app.get(
  "/reminder",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // Récupération de tous les rappels depuis la base de données
    const reminder = await prisma.reminders.findMany({});
    // Envoi des données des rappels en format JSON en réponse
    res.json(reminder);
  }
);

// Endpoint pour récupérer un rappel par son ID (authentification requise)
app.get(
  "/reminder/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // Récupération de l'ID du rappel depuis les paramètres de la requête
    const { id } = req.params;
    // Recherche du rappel par ID
    const reminder = await prisma.reminders.findUnique({
      where: {
        id: Number(id),
      },
    });
    // Envoi des données du rappel en format JSON en réponse
    res.json(reminder);
  }
);

// Endpoint pour créer un nouveau rappel (authentification requise)
app.post(
  "/reminder",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // Récupération des données du corps de la requête
    const { name, deadline, idUser, idGroup } = req.body;
    // Conversion de la date de rappel en objet Date
    const date = new Date(deadline);
    date.toLocaleDateString("fr");
    // Création d'un nouveau rappel dans la base de données
    const reminder = await prisma.reminders.create({
      data: {
        name: name,
        deadline: date,
        idUser,
        idGroup,
      },
    });
    // Envoi des données du rappel créé en format JSON en réponse
    res.json(reminder);
  }
);

// Endpoint pour mettre à jour un rappel existant par son ID (authentification requise)
app.patch(
  "/reminder/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // Récupération de l'ID du rappel depuis les paramètres de la requête
    const { id } = req.params;
    // Récupération des données du corps de la requête
    const { name, description, color, deadline, idGroup } = req.body;
    // Initialisation des champs à mettre à jour
    const updateFields = {};
    // Vérification et ajout des champs à mettre à jour
    if (name) updateFields.name = name;
    if (description) updateFields.description = description;
    if (color) updateFields.color = color;
    if (deadline) updateFields.deadline = new Date(deadline);
    if (idGroup) updateFields.idGroup = idGroup;
    // Mise à jour du rappel avec les nouveaux détails
    const reminder = await prisma.reminders.update({
      where: {
        id: Number(id),
      },
      data: updateFields,
    });
    // Envoi des données du rappel mis à jour en format JSON en réponse
    res.json(reminder);
  }
);

// Endpoint pour supprimer un rappel par son ID (authentification requise)
app.delete(
  "/reminder/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // Récupération de l'ID du rappel depuis les paramètres de la requête
    const { id } = req.params;
    // Suppression du rappel par ID
    const reminder = await prisma.reminders.delete({
      where: {
        id: Number(id),
      },
    });
    // Envoi des données du rappel supprimé en format JSON en réponse
    res.json(reminder);
  }
);

// Exportation du routeur Express
module.exports = app;
