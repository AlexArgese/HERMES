import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Questo componente esegue lo scroll verso l'elemento con id corrispondente all'hash
function ScrollToHash() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Rimuove il simbolo "#" per ottenere l'id corretto
      const id = hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [hash]);

  return null;
}

export default ScrollToHash;
