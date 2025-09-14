import { db } from "../firebase-config.js";
import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const container = document.getElementById("solicitudes-container");

function cargarSolicitudes() {
    const solicitudesCol = collection(db, "solicitudes");

    // Suscripción en tiempo real
    onSnapshot(solicitudesCol, (querySnapshot) => {
        container.innerHTML = ""; // limpiar antes de renderizar

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const div = document.createElement("div");
            div.classList.add("solicitud");
            div.innerHTML = `
            <h3>${data.servicio || "Desconocido"}</h3>
            <p>${data.nombre}</p>
            <p><strong>Urgencia: </strong>${data.urgencia}</p>
            <p><strong>Ubicación: </strong>${data.ubicacion}</p>
            <p><strong>Horario: </strong>${data.hora}</p>
            <p><strong>Descripción:</strong> ${data.comentario || "Sin descripción"}</p>
            <button>Tomar</button>
            `;
            container.appendChild(div);
        });
    });
}

cargarSolicitudes();

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("js/config/service-worker.js")
        .then(reg => console.log("SW registrado:", reg))
        .catch(err => console.log("Error SW:", err));
    });
}
