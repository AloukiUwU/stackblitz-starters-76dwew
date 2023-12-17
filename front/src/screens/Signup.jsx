import { Link } from "react-router-dom";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  saveAuthToken,
  getAuthToken,
  removeAuthToken,
} from "../utils/localStorage";

export function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const handleFormSubmit = (event) => {
    console.log("click");
    event.preventDefault();
    if (
      email.trim() === "" ||
      username.trim() === "" ||
      password.trim() === "" ||
      passwordConfirmation.trim() === ""
    ) {
      alert("Pas de texte dans l'input");
      setEmail("");
      setUsername("");
      setPassword("");
      setPasswordConfirmation("");
      return;
    }
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
        console.log("SUCCUSS : ", response);
        const token = response.data.token;
        saveAuthToken(token);
        navigate("/dashboard");
      })
      .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
        console.log(error.config);
      });
    navigate(-1);
  };
  return (
    <div className="signup">
      <a href="/" className="back-link">Retour</a>
      <h1>Remindr</h1>
      <h3>Bienvenue à toi !</h3>
      <br />
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
