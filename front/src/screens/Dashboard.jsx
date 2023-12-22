import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

//Voici une premiere structure pour le dashboard
export function Dashboard() {
    return (
      <div className="dashboard">
        <h1>Tableau de Bord</h1>
        <div className="widget">
          <h2>Statistiques</h2>
          <p>Utilisateurs enregistrés : 100</p>
          <p>Reminders actifs : 50</p>
        </div>
        <div className="widget">
          <h2>Liste des Reminders</h2>
          <ul>
            <li>Reminder 1</li>
            <li>Reminder 2</li>
            <li>Reminder 3</li>
          </ul>
        </div>
        <div className="widget">
          <h2>Dernières activités</h2>
          <p>Utilisateur X a créé un Reminder</p>
          <p>Utilisateur Y s'est connecté</p>
        </div>
      </div>
    );
  }