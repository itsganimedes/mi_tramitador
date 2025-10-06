import { db, auth } from "../firebase-config.js";
import { collection, onSnapshot, doc, getDoc, updateDoc, orderBy, query } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

let container = document.getElementById("solicitudes-container");

document.addEventListener("DOMContentLoaded", () => {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {
                const uid = user.uid;
                const userRef = doc(db, "usuarios", uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    const data = userSnap.data();
                    mostrarUIUsuario();
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


function mostrarUIUsuario()
{
    document.querySelector(".login-button").style.display = "none";
    document.querySelector(".signout-button").style.display = "block";
}

function cargarSolicitudes() {
    const solicitudesCol = query(collection(db, "solicitudes"), orderBy("prioridad", "asc"));

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {
                const uid = user.uid;
                const userRef = doc(db, "usuarios", uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    const userData = userSnap.data();

                    if (userData.rol === "user")
                    {
                        alert("No tienes permisos.")
                        return;
                    }
                    
                    // Suscripción en tiempo real
                    onSnapshot(solicitudesCol, (querySnapshot) => {
                        container.innerHTML = ""; // limpiar antes de renderizar

                        querySnapshot.forEach((doc) => {
                            const data = doc.data();
                            if (userData.solicitudTomada !== doc.id)
                            {
                                return;
                            }

                            const div = document.createElement("div");

                            if (!userData.servicio.includes(data.servicio)) {
                                return;
                            }


                            let urg = "Normal";

                            if (data.prioridad < 5)
                            {
                                return;
                            }

                            if (data.urgencia === "emergencia"){
                                urg = "Lo antes posible";
                            } else if (data.urgencia === "urgente"){
                                urg = "Para hoy"
                            } else if (data.urgencia === "normal"){
                                let fechaponer = data.fechapedido.toDate();
                                urg = "Para el día " + fechaponer.toLocaleString();
                            }

                            div.classList.add("solicitud");
                            if (data.prioridad == 5)
                            {
                                div.innerHTML = `
                                <h3>${data.servicio || "Desconocido"}</h3>
                                <p class="soli_username">${data.nombre}</p>
                                <p><i class="fa-solid fa-bolt"></i><strong> Urgencia: </strong>${urg}</p>
                                <p><i class="fa-solid fa-location-dot"></i><strong> Ubicación: </strong>${data.ubicacion}</p>
                                <p><i class="fa-solid fa-clock"></i><strong> Horario: </strong>${data.hora}</p>
                                <p class="comentario"><strong>Descripción:</strong> ${data.comentario || "Sin descripción"}</p>
                                <button onclick="finalizar('${doc.id}',this)">Finalizar</button>
                                `;
                            } else if (data.prioridad == 6)
                            {
                                div.innerHTML = `
                                <h3>${data.servicio || "Desconocido"}</h3>
                                <p class="soli_username">${data.nombre}</p>
                                <p><i class="fa-solid fa-bolt"></i><strong> Urgencia: </strong>${urg}</p>
                                <p><i class="fa-solid fa-location-dot"></i><strong> Ubicación: </strong>${data.ubicacion}</p>
                                <p><i class="fa-solid fa-clock"></i><strong> Horario: </strong>${data.hora}</p>
                                <p class="comentario"><strong>Descripción:</strong> ${data.comentario || "Sin descripción"}</p>
                                <p>Finalizado</p>
                                `;
                            }
                            
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

//finalizar

window.finalizar = async function (docId) {
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
        alert("No tienes permiso para tomar solicitudes.");
        return;
    }

    try{
        const solicitudRef = doc(db, "solicitudes", docId);

        // Obtener el documento actual
        const solicitudSnap = await getDoc(solicitudRef);
        if (!solicitudSnap.exists()) {
            alert("La solicitud no existe.");
            return;
        }

        const data = solicitudSnap.data();

        let update = {finalizadoTramitador: true}

        update.prioridad = 6;

        await updateDoc(solicitudRef, update);
        alert("Finalizado exitosamente.");
    }
    catch(err)
    {
        console.log("Error: ", err);
    }
}