import { db } from "../firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const container = document.getElementById("solicitudes-container");

async function cargarSolicitudes() {
    const querySnapshot = await getDocs(collection(db, "solicitudes"));

    container.innerHTML = ""; // limpiar antes de renderizar

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const div = document.createElement("div");
        div.classList.add("solicitud");
        div.innerHTML = `
        <h3>${data.nombre || "Sin nombre"}</h3>
        <p><strong>Descripción:</strong> ${data.descripcion || "Sin descripción"}</p>
        `;
        container.appendChild(div);
    });
}

cargarSolicitudes();
