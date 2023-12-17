import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export function Home() {
    return (
      <div className="welcome">
        <h1>Remindr</h1>
        <Link to="login">Se connecter</Link>
        <Link to="signup">S'inscrire</Link>
      </div>
    );
  }