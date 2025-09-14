import { db, auth } from "../firebase-config.js";
import { collection, onSnapshot, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";



const container = document.getElementById("solicitudes-container");

document.addEventListener("DOMContentLoaded", () => {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {
                const uid = user.uid;
                const userRef = doc(db, "usuarios", uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    const data = userSnap.data();
                    mostrarUIUsuario(data.nombre);
                } else {
                    console.log("No existe el documento del usuario");
                }
            } catch (error) {
                console.error("Error al obtener usuario:", error);
            }
        } else {
            alert("Necesitas estar logueado.");
        }
    });
});

function mostrarUIUsuario(nombre)
{
    document.getElementById("username").textContent='¡Es un gusto verte acá, '+nombre+'!';
}

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
