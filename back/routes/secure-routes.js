// Import des modules nécessaires
const express = require("express");
const router = express.Router();
const passport = require("passport");

// Middleware : Utilisation de la stratégie d'authentification "jwt" avec Passport
router.use(passport.authenticate("jwt", { session: false }));

// Endpoint sécurisé pour afficher le profil de l'utilisateur authentifié
router.get("/profile", (req, res, next) => {
  // Renvoi d'une réponse JSON avec un message, les données de l'utilisateur et le token (s'il existe)
  res.json({
    message: "You made it to the secure route",
    user: req.users, // L'utilisateur authentifié (remarque : il serait plus probablement `req.user` au lieu de `req.users`)
    token: req.query.secret_token, // Récupération du token depuis les paramètres de requête s'il est présent
  });
  console.log(req.users); // Affichage des données de l'utilisateur dans la console (à des fins de débogage)
});

// Exportation du routeur Express
module.exports = router;