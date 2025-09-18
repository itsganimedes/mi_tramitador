import { db, auth } from "../firebase-config.js";
import { collection, onSnapshot, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
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

                            let urg = "Normal";

                            if (data.prioridad === 5)
                            {
                                return;
                            }

                            if (data.urgencia === "emergencia"){
                                urg = "Lo antes posible";
                            } else if (data.urgencia === "urgente"){
                                urg = "Para hoy"
                            } else if (data.urgencia === "normal"){
                                urg = "Mañana en adelante"
                            }

                            div.classList.add("solicitud");
                            div.innerHTML = `
                            <h3>${data.servicio || "Desconocido"}</h3>
                            <p>${data.nombre}</p>
                            <p><strong>Urgencia: </strong>${urg}</p>
                            <p><strong>Ubicación: </strong>${data.ubicacion}</p>
                            <p><strong>Horario: </strong>${data.hora}</p>
                            <p><strong>Descripción:</strong> ${data.comentario || "Sin descripción"}</p>
                            <button onclick="cambiarEstado('${doc.id}',this)">Tomar</button>
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

window.cambiarEstado = async function (docId) {
    const user = auth.currentUser;
    if (!user) {
        alert("No estás logueado.");
        return;
    }

    const userDocRef = doc(db, "usuarios", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
        alert("Tu usuario no tiene permisos.");
        return;
    }

    const userData = userDocSnap.data();
    const rol = userData.rol;

    if (rol === "user") {
        alert("No tienes permiso para cambiar el estado de solicitudes.");
        return;
    }

    try {
        // Referencia a la solicitud
        const solicitudRef = doc(db, "solicitudes", docId);

        // Obtener el documento actual
        const solicitudSnap = await getDoc(solicitudRef);
        if (!solicitudSnap.exists()) {
            alert("La solicitud no existe.");
            return;
        }

        const data = solicitudSnap.data();

        const nuevoEstado = 3;

        let nuevaPrioridad = data.prioridad;
        let updates = { realizado: nuevoEstado };
        updates.tomado = userData.nombre;

        if (data.prioridad == 5) {
            alert("Esta solicitud ya está en proceso.");
            return;
        } else {
            updates.prioridad = 5;
            alert("Tomada exitosamente. Te contactaremos a la brevedad.");
        }

        await updateDoc(solicitudRef, updates);

        console.log(`✅ Estado cambiado a ${nuevoEstado}, prioridad actualizada.`);

    } catch (error) {
        console.error("Error al cambiar estado:", error);
        alert("Error al cambiar estado.");
    }

}

cargarSolicitudes();

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("js/config/service-worker.js")
        .then(reg => console.log("SW registrado:", reg))
        .catch(err => console.log("Error SW:", err));
    });
}
