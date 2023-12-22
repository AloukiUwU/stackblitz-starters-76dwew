// Importation des modules nécessaires
const express = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const secureRoute = require("./routes/secure-routes");
const reminderRoute = require("./routes/reminder-routes");
const groupRoute = require("./routes/group-routes");
const routes = require("./routes/routes");
require("./auth/auth"); // Importation de la configuration d'authentification Passport

// Création de l'application Express
const app = express();

// Port d'écoute de l'application
const port = 3000;

// Utilisation de middlewares pour le traitement des requêtes
app.use(express.json()); // Middleware pour parser les données JSON
app.use(bodyParser.urlencoded({ extended: false })); // Middleware pour parser les données de formulaire

// Démarrage du serveur Express
app.listen(port, () => {
  console.log(`This app is listening on port ${port}`);
});

// Utilisation des routes définies dans les fichiers correspondants
app.use(routes); // Routes générales
app.use(secureRoute); // Routes sécurisées nécessitant une authentification JWT
app.use(reminderRoute); // Routes relatives aux reminders
app.use(groupRoute); // Routes relatives aux groupes

// Route d'accueil
app.get("/", (req, res) => {
  res.send(
    "Welcome to CUM Prototype Application! Try to login to test our features!"
  );
});
