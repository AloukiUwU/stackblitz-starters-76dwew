import { Link } from "react-router-dom";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  saveAuthToken,
  getAuthToken,
  removeAuthToken,
} from "../utils/localStorage";
import axios from "axios";

export function Signup() {
  // Utilisation du hook `useNavigate` pour la navigation dans l'application
  const navigate = useNavigate();
  // États locaux pour gérer les champs du formulaire
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  // Fonction appelée lors de la soumission du formulaire
  const handleFormSubmit = (event) => {
    console.log("click");
    event.preventDefault();  // Empêche la soumission du formulaire par défaut

    // Vérifie si l'un des champs du formulaire est vide
    if (
      email.trim() === "" ||
      username.trim() === "" ||
      password.trim() === "" ||
      passwordConfirmation.trim() === ""
    ) {
      alert("Pas de texte dans l'input");  // Affiche une alerte si l'un des champs est vide
      setEmail("");
      setUsername("");
      setPassword("");
      setPasswordConfirmation("");
      return;
    }

    // Envoie une requête POST au serveur pour l'inscription
    axios
      .post(
        "http://localhost:3000/signup",
        {
          email,
          username,
          password,
          passwordConfirmation,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log("SUCCÈS : ", response);
        const token = response.data.token;
        saveAuthToken(token);  // Sauvegarde le token d'authentification dans le localStorage
        navigate("/dashboard");  // Redirige vers le tableau de bord après l'inscription réussie
      })
      .catch(function (error) {
        if (error.response) {
          // La requête a été effectuée et le serveur a répondu avec un code d'état qui ne fait pas partie de la plage 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // La requête a été effectuée mais aucune réponse n'a été reçue
          console.log(error.request);
        } else {
          // Quelque chose s'est mal passé lors de la configuration de la requête
          console.log("Error", error.message);
        }
        console.log(error.config);
      });
    navigate(-1);  // Redirige vers la page précédente après l'inscription réussie
  };

  return (
    <div className="signup">
      <a href="/" className="back-link">
        Retour
      </a>
      <h1>Remindr</h1>
      <h3>Bienvenue à toi !</h3>
      <br />
      {/* Formulaire d'inscription */}
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          placeholder="Email"
        />
        <input
          type="text"
          name="username"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          placeholder="Pseudonyme"
        />
        <input
          type="password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          placeholder="Mot de passe"
        />
        <input
          type="password"
          name="passwordConfirmation"
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          value={passwordConfirmation}
          placeholder="Confirmer votre mot de passe"
        />
        <button type="submit">S'inscrire</button>
      </form>
      <p>
        Déjà sur Remindr ? <a href="login">Connecte-toi ici</a>
      </p>
    </div>
  );
}
