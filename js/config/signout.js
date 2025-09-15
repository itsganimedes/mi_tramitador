import { auth } from '../firebase-config.js';
import { signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

//cerrarsesión
document.querySelector(".signout-button").addEventListener("click", async () => {
    try {
        await signOut(auth);
        sessionStorage.removeItem('userData');
        alert("Has Cerrado Sesión");
        location.reload();
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
    }
});