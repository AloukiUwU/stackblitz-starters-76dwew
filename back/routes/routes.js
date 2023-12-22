// Import des modules nécessaires
const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

// Création du routeur Express
const router = express.Router();

// Endpoint pour le processus d'inscription (signup)
router.post("/signup", (req, res, next) => {
  // Utilisation de la stratégie d'authentification "signup" avec Passport
  passport.authenticate("signup", { session: false }, (err, user, info) => {
    // Gestion des erreurs potentielles lors de l'inscription
    return err
      ? res.status(err.status).json(err) // En cas d'erreur, renvoyer le code d'erreur et le message
      : !user
      ? res.status(info.status).json({ error: info.message }) // En cas d'utilisateur non créé, renvoyer le code d'erreur et le message
      : req.login(user, { session: false }, (error) => {
          // Connexion automatique après l'inscription réussie
          if (error) return next(error);
          // Création du token JWT avec les données de l'utilisateur
          const body = { _id: user._id, email: user.email };
          const token = jwt.sign({ user: body }, "TOP_SECRET");
          // Renvoi d'un message de succès, des données de l'utilisateur et du token JWT
          return res.json({ message: "Signup successful", user, token });
        });
  })(req, res, next);
});

// Endpoint pour le processus de connexion (login)
router.post("/login", (req, res, next) => {
  // Utilisation de la stratégie d'authentification "login" avec Passport
  passport.authenticate("login", { session: false }, (err, user, info) => {
    // Gestion des erreurs potentielles lors de la connexion
    return err
      ? res.status(err.status).json(err) // En cas d'erreur, renvoyer le code d'erreur et le message
      : !user
      ? res.status(403).json({ error: info.message }) // En cas d'échec de connexion, renvoyer le code d'erreur et le message
      : req.login(user, { session: false }, (error) => {
          // Connexion automatique après une connexion réussie
          if (error) return next(error);
          // Création du token JWT avec les données de l'utilisateur
          const body = { _id: user._id, email: user.email };
          const token = jwt.sign({ user: body }, "TOP_SECRET");
          // Renvoi du token JWT en cas de connexion réussie
          return res.json({ token });
        });
  })(req, res, next);
});

// Exportation du routeur Express
module.exports = router;
