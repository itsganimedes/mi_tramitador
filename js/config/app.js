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
            document.querySelector(".signout-button").style.display = "none";
        }
    });
});

function mostrarUIUsuario(nombre)
{
    document.getElementById("username").textContent='¡Es un gusto verte acá, '+nombre+'!';
    document.querySelector(".login-button").style.display = "none";
    document.querySelector(".signout-button").style.display = "block";
}

function cargarSolicitudes() {
    const solicitudesCol = collection(db, "solicitudes");

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {
                const uid = user.uid;
                const userRef = doc(db, "usuarios", uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    const data = userSnap.data();

                    if (data.rol === "user")
                    {
                        alert("No tienes permisos.")
                        return;
                    }
                    
                    // Suscripción en tiempo real
                    onSnapshot(solicitudesCol, (querySnapshot) => {
                        container.innerHTML = ""; // limpiar antes de renderizar

                        querySnapshot.forEach((doc) => {
                            const data = doc.data();
                            const div = document.createElement("div");

                            if (!userSnap.data().servicio.includes(data.servicio)) {
                                return;
                            }

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

                } else {
                    console.log("No existe el documento del Usuario");
                }
            } catch (error) {
                console.error("Error al obtener Usuario:", error);
            }
        } else {
            
        }
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
