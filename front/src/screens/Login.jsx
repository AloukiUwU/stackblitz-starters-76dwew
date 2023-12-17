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
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleFormSubmit = (event) => {
    console.log("click");
    event.preventDefault();
    if (email.trim() === "" || password.trim() === "") {
      setErrorMessage("Pas de texte dans l'input !");
      setEmail("");
      setPassword("");
      return;
    }
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
        console.log("SUCCUSS : ", response);
        const token = response.data.token;
        saveAuthToken(token);
        navigate("/dashboard");
      })
      .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          setErrorMessage(error.response.data.details.message);
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          setErrorMessage(
            "Service temporairement indisponible. Veuillez-reessayez plus tard :3"
          );
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
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
        Nouveau sur remindr ? <a href="signup">Inscris-toi ici.</a>
      </p>
    </div>
  );
}
