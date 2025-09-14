import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC3ASWc6EH8qX46wHcOfMmg0sevivOQJh8",
  authDomain: "tramitados-9a3f1.firebaseapp.com",
  projectId: "tramitados-9a3f1",
  storageBucket: "tramitados-9a3f1.firebasestorage.app",
  messagingSenderId: "642561222614",
  appId: "1:642561222614:web:eba3fb0711da8c1e222677",
  measurementId: "G-WTHP4FXM8N"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar Firestore
export const db = getFirestore(app);
