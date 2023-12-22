// Importation des modules nécessaires
import React from "react";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";  // Importation du composant principal de l'application
import "./index.css";  // Importation du fichier de styles CSS

// Utilisation de React StrictMode pour détecter les problèmes potentiels dans l'application
// BrowserRouter pour gérer la navigation basée sur les URL
// App est le composant principal qui gère les routes de l'application
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
