import { db, auth } from "../firebase-config.js";
import { collection, onSnapshot, doc, getDoc, updateDoc, orderBy, query } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";



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
            document.querySelector(".loading").style.display = "none";
            document.querySelector(".login_and_start").style.display = "block";
        }
    });
});

function mostrarUIUsuario(nombre)
{
    document.querySelector(".login_and_start").style.display = "none";
    document.querySelector(".login-button").style.display = "none";
    document.querySelector(".signout-button").style.display = "block";
}


if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("js/config/service-worker.js")
        .then(reg => console.log("SW registrado:", reg))
        .catch(err => console.log("Error SW:", err));
    });
}

/* MENU HAMBURGUESA */

document.addEventListener("DOMContentLoaded", () => {
    const hamburgesa = document.querySelector(".hamburger");
    const nav = document.querySelector("nav");

    hamburgesa.addEventListener("click", function(e){
        nav.classList.toggle("activo");
        hamburgesa.classList.toggle("hactivo");
    })
})