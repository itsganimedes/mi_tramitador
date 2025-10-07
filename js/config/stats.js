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
                    document.querySelector(".loading").style.display = "none";
                    const data = userSnap.data();
                    let pcobrar = document.getElementById("acobrar");
                    pcobrar.textContent = "$" + data.cobrar;
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