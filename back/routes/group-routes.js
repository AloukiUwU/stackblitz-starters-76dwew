// Import des modules nécessaires
const express = require("express");
const passport = require("passport");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const { connect } = require("./secure-routes");

// Création du routeur Express
const app = express.Router();

// Endpoint pour récupérer tous les groupes (authentification requise)
app.get(
  "/group",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // Récupération de tous les groupes depuis la base de données
    const group = await prisma.groups.findMany({});
    // Envoi des données en format JSON en réponse
    res.json(group);
  }
);

// Endpoint pour récupérer un groupe par son ID (authentification requise)
app.get(
  "/group/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // Récupération de l'ID du groupe depuis les paramètres de la requête
    const { id } = req.params;
    // Recherche du groupe par ID avec inclusion des utilisateurs et des rappels associés
    const group = await prisma.groups.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        users: true,
        reminders: true,
      },
    });
    // Envoi des données du groupe en format JSON en réponse
    res.json(group);
  }
);

// Endpoint pour créer un nouveau groupe (authentification requise)
app.post(
  "/group",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // Récupération des données du corps de la requête
    const { name, users } = req.body;
    // Création d'un nouveau groupe avec les utilisateurs connectés
    const group = await prisma.groups.create({
      data: {
        name: name,
        users: {
          connect: users.map((user) => ({
            username: user.username,
          })),
        },
      },
    });
    // Envoi des données du groupe créé en format JSON en réponse
    res.json(group);
  }
);

// Endpoint pour mettre à jour un groupe existant par son ID (authentification requise)
app.patch(
  "/group/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // Récupération de l'ID du groupe depuis les paramètres de la requête
    const { id } = req.params;
    // Récupération des données du corps de la requête
    const { name, users } = req.body;
    // Mise à jour du groupe avec les nouveaux détails et les utilisateurs connectés
    const group = await prisma.groups.update({
      where: {
        id: Number(id),
      },
      data: {
        name: name,
        users: {
          connect: users.map((user) => ({
            username: user.username,
          })),
        },
      },
      include: {
        users: true,
      },
    });
    // Envoi des données du groupe mis à jour en format JSON en réponse
    res.json(group);
  }
);

// Endpoint pour supprimer un groupe par son ID (authentification requise)
app.delete(
  "/group/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // Récupération de l'ID du groupe depuis les paramètres de la requête
    const { id } = req.params;
    // Suppression du groupe par ID
    const group = await prisma.groups.delete({
      where: {
        id: Number(id),
      },
    });
    // Envoi des données du groupe supprimé en format JSON en réponse
    res.json(group);
  }
);

// Exportation du routeur Express
module.exports = app;
