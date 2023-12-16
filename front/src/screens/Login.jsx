import { Link } from "react-router-dom";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveAuthToken, getAuthToken, removeAuthToken } from "../utils/localStorage";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (title.trim() === "" || body.trim() === "") {
      alert("Pas de texte dans l'input");
      setEmail("");
      setPassword("");
      return;
    }
    axios
      .post(
        "http://localhost:3000/login",
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
        console.log("SUCCESS : ", response);
        const token = response.data.token;
        saveAuthToken(token);
        navigate("/dashboard")
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
    <div className="welcome">
      <h1>Remindr</h1>
      <h3>Bienvenue à toi !</h3>
      <br />
      <form onSubmit={handleFormSubmit}>
        <input type="text" name="email" onChange={setEmail} value={email} />
        <input
          type="password"
          name="password"
          onChange={setPassword}
          value={password}
        />

        <button type="submit">Se connecter</button>
      </form>
      <p>
        Nouveau sur remindr ? <Link>Inscris-toi ici.</Link>
      </p>
    </div>
  );
}
