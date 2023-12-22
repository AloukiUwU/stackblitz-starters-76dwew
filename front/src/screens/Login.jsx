import { Link } from "react-router-dom";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  saveAuthToken,
  getAuthToken,
  removeAuthToken,
} from "../utils/localStorage";
import axios from "axios";

export function Login() {
  // État local pour gérer le message d'erreur
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");  // État local pour gérer l'email dans le formulaire
  const [password, setPassword] = useState("");  // État local pour gérer le mot de passe dans le formulaire

  // Fonction appelée lors de la soumission du formulaire
  const handleFormSubmit = (event) => {
    console.log("click");
    event.preventDefault();  // Empêche la soumission du formulaire par défaut

    // Vérifie si l'email ou le mot de passe est vide
    if (email.trim() === "" || password.trim() === "") {
      setErrorMessage("Pas de texte dans l'input !");
      setEmail("");
      setPassword("");
      return;
    }

    // Envoie une requête POST au serveur pour la connexion
    axios
      .post(
        "https://localhost:3000/login",
        {
          email,
          password,
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
        navigate("/dashboard");  // Redirige vers le tableau de bord après la connexion réussie
      })
      .catch(function (error) {
        if (error.response) {
          // La requête a été effectuée et le serveur a répondu avec un code d'état qui ne fait pas partie de la plage 2xx
          setErrorMessage(error.response.data.details.message);
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // La requête a été effectuée mais aucune réponse n'a été reçue
          setErrorMessage(
            "Service temporairement indisponible. Veuillez réessayer plus tard."
          );
          console.log(error.request);
        } else {
          // Quelque chose s'est mal passé lors de la configuration de la requête
          setErrorMessage(error.message);
        }
        console.log(error.config);
      });
    //navigate(-1);
  };

  return (
    <div className="login">
      <a href="/" className="back-link">
        Retour
      </a>
      <h1>Remindr</h1>
      <h3>Bienvenue à toi !</h3>
      {errorMessage && (
        <div className="errorBlock">
          <p>{errorMessage}</p>
        </div>
      )}
      {/* Formulaire de connexion */}
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          placeholder="Email"
        />
        <input
          type="password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          placeholder="Mot de passe"
        />
        <button type="submit">Se connecter</button>
      </form>
      <p>
        Nouveau sur Remindr ? <a href="signup">Inscris-toi ici.</a>
      </p>
    </div>
  );
}