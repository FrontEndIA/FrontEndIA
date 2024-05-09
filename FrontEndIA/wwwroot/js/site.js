// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
// Obtener el modal
var modal = document.getElementById("modal");

// Obtener el botón que abre el modal
var btn = document.getElementById("button3");

// Obtener el elemento <span> que cierra el modal
var span = document.getElementsByClassName("close")[0];

// Cuando el usuario haga clic en el botón, abre el modal
btn.onclick = function () {
    modal.style.display = "block";
}

// Cuando el usuario haga clic en <span> (x), cierra el modal
span.onclick = function () {
    modal.style.display = "none";
}

// Cuando el usuario haga clic fuera del modal, ciérralo
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
