// Fonction pour sauvegarder le token dans localStorage
export function saveAuthToken(token) {
    localStorage.setItem('monToken', token);
  };
  
  // Fonction pour récupérer le token depuis localStorage
  export function getAuthToken () {
    return localStorage.getItem('monToken');
  };
  
  // Fonction pour supprimer le token depuis localStorage
  export function removeAuthToken () {
    localStorage.removeItem('monToken');
  };